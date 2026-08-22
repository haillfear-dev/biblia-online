export const SCHEMA_VERSION = 1;
export const schemaSql = `
PRAGMA foreign_keys=ON;
CREATE TABLE IF NOT EXISTS schema_version (version INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS bible_versions (id TEXT PRIMARY KEY, name TEXT NOT NULL, abbreviation TEXT NOT NULL, language TEXT NOT NULL, year INTEGER NOT NULL, license TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS bible_books (id TEXT PRIMARY KEY, version_id TEXT NOT NULL REFERENCES bible_versions(id), testament TEXT NOT NULL CHECK(testament IN ('old','new')), book_order INTEGER NOT NULL, name TEXT NOT NULL, abbreviation TEXT NOT NULL, chapter_count INTEGER NOT NULL, UNIQUE(version_id,book_order));
CREATE TABLE IF NOT EXISTS bible_verses (id TEXT PRIMARY KEY, version_id TEXT NOT NULL REFERENCES bible_versions(id), book_id TEXT NOT NULL REFERENCES bible_books(id), chapter INTEGER NOT NULL, verse INTEGER NOT NULL, text TEXT NOT NULL, normalized_text TEXT NOT NULL, UNIQUE(version_id,book_id,chapter,verse));
CREATE INDEX IF NOT EXISTS idx_books_version_order ON bible_books(version_id,book_order);
CREATE INDEX IF NOT EXISTS idx_verses_location ON bible_verses(version_id,book_id,chapter,verse);
CREATE INDEX IF NOT EXISTS idx_verses_normalized ON bible_verses(normalized_text);
CREATE VIRTUAL TABLE IF NOT EXISTS bible_verses_fts USING fts5(text, content='bible_verses', content_rowid='rowid', tokenize='unicode61 remove_diacritics 2');
CREATE TRIGGER IF NOT EXISTS verses_ai AFTER INSERT ON bible_verses BEGIN INSERT INTO bible_verses_fts(rowid,text) VALUES(new.rowid,new.text); END;
`;
