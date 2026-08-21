#!/usr/bin/env python3
"""Import the JFAAL ``original`` JSON and build the bundled SQLite database.

The upstream project has shipped both a wrapped ``books`` representation and a
plain list representation over its lifetime.  This importer deliberately
normalizes either form, but never fills in missing verses or chapters.
"""
from __future__ import annotations

import json
import pathlib
import sqlite3
import sys
import unicodedata

SOURCE = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else "data/import/almeida-1911-original.json")
TARGET = pathlib.Path(sys.argv[2] if len(sys.argv) > 2 else "assets/bible.db")

# OSIS, Portuguese display name, abbreviation, canonical chapter count.
CANON = [
 ("GEN","Gênesis","Gn",50),("EXO","Êxodo","Êx",40),("LEV","Levítico","Lv",27),("NUM","Números","Nm",36),("DEU","Deuteronômio","Dt",34),("JOS","Josué","Js",24),("JDG","Juízes","Jz",21),("RUT","Rute","Rt",4),("1SA","1 Samuel","1Sm",31),("2SA","2 Samuel","2Sm",24),("1KI","1 Reis","1Rs",22),("2KI","2 Reis","2Rs",25),("1CH","1 Crônicas","1Cr",29),("2CH","2 Crônicas","2Cr",36),("EZR","Esdras","Ed",10),("NEH","Neemias","Ne",13),("EST","Ester","Et",10),("JOB","Jó","Jó",42),("PSA","Salmos","Sl",150),("PRO","Provérbios","Pv",31),("ECC","Eclesiastes","Ec",12),("SNG","Cantares","Ct",8),("ISA","Isaías","Is",66),("JER","Jeremias","Jr",52),("LAM","Lamentações","Lm",5),("EZK","Ezequiel","Ez",48),("DAN","Daniel","Dn",12),("HOS","Oséias","Os",14),("JOL","Joel","Jl",3),("AMO","Amós","Am",9),("OBA","Obadias","Ob",1),("JON","Jonas","Jn",4),("MIC","Miquéias","Mq",7),("NAM","Naum","Na",3),("HAB","Habacuque","Hc",3),("ZEP","Sofonias","Sf",3),("HAG","Ageu","Ag",2),("ZEC","Zacarias","Zc",14),("MAL","Malaquias","Ml",4),
 ("MAT","Mateus","Mt",28),("MRK","Marcos","Mc",16),("LUK","Lucas","Lc",24),("JHN","João","Jo",21),("ACT","Atos","At",28),("ROM","Romanos","Rm",16),("1CO","1 Coríntios","1Co",16),("2CO","2 Coríntios","2Co",13),("GAL","Gálatas","Gl",6),("EPH","Efésios","Ef",6),("PHP","Filipenses","Fp",4),("COL","Colossenses","Cl",4),("1TH","1 Tessalonicenses","1Ts",5),("2TH","2 Tessalonicenses","2Ts",3),("1TI","1 Timóteo","1Tm",6),("2TI","2 Timóteo","2Tm",4),("TIT","Tito","Tt",3),("PHM","Filemom","Fm",1),("HEB","Hebreus","Hb",13),("JAS","Tiago","Tg",5),("1PE","1 Pedro","1Pe",5),("2PE","2 Pedro","2Pe",3),("1JN","1 João","1Jo",5),("2JN","2 João","2Jo",1),("3JN","3 João","3Jo",1),("JUD","Judas","Jd",1),("REV","Apocalipse","Ap",22),
]

def ordered(value):
    """Return JSON arrays, or numeric-keyed objects, in source order."""
    if isinstance(value, list): return value
    if isinstance(value, dict):
        def key(item):
            raw = str(item[0]); digits = "".join(c for c in raw if c.isdigit())
            return (0, int(digits)) if digits else (1, raw)
        return [item[1] for item in sorted(value.items(), key=key)]
    raise ValueError(f"expected an array/object, received {type(value).__name__}")

