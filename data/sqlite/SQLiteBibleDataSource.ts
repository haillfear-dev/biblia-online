import * as SQLite from 'expo-sqlite';
import { BibleVerse } from '@/models/bible';
import { normalizeSearch } from '@/search/referenceParser';
import { schemaSql, SCHEMA_VERSION } from './schema';
let database: SQLite.SQLiteDatabase | undefined;
export class SQLiteBibleDataSource {
 initialize(){ database ??= SQLite.openDatabaseSync('bible.db'); database.execSync(schemaSql); const row=database.getFirstSync<{version:number}>('SELECT version FROM schema_version LIMIT 1'); if(!row) database.runSync('INSERT INTO schema_version(version) VALUES (?)',SCHEMA_VERSION); return database; }
 getChapter(bookId:string,chapter:number){ return this.initialize().getAllSync<BibleVerse>('SELECT id,version_id AS versionId,book_id AS bookId,chapter,verse,text FROM bible_verses WHERE book_id=? AND chapter=? ORDER BY verse',bookId,chapter); }
 searchText(query:string,versionId:string,limit=30){ return this.initialize().getAllSync<BibleVerse>(`SELECT v.id,v.version_id AS versionId,v.book_id AS bookId,v.chapter,v.verse,v.text FROM bible_verses_fts f JOIN bible_verses v ON v.rowid=f.rowid WHERE bible_verses_fts MATCH ? AND v.version_id=? ORDER BY bm25(bible_verses_fts) LIMIT ?`,`${normalizeSearch(query).split(' ').map(token=>`"${token.replace(/"/g,'')}"`).join(' AND ')}`,versionId,limit); }
}
