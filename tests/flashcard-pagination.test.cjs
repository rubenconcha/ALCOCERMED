const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

test('flashcards load past the former 5000-row cutoff without repeating pages', async () => {
  const source = fs.readFileSync(path.join(__dirname, '..', 'script.js'), 'utf8');
  const start = source.indexOf('async function loadFlashcards()');
  const end = source.indexOf('\nwindow.toggleMenu', start);
  assert.ok(start >= 0 && end > start);
  const rows = Array.from({ length: 6201 }, (_, id) => ({ id: id + 1 }));
  const ranges = [];
  const client = {
    from(table) {
      assert.equal(table, 'flashcards');
      return {
        select(columns) {
          assert.equal(columns, '*');
          return {
            order(column, options) {
              assert.equal(column, 'id');
              assert.equal(options.ascending, true);
              return {
                async range(first, last) {
                  ranges.push([first, last]);
                  return { data: rows.slice(first, last + 1), error: null };
                }
              };
            }
          };
        }
      };
    }
  };
  const context = vm.createContext({ getSupabase: () => client });
  vm.runInContext(`let flashcardsCache = null; ${source.slice(start, end)}`, context);
  const first = await vm.runInContext('loadFlashcards()', context);
  const second = await vm.runInContext('loadFlashcards()', context);
  assert.equal(first.length, 6201);
  assert.equal(first[6200].id, 6201);
  assert.equal(second, first);
  assert.equal(ranges.length, 7);
  assert.deepEqual(ranges.at(-1), [6000, 6999]);
});
