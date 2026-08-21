import { developmentBibleData } from '@/data/developmentBibleData';
import { BibleBook, BibleSearchResult, BibleVerse, BibleVersion, ChapterLocation, Testament } from '@/models/bible';
const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
class DevelopmentBibleRepository {
  private books = [...developmentBibleData.books].sort((a, b) => a.order - b.order);
  private bookById = new Map(this.books.map((book) => [book.id, book]));
  private versesByChapter = new Map<string, BibleVerse[]>();
  constructor() { developmentBibleData.verses.forEach((verse) => { const key = `${verse.bookId}:${verse.chapter}`; this.versesByChapter.set(key, [...(this.versesByChapter.get(key) ?? []), verse]); }); }
  getVersions(): BibleVersion[] { return developmentBibleData.versions; }
  getDefaultVersion(): BibleVersion { return developmentBibleData.versions[0]; }
  getBooks(versionId: string): BibleBook[] { return this.books.filter((book) => book.versionId === versionId); }
  getBooksByTestament(versionId: string, testament: Testament): BibleBook[] { return this.getBooks(versionId).filter((book) => book.testament === testament); }
  getBook(bookId: string): BibleBook | undefined { return this.bookById.get(bookId); }
  getChapter(bookId: string, chapter: number): BibleVerse[] { return this.versesByChapter.get(`${bookId}:${chapter}`) ?? []; }
  getVerse(verseId: string): BibleVerse | undefined { return developmentBibleData.verses.find((verse) => verse.id === verseId); }
  getChapterCount(bookId: string): number { return this.getBook(bookId)?.chapterCount ?? 0; }
  getPreviousChapter(bookId: string, chapter: number): ChapterLocation | undefined { return this.adjacent(bookId, chapter, -1); }
  getNextChapter(bookId: string, chapter: number): ChapterLocation | undefined { return this.adjacent(bookId, chapter, 1); }
  private adjacent(bookId: string, chapter: number, direction: -1 | 1): ChapterLocation | undefined { const index = this.books.findIndex((book) => book.id === bookId); if (index < 0) return undefined; if (direction < 0 && chapter > 1) return { bookId, chapter: chapter - 1 }; if (direction > 0 && chapter < this.books[index].chapterCount) return { bookId, chapter: chapter + 1 }; const nextBook = this.books[index + direction]; return nextBook ? { bookId: nextBook.id, chapter: direction > 0 ? 1 : nextBook.chapterCount } : undefined; }
  formatReference(verse: BibleVerse): string { return `${this.getBook(verse.bookId)?.name ?? 'Livro'} ${verse.chapter}:${verse.verse}`; }
  search(rawQuery: string, versionId = this.getDefaultVersion().id): BibleSearchResult[] { const query = normalize(rawQuery); if (query.length < 2) return []; const reference = query.match(/^(.+?)\s+(\d+)(?::(\d+))?$/); if (reference) { const book = this.getBooks(versionId).find((item) => normalize(item.name) === reference[1] || normalize(item.abbreviation) === reference[1]); const chapter = Number(reference[2]); const verseNumber = reference[3] ? Number(reference[3]) : undefined; if (book && chapter >= 1 && chapter <= book.chapterCount) { if (!verseNumber) return [{ type: 'chapter', book, chapter }]; const verse = this.getChapter(book.id, chapter).find((item) => item.verse === verseNumber); return verse ? [{ type: 'verse', book, verse }] : []; } }
    const bookResults: BibleSearchResult[] = this.getBooks(versionId).filter((book) => normalize(book.name).includes(query) || normalize(book.abbreviation) === query).map((book) => ({ type: 'book', book }));
    const verseResults: BibleSearchResult[] = developmentBibleData.verses.filter((verse) => verse.versionId === versionId && normalize(verse.text).includes(query)).slice(0, 30).map((verse) => ({ type: 'verse', book: this.bookById.get(verse.bookId)!, verse })); return [...bookResults, ...verseResults].slice(0, 30); }
}
export const bibleRepository = new DevelopmentBibleRepository();
