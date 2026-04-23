import test from "node:test";
import assert from "node:assert/strict";

import {
  createBoard,
  createBoardFromMineCoordinates,
  createEmptyBoard,
  getNeighborCoordinates,
} from "../../src/game/board.js";
import {
  DEFAULT_COLUMNS,
  DEFAULT_MINE_COUNT,
  DEFAULT_ROWS,
  TILE_VISIBILITY,
} from "../../src/game/constants.js";

test("createEmptyBoard returns hidden tiles with stable coordinates", () => {
  const board = createEmptyBoard(2, 3);

  assert.equal(board.length, 2);
  assert.equal(board[0].length, 3);
  assert.deepEqual(board[1][2], {
    row: 1,
    column: 2,
    id: "1:2",
    hasMine: false,
    adjacentMines: 0,
    visibility: TILE_VISIBILITY.HIDDEN,
  });
});

test("getNeighborCoordinates respects board edges and corners", () => {
  assert.deepEqual(getNeighborCoordinates(0, 0, 3, 3), [
    [0, 1],
    [1, 0],
    [1, 1],
  ]);

  assert.deepEqual(getNeighborCoordinates(1, 1, 3, 3), [
    [0, 0],
    [0, 1],
    [0, 2],
    [1, 0],
    [1, 2],
    [2, 0],
    [2, 1],
    [2, 2],
  ]);
});

test("createBoardFromMineCoordinates computes exact adjacent mine counts", () => {
  const board = createBoardFromMineCoordinates(3, 3, [
    [0, 0],
    [2, 2],
  ]);

  const summarizedBoard = board.map((row) =>
    row.map((tile) => (tile.hasMine ? "M" : tile.adjacentMines)),
  );

  assert.deepEqual(summarizedBoard, [
    ["M", 1, 0],
    [1, 2, 1],
    [0, 1, "M"],
  ]);
});

test("createBoard uses the default dimensions and mine count", () => {
  const board = createBoard();
  const allTiles = board.flat();
  const mineTiles = allTiles.filter((tile) => tile.hasMine);

  assert.equal(board.length, DEFAULT_ROWS);
  assert.equal(board[0].length, DEFAULT_COLUMNS);
  assert.equal(mineTiles.length, DEFAULT_MINE_COUNT);
  assert.equal(allTiles.length, DEFAULT_ROWS * DEFAULT_COLUMNS);
});

test("createBoard supports deterministic mine placement through injected randomness", () => {
  const plannedValues = [0.99, 0.95, 0.9, 0.85];
  let index = 0;
  const random = () => plannedValues[index++] ?? 0;

  const board = createBoard({
    rows: 2,
    columns: 2,
    mineCount: 2,
    random,
  });

  const mineCoordinates = board
    .flat()
    .filter((tile) => tile.hasMine)
    .map((tile) => [tile.row, tile.column]);

  assert.deepEqual(mineCoordinates, [
    [0, 0],
    [0, 1],
  ]);
});
