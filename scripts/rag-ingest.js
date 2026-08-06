/**
 * RAG corpus ingestion script for OTR Earthmover Tyre Knowledge Portal.
 *
 * Reads documents from ../rag-sources/ (repo root),
 * chunks them, generates embeddings via Cloudflare Workers AI (bge-base-en-v1.5),
 * and uploads to the Vectorize index 'otr-corpus'.
 *
 * Usage:
 *   1. Ensure ./rag-sources/ exists with manufacturer databooks, TRA docs,
 *      AS4457 material, and Jewell trading notes in .pdf, .md, or .txt format.
 *   2. Set CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID env vars.
 *   3. Run: node scripts/rag-ingest.js
 *
 * Status: scaffolded. Requires Vectorize index to exist (see wrangler.toml).
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

// Resolve paths relative to this script (not the CWD) so it runs from anywhere.
const HERE = path.dirname(fileURLToPath(import.meta.url));   // scripts
const REPO_ROOT = path.resolve(HERE, '../');                 // repo root
const RAG_SOURCES_DIR = path.join(REPO_ROOT, 'rag-sources');
const VECTORIZE_INDEX = 'otr-corpus';
const CHUNK_SIZE = 800;       // chars per chunk
const CHUNK_OVERLAP = 150;    // chars overlap between consecutive chunks
const EMBED_MODEL = '@cf/baai/bge-base-en-v1.5';
// Preferred input: prose chunks exported by the tyre_rag pipeline (which does
// the PDF extraction + chunking with provenance). Falls back to raw .md/.txt.
const CHUNKS_JSONL = process.env.CHUNKS_JSONL || path.join(REPO_ROOT, 'tyre_rag/index/prose_chunks.jsonl');

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const apiToken = process.env.CLOUDFLARE_API_TOKEN;

if (!accountId || !apiToken) {
  console.error('CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN must be set.');
  process.exit(1);
}

async function main() {
  // Preferred path: pre-extracted chunks from the tyre_rag pipeline.
  let allChunks = await loadChunksFromJsonl();

  if (allChunks) {
    console.log(`Loaded ${allChunks.length} pre-extracted chunks from ${CHUNKS_JSONL}.`);
  } else {
    console.log(`No chunks JSONL found; reading raw sources from ${RAG_SOURCES_DIR}...`);
    let files;
    try {
      files = await listSourceFiles(RAG_SOURCES_DIR);
    } catch (err) {
      console.error(`Cannot read source directory: ${err.message}`);
      console.error('Run `python -m tyre_rag.scripts.export_chunks_jsonl`, or place .md/.txt corpus in rag-sources/.');
      process.exit(1);
    }
    if (files.length === 0) {
      console.error('No source documents found.');
      process.exit(1);
    }
    console.log(`Found ${files.length} source documents.`);
    allChunks = [];
    for (const file of files) {
      console.log(`  Processing ${file.relativePath}...`);
      const text = await readFileAsText(file.absolutePath);
      const chunks = chunkText(text, {
        source: file.relativePath,
        section: inferSection(file.relativePath)
      });
      allChunks.push(...chunks);
    }
  }

  console.log(`Generated ${allChunks.length} chunks. Embedding...`);

  const batchSize = 50;
  let inserted = 0;

  for (let i = 0; i < allChunks.length; i += batchSize) {
    const batch = allChunks.slice(i, i + batchSize);
    const embedded = await embedBatch(batch);
    await upsertBatch(embedded);
    inserted += batch.length;
    console.log(`  Inserted ${inserted}/${allChunks.length}`);
  }

  console.log('Ingestion complete.');
}

async function loadChunksFromJsonl() {
  let raw;
  try {
    raw = await fs.readFile(CHUNKS_JSONL, 'utf8');
  } catch {
    return null;
  }
  const chunks = [];
  let i = 0;
  for (const line of raw.split('\n')) {
    const t = line.trim();
    if (!t) continue;
    let obj;
    try { obj = JSON.parse(t); } catch { continue; }
    if (!obj.text) continue;
    chunks.push({
      text: obj.text,
      metadata: {
        source: obj.source || 'unknown',
        section: obj.section || 'general',
        page: obj.page ?? null,
        position: i++
      }
    });
  }
  return chunks.length ? chunks : null;
}

async function listSourceFiles(dir) {
  const out = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const nested = await listSourceFiles(full);
      out.push(...nested);
    } else if (/\.(md|txt|pdf)$/i.test(entry.name)) {
      out.push({
        absolutePath: full,
        relativePath: path.relative(RAG_SOURCES_DIR, full)
      });
    }
  }
  return out;
}

async function readFileAsText(filePath) {
  // .md and .txt: read directly. .pdf: would require a PDF parser (pdf-parse, pdfjs-dist, etc.)
  if (/\.pdf$/i.test(filePath)) {
    console.warn(`  ⚠ PDF parsing not implemented; skipping ${filePath}.`);
    console.warn(`    Install 'pdf-parse' and add the extraction logic here.`);
    return '';
  }
  return await fs.readFile(filePath, 'utf8');
}

function chunkText(text, metadata) {
  const chunks = [];
  let start = 0;
  while (start < text.length) {
    const end = Math.min(start + CHUNK_SIZE, text.length);
    const chunk = text.slice(start, end);
    chunks.push({
      text: chunk.trim(),
      metadata: { ...metadata, position: start }
    });
    start += CHUNK_SIZE - CHUNK_OVERLAP;
  }
  return chunks.filter(c => c.text.length > 50);
}

function inferSection(relativePath) {
  // Simple heuristic - refine later
  if (/bridgestone/i.test(relativePath)) return 'Bridgestone databook';
  if (/michelin/i.test(relativePath)) return 'Michelin databook';
  if (/goodyear/i.test(relativePath)) return 'Goodyear databook';
  if (/yokohama/i.test(relativePath)) return 'Yokohama databook';
  if (/as4457/i.test(relativePath)) return 'AS4457 standard';
  if (/tra/i.test(relativePath)) return 'TRA Year Book';
  if (/jewell/i.test(relativePath) || /trading/i.test(relativePath)) return 'Jewell trading experience';
  return 'general';
}

async function embedBatch(batch) {
  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${EMBED_MODEL}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ text: batch.map(c => c.text) })
  });
  if (!response.ok) {
    throw new Error(`Embedding API failed: ${response.status} ${await response.text()}`);
  }
  const result = await response.json();
  return batch.map((chunk, i) => ({
    // Short, stable id (Vectorize caps ids at 64 bytes; filenames overflow).
    id: createHash('sha1').update(`${chunk.metadata.source}|${chunk.metadata.position}`).digest('hex'),
    values: result.result.data[i],
    // Embedding is computed from the full chunk text above; the stored display
    // text is capped to stay under Vectorize's 10 KB/vector metadata limit.
    metadata: { ...chunk.metadata, text: chunk.text.slice(0, 2000) }
  }));
}

async function upsertBatch(embedded) {
  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/vectorize/v2/indexes/${VECTORIZE_INDEX}/upsert`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiToken}`,
      'Content-Type': 'application/x-ndjson'
    },
    body: embedded.map(v => JSON.stringify(v)).join('\n')
  });
  if (!response.ok) {
    throw new Error(`Vectorize upsert failed: ${response.status} ${await response.text()}`);
  }
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
