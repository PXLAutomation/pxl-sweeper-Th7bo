import test from "node:test";
import assert from "node:assert/strict";

import { revealTile, toggleFlag } from "../../src/game/actions.js";
import { createBoardFromMineCoordinates } from "../../src/game/board.js";
import { GAME_STATUS, TILE_VISIBILITY } from "../../src/game/constants.js";
import { createGameStateFromBoard } from "../../src/game/state.js";

function createState(mineCoordinates, rows = 3, columns = 3) {
  return createGameStateFromBoard(
    createBoardFromMineCoordinates(rows, columns, mineCoordinates),
  );
}

function summarizeVisibility(board) {
  return board.map((row) =>
    row.map((tile) => {
      if (tile.visibility === TILE_VISIBILITY.FLAGGED) {
        return "F";
      }

      if (tile.visibility !== TILE_VISIBILITY.REVEALED) {
        return "H";
      }

      return tile.hasMine ? "M" : tile.adjacentMines;
    }),
  );
}

test("revealTile reveals a numbered safe tile and starts the game", () => {
  const state = createState([[0, 0]]);

  const nextState = revealTile(state, 0, 1);

  assert.equal(nextState.status, GAME_STATUS.IN_PROGRESS);
  assert.equal(nextState.board[0][1].visibility, TILE_VISIBILITY.REVEALED);
  assert.equal(nextState.board[0][1].adjacentMines, 1);
  assert.equal(nextState.hiddenSafeTiles, 7);
});

test("revealTile expands across connected zero tiles and bordering numbers", () => {
  const state = createState([[0, 0]]);

  const nextState = revealTile(state, 2, 2);

  assert.deepEqual(summarizeVisibility(nextState.board), [
    ["H", 1, 0],
    [1, 1, 0],
    [0, 0, 0],
  ]);
  assert.equal(nextState.status, GAME_STATUS.WON);
  assert.equal(nextState.hiddenSafeTiles, 0);
});

test("toggleFlag marks and unmarks a hidden tile", () => {
  const state = createState([[0, 0]]);

  const flaggedState = toggleFlag(state, 1, 1);
  const unflaggedState = toggleFlag(flaggedState, 1, 1);

  assert.equal(flaggedState.board[1][1].visibility, TILE_VISIBILITY.FLAGGED);
  assert.equal(flaggedState.flagsUsed, 1);
  assert.equal(unflaggedState.board[1][1].visibility, TILE_VISIBILITY.HIDDEN);
  assert.equal(unflaggedState.flagsUsed, 0);
});

test("revealTile does not reveal a flagged tile", () => {
  const state = toggleFlag(createState([[0, 0]]), 1, 1);

  const nextState = revealTile(state, 1, 1);

  assert.equal(nextState.board[1][1].visibility, TILE_VISIBILITY.FLAGGED);
  assert.equal(nextState.hiddenSafeTiles, state.hiddenSafeTiles);
});

test("revealTile loses the game on a mine and reveals all mines", () => {
  const state = createState([
    [0, 0],
    [2, 2],
  ]);

  const nextState = revealTile(state, 0, 0);

  assert.equal(nextState.status, GAME_STATUS.LOST);
  assert.equal(nextState.board[0][0].visibility, TILE_VISIBILITY.REVEALED);
  assert.equal(nextState.board[2][2].visibility, TILE_VISIBILITY.REVEALED);
});

test("revealTile wins when all safe tiles are revealed", () => {
  let state = createState([[0, 0]], 2, 2);

  state = revealTile(state, 0, 1);
  state = revealTile(state, 1, 0);
  state = revealTile(state, 1, 1);

  assert.equal(state.status, GAME_STATUS.WON);
  assert.equal(state.hiddenSafeTiles, 0);
});

test("game-over states lock further reveal and flag actions", () => {
  const lostState = revealTile(createState([[0, 0]]), 0, 0);
  const afterReveal = revealTile(lostState, 1, 1);
  const afterFlag = toggleFlag(lostState, 1, 1);

  assert.strictEqual(afterReveal, lostState);
  assert.strictEqual(afterFlag, lostState);
});
