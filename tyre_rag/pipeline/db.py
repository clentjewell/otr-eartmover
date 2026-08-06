"""SQLite store for the trial run.

Schema is deliberately portable: spec_records map onto a future D1 table and
Airtable base; prose_chunks + embeddings map onto Vectorize; crops map onto R2
object keys. No SQLite-only feature is load-bearing except FTS5 (keyword
index), which has a documented D1/Vectorize equivalent.
"""
from __future__ import annotations

import json
import sqlite3
from pathlib import Path
from typing import Any, Iterable

from . import config

SCHEMA = """
CREATE TABLE IF NOT EXISTS files (
    file_id        TEXT PRIMARY KEY,
    path           TEXT NOT NULL,
    sha256         TEXT NOT NULL,
    manufacturer   TEXT,
    edition_year   INTEGER,
    page_count     INTEGER,
    status         TEXT DEFAULT 'pending',
    created_at     TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS pages (
    file_id      TEXT NOT NULL,
    page         INTEGER NOT NULL,
    image_path   TEXT,
    words_path   TEXT,
    status       TEXT DEFAULT 'pending',
    PRIMARY KEY (file_id, page)
);

-- One row per extraction pass per detected spec row (audit trail).
CREATE TABLE IF NOT EXISTS spec_candidates (
    id                     INTEGER PRIMARY KEY AUTOINCREMENT,
    file_id                TEXT,
    page                   INTEGER,
    pass_id                TEXT,
    row_key                TEXT,
    manufacturer           TEXT,
    edition_year           INTEGER,
    source_file            TEXT,
    size_designation       TEXT,
    tra_code               TEXT,
    rating                 TEXT,
    load_index             TEXT,
    rim_recommendation     TEXT,
    section_width_mm       REAL,
    overall_diameter_mm    REAL,
    inflation_pressure_kpa REAL,
    tkph_tmph              REAL,
    application            TEXT,
    raw_cell_context       TEXT,
    source_crop_path       TEXT,
    created_at             TEXT DEFAULT (datetime('now'))
);

-- Merged A/B record. Numbers here are served by exact lookup only; never by an
-- LLM. A record is servable only when high-confidence AND validated AND signed
-- off AND the run was finalised with --commit.
CREATE TABLE IF NOT EXISTS spec_records (
    id                     INTEGER PRIMARY KEY AUTOINCREMENT,
    file_id                TEXT,
    page                   INTEGER,
    row_key                TEXT,
    manufacturer           TEXT,
    edition_year           INTEGER,
    source_file            TEXT,
    size_designation       TEXT,
    tra_code               TEXT,
    rating                 TEXT,
    load_index             TEXT,
    rim_recommendation     TEXT,
    section_width_mm       REAL,
    overall_diameter_mm    REAL,
    inflation_pressure_kpa REAL,
    tkph_tmph              REAL,
    application            TEXT,
    raw_cell_context       TEXT,
    source_crop_path       TEXT,
    confidence             TEXT,
    needs_review           INTEGER DEFAULT 1,
    validation_flags       TEXT,        -- JSON list
    disagreements          TEXT,        -- JSON dict field -> [a, b]
    signed_off             INTEGER DEFAULT 0,
    servable               INTEGER DEFAULT 0,
    created_at             TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS prose_chunks (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    file_id       TEXT,
    page          INTEGER,
    manufacturer  TEXT,
    edition_year  INTEGER,
    source_file   TEXT,
    section_title TEXT,
    text          TEXT,
    token_estimate INTEGER,
    embedding     BLOB,
    created_at    TEXT DEFAULT (datetime('now'))
);

CREATE VIRTUAL TABLE IF NOT EXISTS prose_fts USING fts5(
    text, section_title, source_file, content=''
);

CREATE TABLE IF NOT EXISTS runs (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    started_at    TEXT,
    finished_at   TEXT,
    mode          TEXT,
    committed     INTEGER,
    cost_estimate REAL,
    notes         TEXT
);
"""

SPEC_FIELDS = [
    "manufacturer", "edition_year", "source_file", "size_designation",
    "tra_code", "rating", "load_index", "rim_recommendation",
    "section_width_mm", "overall_diameter_mm", "inflation_pressure_kpa",
    "tkph_tmph", "application", "raw_cell_context", "source_crop_path",
]

NUMERIC_FIELDS = [
    "section_width_mm", "overall_diameter_mm",
    "inflation_pressure_kpa", "tkph_tmph",
]


