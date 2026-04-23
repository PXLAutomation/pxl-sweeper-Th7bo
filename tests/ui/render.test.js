import test from "node:test";
import assert from "node:assert/strict";

import { createBoardFromMineCoordinates } from "../../src/game/board.js";
import { GAME_STATUS, TILE_VISIBILITY } from "../../src/game/constants.js";
import { createGameStateFromBoard } from "../../src/game/state.js";
import {
  formatGameStatus,
  getTilePresentation,
  renderBoardMarkup,
} from "../../src/ui/render.js";

test("formatGameStatus returns reader-friendly status labels", () => {
  assert.equal(formatGameStatus(GAME_STATUS.READY), "ready");
  assert.equal(formatGameStatus(GAME_STATUS.IN_PROGRESS), "surveying");
  assert.equal(formatGameStatus(GAME_STATUS.WON), "cleared");
  assert.equal(formatGameStatus(GAME_STATUS.LOST), "detonated");
});

test("getTilePresentation returns a flag marker for flagged tiles", () => {
  const [tile] = createBoardFromMineCoordinates(1, 1, [])[0];
  tile.visibility = TILE_VISIBILITY.FLAGGED;

  assert.deepEqual(getTilePresentation(tile), {
    text: "⚑",
    ariaLabel: "Flagged tile at row 1, column 1",
    className: "is-flagged",
  });
});

test("getTilePresentation returns a mine marker for revealed mine tiles", () => {
  const [tile] = createBoardFromMineCoordinates(1, 1, [[0, 0]])[0];
  tile.visibility = TILE_VISIBILITY.REVEALED;

  assert.deepEqual(getTilePresentation(tile), {
    text: "✦",
    ariaLabel: "Mine at row 1, column 1",
    className: "is-mine",
  });
});

test("renderBoardMarkup disables tiles after the game is won", () => {
  const board = createBoardFromMineCoordinates(1, 2, [[0, 0]]);
  board[0][1].visibility = TILE_VISIBILITY.REVEALED;
  const state = createGameStateFromBoard(board);
  state.status = GAME_STATUS.WON;

  const markup = renderBoardMarkup(state);

  assert.match(markup, /data-row="0"/);
  assert.match(markup, /disabled/);
  assert.match(markup, /is-hidden/);
  assert.match(markup, /is-number value-1/);
});
