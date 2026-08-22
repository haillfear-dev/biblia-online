import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import test from 'node:test';

const database = 'assets/bible.db';

test('generated SQLite contains the complete canon and landmark chapters', { skip: !existsSync(database) && 'assets/bible.db is generated from the separately downloaded public-domain source' }, () => {
  const check = spawnSync('python3', ['-c', `
import json, sqlite3
db=sqlite3.connect('${database}')
one=lambda sql: db.execute(sql).fetchone()[0]
print(json.dumps({
 'books':one('select count(*) from bible_books'),
 'chapters':one('select count(*) from (select distinct book_id,chapter from bible_verses)'),
 'verses':one('select count(*) from bible_verses'),
 'john':one("select count(*) from bible_verses where id='alm1911-JHN-3-16'"),
 'psalms':one("select count(*) from bible_verses where book_id='PSA' and chapter=23"),
 'revelation':one("select count(*) from bible_verses where book_id='REV' and chapter=22")
}))`], { encoding: 'utf8' });
  assert.equal(check.status, 0, check.stderr);
  const counts = JSON.parse(check.stdout);
  assert.equal(counts.books, 66);
  assert.equal(counts.chapters, 1189);
  assert.ok(counts.verses > 30000);
  assert.equal(counts.john, 1);
  assert.ok(counts.psalms > 0);
  assert.ok(counts.revelation > 0);
});
