-- Verified, signed-off numeric specifications served by the Ask worker (Track A).
-- The worker queries: SELECT * FROM specs WHERE servable=1 AND <size or tra match>.
-- Load only rows that are dual-pass verified AND signed off AND committed in the
-- tyre_rag pipeline (spec_records where servable=1). Numbers are reproduced
-- verbatim; nothing is generated.

CREATE TABLE IF NOT EXISTS specs (
  id                     INTEGER PRIMARY KEY,
  manufacturer           TEXT,
  edition_year           INTEGER,
  source_file            TEXT,
  page                   INTEGER,
  size_designation       TEXT NOT NULL,
  tra_code               TEXT,
  rating                 TEXT,
  load_index             TEXT,
  rim_recommendation     TEXT,
  section_width_mm       REAL,
  overall_diameter_mm    REAL,
  inflation_pressure_kpa REAL,
  tkph_tmph              REAL,
  application            TEXT,
  source_crop_path       TEXT,
  servable               INTEGER DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_specs_size ON specs (size_designation);
CREATE INDEX IF NOT EXISTS idx_specs_tra  ON specs (tra_code);
