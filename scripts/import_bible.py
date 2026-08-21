#!/usr/bin/env python3
"""Validate the original JFAAL data and build the bundled SQLite database."""

import json
import pathlib
import sqlite3
import sys
import unicodedata


ROOT = pathlib.Path(__file__).resolve().parents[1]
EXPECTED_SOURCE = ROOT / "data" / "import" / "almeida-1911-original.json"
TRANSLATION = "João Ferreira de Almeida 1911"
LICENSE = "Public Domain"

# This metadata belongs to the application, not to the upstream JSON.  Books in
# JFAAL's ``original`` directory are ordered canonically.
BOOKS = [
    ("GEN", "Gênesis", "Gn", 50), ("EXO", "Êxodo", "Êx", 40),
    ("LEV", "Levítico", "Lv", 27), ("NUM", "Números", "Nm", 36),
    ("DEU", "Deuteronômio", "Dt", 34), ("JOS", "Josué", "Js", 24),
    ("JDG", "Juízes", "Jz", 21), ("RUT", "Rute", "Rt", 4),
    ("1SA", "1 Samuel", "1Sm", 31), ("2SA", "2 Samuel", "2Sm", 24),
    ("1KI", "1 Reis", "1Rs", 22), ("2KI", "2 Reis", "2Rs", 25),
    ("1CH", "1 Crônicas", "1Cr", 29), ("2CH", "2 Crônicas", "2Cr", 36),
    ("EZR", "Esdras", "Ed", 10), ("NEH", "Neemias", "Ne", 13),
    ("EST", "Ester", "Et", 10), ("JOB", "Jó", "Jó", 42),
    ("PSA", "Salmos", "Sl", 150), ("PRO", "Provérbios", "Pv", 31),
    ("ECC", "Eclesiastes", "Ec", 12), ("SNG", "Cantares", "Ct", 8),
    ("ISA", "Isaías", "Is", 66), ("JER", "Jeremias", "Jr", 52),
    ("LAM", "Lamentações", "Lm", 5), ("EZK", "Ezequiel", "Ez", 48),
    ("DAN", "Daniel", "Dn", 12), ("HOS", "Oséias", "Os", 14),
    ("JOL", "Joel", "Jl", 3), ("AMO", "Amós", "Am", 9),
    ("OBA", "Obadias", "Ob", 1), ("JON", "Jonas", "Jn", 4),
    ("MIC", "Miquéias", "Mq", 7), ("NAM", "Naum", "Na", 3),
    ("HAB", "Habacuque", "Hc", 3), ("ZEP", "Sofonias", "Sf", 3),
    ("HAG", "Ageu", "Ag", 2), ("ZEC", "Zacarias", "Zc", 14),
    ("MAL", "Malaquias", "Ml", 4), ("MAT", "Mateus", "Mt", 28),
    ("MRK", "Marcos", "Mc", 16), ("LUK", "Lucas", "Lc", 24),
    ("JHN", "João", "Jo", 21), ("ACT", "Atos", "At", 28),
    ("ROM", "Romanos", "Rm", 16), ("1CO", "1 Coríntios", "1Co", 16),
    ("2CO", "2 Coríntios", "2Co", 13), ("GAL", "Gálatas", "Gl", 6),
    ("EPH", "Efésios", "Ef", 6), ("PHP", "Filipenses", "Fp", 4),
    ("COL", "Colossenses", "Cl", 4), ("1TH", "1 Tessalonicenses", "1Ts", 5),
    ("2TH", "2 Tessalonicenses", "2Ts", 3), ("1TI", "1 Timóteo", "1Tm", 6),
    ("2TI", "2 Timóteo", "2Tm", 4), ("TIT", "Tito", "Tt", 3),
    ("PHM", "Filemom", "Fm", 1), ("HEB", "Hebreus", "Hb", 13),
    ("JAS", "Tiago", "Tg", 5), ("1PE", "1 Pedro", "1Pe", 5),
    ("2PE", "2 Pedro", "2Pe", 3), ("1JN", "1 João", "1Jo", 5),
    ("2JN", "2 João", "2Jo", 1), ("3JN", "3 João", "3Jo", 1),
    ("JUD", "Judas", "Jd", 1), ("REV", "Apocalipse", "Ap", 22),
]


def sequence(value, label):
    """Return arrays or numerically indexed objects in their source order."""
    if isinstance(value, list):
        return list(enumerate(value, 1))
    if isinstance(value, dict) and value and all(str(key).isdigit() for key in value):
        pairs = sorted(((int(key), item) for key, item in value.items()))
        return pairs
    raise ValueError(f"{label} must be an array or a numerically indexed object")


def member(container, names):
    if not isinstance(container, dict):
        return None
    for name in names:
        if name in container:
            return container[name]
    return None


def unwrap_books(data):
    candidate = member(data, ("books", "livros"))
    if candidate is not None:
        return candidate
    return data


