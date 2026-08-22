import { type SQLiteDatabase } from 'expo-sqlite';

import { BibleBook, BibleVerse, BibleVersion } from '@/models/bible';
import { normalizeSearch } from '@/search/referenceParser';
import { SCHEMA_VERSION } from './schema';

let database: SQLiteDatabase | undefined;

/**
 * Called by SQLiteProvider after it has copied/opened the bundled database.
 * Deliberately does not execute the schema: an empty database must fail loudly
 * instead of looking like a successfully imported Bible.
 */
export async function initializeBibleDatabase(openDatabase: SQLiteDatabase) {
  const schema = await openDatabase.getFirstAsync<{ version: number }>(
    'SELECT version FROM schema_version LIMIT 1',
  );
  if (schema?.version !== SCHEMA_VERSION) {
    throw new Error(`Unsupported Bible database schema: ${schema?.version ?? 'missing'}`);
  }

  const counts = await openDatabase.getFirstAsync<{ books: number; verses: number }>(
    `SELECT
       (SELECT COUNT(*) FROM bible_books) AS books,
       (SELECT COUNT(*) FROM bible_verses) AS verses`,
  );
  if (counts?.books !== 66 || counts.verses <= 30_000) {
    throw new Error(
      `Invalid bundled Bible: ${counts?.books ?? 0} books, ${counts?.verses ?? 0} verses`,
    );
  }

  database = openDatabase;
}

function getDatabase() {
  if (!database) throw new Error('Bible database has not been initialized');
  return database;
}

export class SQLiteBibleDataSource {
  getVersions() {
    return getDatabase().getAllSync<BibleVersion>(
      `SELECT id, name, abbreviation, language, year, license
       FROM bible_versions ORDER BY year LIMIT 10`,
    );
  }

  getBooks(versionId: string) {
    return getDatabase().getAllSync<BibleBook>(
      `SELECT id, version_id AS versionId, testament, book_order AS "order",
              name, abbreviation, chapter_count AS chapterCount
       FROM bible_books WHERE version_id = ? ORDER BY book_order`,
      versionId,
    );
  }

  getBook(bookId: string) {
    return getDatabase().getFirstSync<BibleBook>(
      `SELECT id, version_id AS versionId, testament, book_order AS "order",
              name, abbreviation, chapter_count AS chapterCount
       FROM bible_books WHERE id = ?`,
      bookId,
    ) ?? undefined;
  }

  getChapter(bookId: string, chapter: number) {
    return getDatabase().getAllSync<BibleVerse>(
      `SELECT id, version_id AS versionId, book_id AS bookId, chapter, verse, text
       FROM bible_verses WHERE book_id = ? AND chapter = ? ORDER BY verse`,
      bookId,
      chapter,
    );
  }

  getVerseById(verseId: string) {
    return getDatabase().getFirstSync<BibleVerse>(
      `SELECT id, version_id AS versionId, book_id AS bookId, chapter, verse, text
       FROM bible_verses WHERE id = ?`,
      verseId,
    ) ?? undefined;
  }

  searchText(query: string, versionId: string, limit = 30) {
    const match = normalizeSearch(query)
      .split(' ')
      .filter(Boolean)
      .map((token) => `"${token.replace(/"/g, '""')}"`)
      .join(' AND ');
    if (!match) return [];
    return getDatabase().getAllSync<BibleVerse>(
      `SELECT v.id, v.version_id AS versionId, v.book_id AS bookId,
              v.chapter, v.verse, v.text
       FROM bible_verses_fts f
       JOIN bible_verses v ON v.rowid = f.rowid
       WHERE bible_verses_fts MATCH ? AND v.version_id = ?
       ORDER BY bm25(bible_verses_fts) LIMIT ?`,
      match,
      versionId,
      limit,
    );
  }
}