def connect() -> sqlite3.Connection:
    conn = sqlite3.connect(config.DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    return conn


def init_db(conn: sqlite3.Connection) -> None:
    conn.executescript(SCHEMA)
    conn.commit()


def upsert_file(conn, file_id, path, sha256, manufacturer, edition_year, page_count):
    conn.execute(
        """INSERT INTO files (file_id, path, sha256, manufacturer, edition_year, page_count)
           VALUES (?,?,?,?,?,?)
           ON CONFLICT(file_id) DO UPDATE SET
             path=excluded.path, sha256=excluded.sha256,
             manufacturer=excluded.manufacturer, edition_year=excluded.edition_year,
             page_count=excluded.page_count""",
        (file_id, str(path), sha256, manufacturer, edition_year, page_count),
    )
    conn.commit()


def file_unchanged(conn, file_id, sha256) -> bool:
    row = conn.execute(
        "SELECT sha256, status FROM files WHERE file_id=?", (file_id,)
    ).fetchone()
    return bool(row) and row["sha256"] == sha256 and row["status"] == "done"


def set_file_status(conn, file_id, status):
    conn.execute("UPDATE files SET status=? WHERE file_id=?", (status, file_id))
    conn.commit()


def page_done(conn, file_id, page) -> bool:
    row = conn.execute(
        "SELECT status FROM pages WHERE file_id=? AND page=?", (file_id, page)
    ).fetchone()
    return bool(row) and row["status"] == "done"


def record_page(conn, file_id, page, image_path, words_path, status="done"):
    conn.execute(
        """INSERT INTO pages (file_id, page, image_path, words_path, status)
           VALUES (?,?,?,?,?)
           ON CONFLICT(file_id, page) DO UPDATE SET
             image_path=excluded.image_path, words_path=excluded.words_path,
             status=excluded.status""",
        (file_id, page, str(image_path) if image_path else None,
         str(words_path) if words_path else None, status),
    )
    conn.commit()


def clear_page_records(conn, file_id, page):
    """Idempotent re-extraction: drop prior derived rows for this page."""
    for tbl in ("spec_candidates", "spec_records", "prose_chunks"):
        conn.execute(f"DELETE FROM {tbl} WHERE file_id=? AND page=?", (file_id, page))
    conn.commit()


def insert_candidate(conn, file_id, page, pass_id, row_key, rec: dict):
    cols = ["file_id", "page", "pass_id", "row_key"] + SPEC_FIELDS
    vals = [file_id, page, pass_id, row_key] + [rec.get(f) for f in SPEC_FIELDS]
    conn.execute(
        f"INSERT INTO spec_candidates ({','.join(cols)}) VALUES ({','.join('?'*len(cols))})",
        vals,
    )


def insert_record(conn, file_id, page, row_key, rec: dict, confidence, needs_review,
                  flags, disagreements, signed_off=0, servable=0):
    cols = (["file_id", "page", "row_key"] + SPEC_FIELDS +
            ["confidence", "needs_review", "validation_flags", "disagreements",
             "signed_off", "servable"])
    vals = ([file_id, page, row_key] + [rec.get(f) for f in SPEC_FIELDS] +
            [confidence, int(needs_review), json.dumps(flags),
             json.dumps(disagreements), int(signed_off), int(servable)])
    conn.execute(
        f"INSERT INTO spec_records ({','.join(cols)}) VALUES ({','.join('?'*len(cols))})",
        vals,
    )


def insert_chunk(conn, file_id, page, manufacturer, edition_year, source_file,
                 section_title, text, token_estimate, embedding_blob):
    cur = conn.execute(
        """INSERT INTO prose_chunks
           (file_id, page, manufacturer, edition_year, source_file,
            section_title, text, token_estimate, embedding)
           VALUES (?,?,?,?,?,?,?,?,?)""",
        (file_id, page, manufacturer, edition_year, source_file,
         section_title, text, token_estimate, embedding_blob),
    )
    conn.execute(
        "INSERT INTO prose_fts (rowid, text, section_title, source_file) VALUES (?,?,?,?)",
        (cur.lastrowid, text, section_title, source_file),
    )


def counts(conn) -> dict[str, int]:
    def n(sql, *a):
        return conn.execute(sql, a).fetchone()[0]
    return {
        "files": n("SELECT COUNT(*) FROM files"),
        "pages": n("SELECT COUNT(*) FROM pages WHERE status='done'"),
        "candidates": n("SELECT COUNT(*) FROM spec_candidates"),
        "records": n("SELECT COUNT(*) FROM spec_records"),
        "high_confidence": n("SELECT COUNT(*) FROM spec_records WHERE confidence='high'"),
        "needs_review": n("SELECT COUNT(*) FROM spec_records WHERE needs_review=1"),
        "servable": n("SELECT COUNT(*) FROM spec_records WHERE servable=1"),
        "prose_chunks": n("SELECT COUNT(*) FROM prose_chunks"),
    }