def unwrap_chapters(book):
    candidate = member(book, ("chapters", "capitulos"))
    if candidate is not None:
        return candidate
    # Some exports use the book name as a wrapper around its chapters.
    if isinstance(book, dict):
        ignored = {"id", "nome", "name", "abreviacao", "abbreviation", "testamento"}
        values = [value for key, value in book.items() if key not in ignored]
        if len(values) == 1:
            return values[0]
    return book


def unwrap_verses(chapter):
    candidate = member(chapter, ("verses", "versiculos"))
    return candidate if candidate is not None else chapter


def verse_text(verse):
    if isinstance(verse, str):
        text = verse
    else:
        text = member(verse, ("text", "texto"))
    if not isinstance(text, str) or not text.strip():
        raise ValueError("Every verse must contain non-empty text")
    return text


def normalize_dataset(data):
    books = sequence(unwrap_books(data), "books")
    if len(books) != 66:
        raise ValueError(f"Expected exactly 66 books, found {len(books)}")

    normalized = []
    seen_locations = set()
    for book_index, (_, source_book) in enumerate(books, 1):
        book_id, _, _, expected_chapters = BOOKS[book_index - 1]
        chapters = sequence(unwrap_chapters(source_book), f"chapters in {book_id}")
        if len(chapters) != expected_chapters:
            raise ValueError(
                f"{book_id} must have {expected_chapters} chapters, found {len(chapters)}"
            )
        normalized_chapters = []
        for chapter_number, (_, source_chapter) in enumerate(chapters, 1):
            verses = sequence(unwrap_verses(source_chapter), f"verses in {book_id} {chapter_number}")
            normalized_verses = []
            for verse_number, (_, source_verse) in enumerate(verses, 1):
                location = (book_id, chapter_number, verse_number)
                if location in seen_locations:
                    raise ValueError(f"Duplicate verse ID: {location}")
                seen_locations.add(location)
                normalized_verses.append(verse_text(source_verse))
            normalized_chapters.append(normalized_verses)
        normalized.append(normalized_chapters)

    verse_count = len(seen_locations)
    if not 30_000 <= verse_count <= 32_000:
        raise ValueError(f"Expected between 30000 and 32000 verses, found {verse_count}")
    return normalized, verse_count


def normalized_search_text(text):
    return "".join(
        char for char in unicodedata.normalize("NFD", text.lower())
        if unicodedata.category(char) != "Mn"
    )


def import_bible(source, target):
    if source.resolve() != EXPECTED_SOURCE.resolve():
        raise ValueError(f"Source must be the controlled JFAAL file: {EXPECTED_SOURCE}")
    data = json.loads(source.read_text(encoding="utf-8-sig"))
    books, verse_count = normalize_dataset(data)

    target.parent.mkdir(parents=True, exist_ok=True)
    temporary = target.with_suffix(target.suffix + ".tmp")
    temporary.unlink(missing_ok=True)
    database = sqlite3.connect(temporary)
    try:
        database.executescript((ROOT / "data" / "sqlite" / "schema.sql").read_text())
        database.execute("INSERT INTO schema_version VALUES(1)")
        database.execute(
            "INSERT INTO bible_versions VALUES(?,?,?,?,?,?)",
            ("alm1911", "João Ferreira de Almeida — edição histórica de 1911", "ALM1911", "pt-BR", 1911, LICENSE),
        )
        for order, ((book_id, name, abbreviation, _), chapters) in enumerate(zip(BOOKS, books), 1):
            database.execute(
                "INSERT INTO bible_books VALUES(?,?,?,?,?,?,?)",
                (book_id, "alm1911", "old" if order <= 39 else "new", order, name, abbreviation, len(chapters)),
            )
            for chapter_number, verses in enumerate(chapters, 1):
                for verse_number, text in enumerate(verses, 1):
                    database.execute(
                        "INSERT INTO bible_verses VALUES(?,?,?,?,?,?,?)",
                        (f"alm1911-{book_id}-{chapter_number}-{verse_number}", "alm1911", book_id,
                         chapter_number, verse_number, text, normalized_search_text(text)),
                    )
        database.execute("INSERT INTO bible_verses_fts(bible_verses_fts) VALUES('rebuild')")
        database.commit()
        database.execute("VACUUM")
    finally:
        database.close()
    temporary.replace(target)
    print(f"Created {target}: 66 books, 1189 chapters, {verse_count} verses")


def main():
    if len(sys.argv) != 3:
        raise SystemExit("Usage: import_bible.py SOURCE_JSON TARGET_DB")
    try:
        import_bible(pathlib.Path(sys.argv[1]), pathlib.Path(sys.argv[2]))
    except (OSError, ValueError, json.JSONDecodeError, sqlite3.Error) as error:
        raise SystemExit(f"Import failed: {error}") from error


if __name__ == "__main__":
    main()
