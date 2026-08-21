#!/usr/bin/env python3
"""Validate an explicitly sourced Almeida 1911 JSON file and build the bundled SQLite database."""
import json, sqlite3, sys, unicodedata, pathlib
source, target = map(pathlib.Path, sys.argv[1:3])
data=json.loads(source.read_text(encoding='utf-8'))
if data.get('translation')!='João Ferreira de Almeida 1911' or data.get('license')!='Public Domain': raise SystemExit('Dataset metadata must explicitly identify Almeida 1911 and Public Domain')
books=data.get('books',[]); chapters=sum(len(b.get('chapters',[])) for b in books); verses=sum(len(c.get('verses',[])) for b in books for c in b.get('chapters',[]))
if len(books)!=66 or chapters!=1189 or not 30000<=verses<=32000: raise SystemExit(f'Unexpected canon counts: {len(books)} books, {chapters} chapters, {verses} verses')
target.parent.mkdir(parents=True,exist_ok=True); target.unlink(missing_ok=True); db=sqlite3.connect(target)
db.executescript(pathlib.Path('data/sqlite/schema.sql').read_text())
db.execute('INSERT INTO schema_version VALUES(1)');db.execute('INSERT INTO bible_versions VALUES(?,?,?,?,?,?)',('alm1911','João Ferreira de Almeida — edição histórica de 1911','ALM1911','pt-BR',1911,'Public Domain'))
def norm(s): return ''.join(c for c in unicodedata.normalize('NFD',s.lower()) if unicodedata.category(c)!='Mn')
for order,b in enumerate(books,1):
 db.execute('INSERT INTO bible_books VALUES(?,?,?,?,?,?,?)',(b['id'],'alm1911',b['testament'],order,b['name'],b['abbreviation'],len(b['chapters'])))
 for chapter_no,c in enumerate(b['chapters'],1):
  for verse_no,text in enumerate(c['verses'],1): db.execute('INSERT INTO bible_verses VALUES(?,?,?,?,?,?,?)',(f'alm1911-{b["id"]}-{chapter_no}-{verse_no}','alm1911',b['id'],chapter_no,verse_no,text,norm(text)))
db.execute("INSERT INTO bible_verses_fts(bible_verses_fts) VALUES('rebuild')");db.commit();db.execute('VACUUM');db.close();print(f'Created {target}: 66 books, 1189 chapters, {verses} verses')
