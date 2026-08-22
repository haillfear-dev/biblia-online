import { SQLiteBibleDataSource } from '@/data/sqlite/SQLiteBibleDataSource';
import { BibleSearchResult, BibleVerse, ChapterLocation, Testament } from '@/models/bible';
import { normalizeSearch, parseReference } from '@/search/referenceParser';

const legacyBooks: Record<string, string> = {
  'book-gen': 'GEN', 'book-ps': 'PSA', 'book-mt': 'MAT', 'book-jn': 'JHN', 'book-act': 'ACT',
};

class BibleRepository {
  constructor(private readonly source = new SQLiteBibleDataSource()) {}

  getVersions() { return this.source.getVersions(); }
  getDefaultVersion() {
    const version = this.getVersions()[0];
    if (!version) throw new Error('The Bible database contains no version');
    return version;
  }
  getBooks(versionId: string) { return this.source.getBooks(versionId); }
  getBooksByTestament(versionId: string, testament: Testament) {
    return this.getBooks(versionId).filter((book) => book.testament === testament);
  }
  getBook(bookId: string) { return this.source.getBook(legacyBooks[bookId] ?? bookId); }
  getChapter(bookId: string, chapter: number) { return this.source.getChapter(bookId, chapter); }
  getVerse(verseId: string) {
    const direct = this.source.getVerseById(verseId);
    if (direct) return direct;
    const legacy = verseId.match(/^dev-pt-001:(book-[a-z]+):(\d+):(\d+)$/);
    return legacy
      ? this.source.getVerseById(`alm1911-${legacyBooks[legacy[1]]}-${legacy[2]}-${legacy[3]}`)
      : undefined;
  }
  getVerseById(verseId: string) { return this.getVerse(verseId); }
  getChapterCount(bookId: string) { return this.getBook(bookId)?.chapterCount ?? 0; }

  private adjacent(bookId: string, chapter: number, direction: -1 | 1): ChapterLocation | undefined {
    const version = this.getBook(bookId)?.versionId;
    if (!version) return undefined;
    const books = this.getBooks(version);
    const index = books.findIndex((book) => book.id === bookId);
    if (index < 0) return undefined;
    if (direction < 0 && chapter > 1) return { bookId, chapter: chapter - 1 };
    if (direction > 0 && chapter < books[index].chapterCount) return { bookId, chapter: chapter + 1 };
    const next = books[index + direction];
    return next ? { bookId: next.id, chapter: direction > 0 ? 1 : next.chapterCount } : undefined;
  }
  getPreviousChapter(bookId: string, chapter: number) { return this.adjacent(bookId, chapter, -1); }
  getNextChapter(bookId: string, chapter: number) { return this.adjacent(bookId, chapter, 1); }
  formatReference(verse: BibleVerse) {
    return `${this.getBook(verse.bookId)?.name ?? 'Livro'} ${verse.chapter}:${verse.verse}`;
  }

  search(rawQuery: string, versionId = this.getDefaultVersion().id): BibleSearchResult[] {
    const query = normalizeSearch(rawQuery);
    if (query.length < 2) return [];
    const books = this.getBooks(versionId);
    const reference = parseReference(rawQuery, books);
    const prioritized: BibleSearchResult[] = [];
    if (reference) {
      if (reference.chapter === undefined) prioritized.push({ type: 'book', book: reference.book });
      else if (reference.verse === undefined) {
        prioritized.push({ type: 'chapter', book: reference.book, chapter: reference.chapter });
      } else {
        const verse = this.getChapter(reference.book.id, reference.chapter)
          .find((item) => item.verse === reference.verse);
        if (verse) prioritized.push({ type: 'verse', book: reference.book, verse });
      }
    }
    const bookResults: BibleSearchResult[] = books
      .filter((book) => normalizeSearch(book.name).includes(query)
        || normalizeSearch(book.abbreviation) === query)
      .map((book) => ({ type: 'book', book }));
    const verseResults: BibleSearchResult[] = this.source.searchText(rawQuery, versionId)
      .map((verse) => ({ type: 'verse', book: this.getBook(verse.bookId)!, verse }));
    return [...prioritized, ...bookResults, ...verseResults]
      .filter((result, index, all) => all.findIndex((candidate) => {
        const resultId = result.type === 'verse' ? result.verse.id
          : `${result.type}:${result.book.id}:${result.type === 'chapter' ? result.chapter : ''}`;
        const candidateId = candidate.type === 'verse' ? candidate.verse.id
          : `${candidate.type}:${candidate.book.id}:${candidate.type === 'chapter' ? candidate.chapter : ''}`;
        return resultId === candidateId;
      }) === index)
      .slice(0, 30);
  }
}

export const bibleRepository = new BibleRepository();
