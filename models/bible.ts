export type Testament = 'old' | 'new';
export interface BibleVersion { id: string; name: string; abbreviation: string; language: string; year?: number; license?: string }
export interface BibleBook { id: string; versionId: string; testament: Testament; order: number; name: string; abbreviation: string; chapterCount: number }
export interface BibleVerse { id: string; versionId: string; bookId: string; chapter: number; verse: number; text: string }
export type HighlightColor = 'yellow' | 'green' | 'blue' | 'pink';
export interface Highlight { id: string; verseId: string; color: HighlightColor; createdAt: string }
export interface Favorite { id: string; verseId: string; createdAt: string }
export interface Note { id: string; verseId: string; content: string; createdAt: string; updatedAt: string }
export interface ReadingProgress { versionId: string; bookId: string; chapter: number; verseId?: string; updatedAt: string }
export interface ReadingHistoryEntry { bookId: string; chapter: number; accessedAt: string }
export interface ChapterLocation { bookId: string; chapter: number }
export type BibleSearchResult = { type: 'book'; book: BibleBook } | { type: 'chapter'; book: BibleBook; chapter: number } | { type: 'verse'; book: BibleBook; verse: BibleVerse };
