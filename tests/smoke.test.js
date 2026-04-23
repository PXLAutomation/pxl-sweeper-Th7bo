import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("index.html includes the board shell and module entry", async () => {
  const html = await readFile(new URL("../index.html", import.meta.url), "utf8");

  assert.match(html, /data-game-root/);
  assert.match(html, /data-board/);
  assert.match(html, /role="status"/);
  assert.match(html, /aria-describedby="board-instructions"/);
  assert.match(html, /<script type="module" src="\.\/src\/main\.js"><\/script>/);
});