def unpack(raw):
    books = raw.get("books") if isinstance(raw, dict) and "books" in raw else raw
    result = []
    for book in ordered(books):
        chapters = book.get("chapters", book.get("capitulos")) if isinstance(book, dict) else book
        normalized_chapters = []
        for chapter in ordered(chapters):
            verses = chapter.get("verses", chapter.get("versiculos")) if isinstance(chapter, dict) else chapter
            texts = []
            for verse in ordered(verses):
                text = verse.get("text", verse.get("texto")) if isinstance(verse, dict) else verse
                texts.append(str(text).strip() if text is not None else "")
            normalized_chapters.append(texts)
        result.append(normalized_chapters)
    return result

if not SOURCE.is_file():
    raise SystemExit(f"Arquivo ausente: {SOURCE}\nBaixe o JSON da pasta `original` de https://github.com/BibliaJFAAL/JFAAL e salve-o nesse caminho.")

try: books = unpack(json.loads(SOURCE.read_text(encoding="utf-8-sig")))
except (json.JSONDecodeError, ValueError, TypeError, AttributeError) as error: raise SystemExit(f"JSON JFAAL inválido: {error}") from error

chapters = sum(map(len, books)); verses = sum(len(chapter) for book in books for chapter in book)
errors = []
if len(books) != 66: errors.append(f"livros: esperado 66, encontrado {len(books)}")
if chapters != 1189: errors.append(f"capítulos: esperado 1189, encontrado {chapters}")
if not 30000 < verses < 32000: errors.append(f"versículos: esperado entre 30.001 e 31.999, encontrado {verses}")
for index, (_, name, _, expected) in enumerate(CANON):
    if index >= len(books): break
    if len(books[index]) != expected: errors.append(f"{name}: esperado {expected} capítulos, encontrado {len(books[index])}")
    for chapter_no, chapter in enumerate(books[index], 1):
        for verse_no, text in enumerate(chapter, 1):
            if not text: errors.append(f"versículo vazio: {name} {chapter_no}:{verse_no}")
if errors: raise SystemExit("Dataset recusado:\n- " + "\n- ".join(errors[:30]))

TARGET.parent.mkdir(parents=True, exist_ok=True); TARGET.unlink(missing_ok=True)
db = sqlite3.connect(TARGET)
db.executescript(pathlib.Path("data/sqlite/schema.sql").read_text(encoding="utf-8"))
db.execute("INSERT INTO schema_version VALUES(1)")
db.execute("INSERT INTO bible_versions VALUES(?,?,?,?,?,?)",("alm1911","João Ferreira de Almeida — edição histórica original de 1911","ALM1911","pt-BR",1911,"Public Domain"))
normalize = lambda text: "".join(c for c in unicodedata.normalize("NFD", text.lower()) if unicodedata.category(c) != "Mn")
ids = set()
for order, ((osis, name, abbreviation, count), book) in enumerate(zip(CANON, books), 1):
    db.execute("INSERT INTO bible_books VALUES(?,?,?,?,?,?,?)",(osis,"alm1911","old" if order <= 39 else "new",order,name,abbreviation,count))
    for chapter_no, chapter in enumerate(book, 1):
        for verse_no, verse_text in enumerate(chapter, 1):
            verse_id = f"alm1911-{osis}-{chapter_no}-{verse_no}"
            if verse_id in ids: raise SystemExit(f"ID duplicado: {verse_id}")
            ids.add(verse_id)
            db.execute("INSERT INTO bible_verses VALUES(?,?,?,?,?,?,?)",(verse_id,"alm1911",osis,chapter_no,verse_no,verse_text,normalize(verse_text)))
db.execute("INSERT INTO bible_verses_fts(bible_verses_fts) VALUES('rebuild')")
db.commit(); db.execute("VACUUM"); db.close()
print(f"Created {TARGET}: 66 books, 1189 chapters, {verses} verses ({TARGET.stat().st_size / 1024 / 1024:.1f} MiB)")
