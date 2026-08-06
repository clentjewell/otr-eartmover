-- Corpus label/content cleanup, applied live to project wlyamhlpowmmavmonbrq on 2026-07-16.
--
-- Why: the "ask" edge function code was already dash-free and points every Source
-- link at the correct domain via sourceUrl(). But the stored corpus in kb_chunks
-- still carried (a) em/en dashes in the source/section labels and body content, and
-- (b) the old, incorrect domain "otrearthmovertyre.com" in the display labels. Those
-- leaked into the rendered Sources list and excerpt text. This brings the stored data
-- in line with the house rules (no dashes anywhere; otrearthmovertyres.com is the only
-- correct domain).
--
-- Scope when applied: 54 label rows on the old domain, 38 label-dash rows,
-- 207 content-dash rows. kb_specs was already clean (0 rows).
--
-- Rollback: a full snapshot was taken first as kb_chunks_backup_20260716.
--   update kb_chunks k
--     set source = b.source, section = b.section, content = b.content
--     from kb_chunks_backup_20260716 b
--     where k.id = b.id;
-- Drop the snapshot once the change is confirmed good:
--   drop table kb_chunks_backup_20260716;
--
-- The deDash() below mirrors the deDash() helper in functions/ask/index.ts so the
-- stored text is transformed the same way the runtime would transform generated prose.

-- 1. Domain sweep on display labels (links themselves are resolved by sourceUrl()).
update kb_chunks set source  = replace(source,  'otrearthmovertyre.com', 'otrearthmovertyres.com') where source  like '%otrearthmovertyre.com%';
update kb_chunks set section = replace(section, 'otrearthmovertyre.com', 'otrearthmovertyres.com') where section like '%otrearthmovertyre.com%';

-- 2. deDash: em dash -> ", "; en dash between digits -> "-"; other en dash -> ", ";
--    collapse ", ,"; tidy a sentence-ender followed by a comma.
update kb_chunks set source = regexp_replace(regexp_replace(regexp_replace(regexp_replace(regexp_replace(
  source, '\s*—\s*', ', ', 'g'), '(\d)\s*–\s*(\d)', '\1-\2', 'g'), '\s*–\s*', ', ', 'g'), ',\s*,', ', ', 'g'), '([.!?])\s*,\s*', '\1 ', 'g')
  where source ~ '[—–]';
update kb_chunks set section = regexp_replace(regexp_replace(regexp_replace(regexp_replace(regexp_replace(
  section, '\s*—\s*', ', ', 'g'), '(\d)\s*–\s*(\d)', '\1-\2', 'g'), '\s*–\s*', ', ', 'g'), ',\s*,', ', ', 'g'), '([.!?])\s*,\s*', '\1 ', 'g')
  where section ~ '[—–]';
update kb_chunks set content = regexp_replace(regexp_replace(regexp_replace(regexp_replace(regexp_replace(
  content, '\s*—\s*', ', ', 'g'), '(\d)\s*–\s*(\d)', '\1-\2', 'g'), '\s*–\s*', ', ', 'g'), ',\s*,', ', ', 'g'), '([.!?])\s*,\s*', '\1 ', 'g')
  where content ~ '[—–]';
