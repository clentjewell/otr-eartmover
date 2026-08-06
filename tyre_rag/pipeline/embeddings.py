"""Embeddings for Track B prose retrieval.

If EMBED_PROVIDER_KEY is set, calls the configured provider. Otherwise uses a
deterministic hashed bag-of-words embedding so the hybrid-retrieval plumbing is
fully exercised offline. The fallback is clearly weaker and is reported as such;
it is never used for any numeric specification.
"""
from __future__ import annotations

import hashlib
import json
import re
import struct
import urllib.request

import numpy as np

from . import config

_TOKEN = re.compile(r"[a-z0-9]+")


def _hashed_embedding(text: str, dim: int = config.EMBED_DIM_FALLBACK) -> np.ndarray:
    vec = np.zeros(dim, dtype=np.float32)
    for tok in _TOKEN.findall(text.lower()):
        h = int(hashlib.md5(tok.encode()).hexdigest(), 16)
        vec[h % dim] += 1.0
        # signed component reduces collisions
        vec[(h >> 8) % dim] -= 0.5
    norm = np.linalg.norm(vec)
    if norm > 0:
        vec /= norm
    return vec


def _provider_embeddings(texts: list[str]) -> list[np.ndarray]:
    if config.EMBED_VENDOR == "openai":
        req = urllib.request.Request(
            "https://api.openai.com/v1/embeddings",
            data=json.dumps({"model": config.EMBED_MODEL, "input": texts}).encode(),
            headers={
                "Authorization": f"Bearer {config.EMBED_KEY}",
                "Content-Type": "application/json",
            },
        )
        with urllib.request.urlopen(req, timeout=60) as r:
            payload = json.loads(r.read())
        return [np.asarray(d["embedding"], dtype=np.float32) for d in payload["data"]]
    raise NotImplementedError(f"embed vendor {config.EMBED_VENDOR} not wired")


def embed_texts(texts: list[str]) -> list[np.ndarray]:
    if not texts:
        return []
    if config.EMBED_KEY:
        try:
            return _provider_embeddings(texts)
        except Exception as exc:  # fall back rather than fail the unattended run
            print(f"  embed provider failed ({exc}); using fallback embeddings")
    return [_hashed_embedding(t) for t in texts]


def to_blob(vec: np.ndarray) -> bytes:
    vec = np.asarray(vec, dtype=np.float32)
    return struct.pack("<I", vec.shape[0]) + vec.tobytes()


def from_blob(blob: bytes) -> np.ndarray:
    (dim,) = struct.unpack("<I", blob[:4])
    return np.frombuffer(blob[4:4 + dim * 4], dtype=np.float32)


def cosine(a: np.ndarray, b: np.ndarray) -> float:
    na, nb = np.linalg.norm(a), np.linalg.norm(b)
    if na == 0 or nb == 0:
        return 0.0
    return float(np.dot(a, b) / (na * nb))


def using_fallback() -> bool:
    return not config.EMBED_KEY
