import { GAME_STATUS, TILE_VISIBILITY } from "../game/constants.js";

export function formatGameStatus(status) {
  if (status === GAME_STATUS.IN_PROGRESS) {
    return "surveying";
  }

  if (status === GAME_STATUS.WON) {
    return "cleared";
  }

  if (status === GAME_STATUS.LOST) {
    return "detonated";
  }

  return "ready";
}

function getStatusCopy(state) {
  if (state.status === GAME_STATUS.WON) {
    return "Field cleared. Every safe tile has been surveyed.";
  }

  if (state.status === GAME_STATUS.LOST) {
    return "Charge triggered. Reset the board and try another route.";
  }

  if (state.status === GAME_STATUS.IN_PROGRESS) {
    return "Survey in motion. Reveal safe cells and mark likely charges.";
  }

  return "Survey the field. Left click reveals a tile. Right click marks a charge.";
}

export function getTilePresentation(tile) {
  if (tile.visibility === TILE_VISIBILITY.FLAGGED) {
    return {
      text: "⚑",
      ariaLabel: `Flagged tile at row ${tile.row + 1}, column ${tile.column + 1}`,
      className: "is-flagged",
    };
  }

  if (tile.visibility !== TILE_VISIBILITY.REVEALED) {
    return {
      text: "",
      ariaLabel: `Hidden tile at row ${tile.row + 1}, column ${tile.column + 1}`,
      className: "is-hidden",
    };
  }

  if (tile.hasMine) {
    return {
      text: "✦",
      ariaLabel: `Mine at row ${tile.row + 1}, column ${tile.column + 1}`,
      className: "is-mine",
    };
  }

  if (tile.adjacentMines === 0) {
    return {
      text: "",
      ariaLabel: `Empty revealed tile at row ${tile.row + 1}, column ${tile.column + 1}`,
      className: "is-empty",
    };
  }

  return {
    text: String(tile.adjacentMines),
    ariaLabel: `Revealed tile with ${tile.adjacentMines} adjacent mines at row ${tile.row + 1}, column ${tile.column + 1}`,
    className: `is-number value-${tile.adjacentMines}`,
  };
}

export function renderBoardMarkup(state) {
  return state.board
    .map((row) =>
      row
        .map((tile) => {
          const presentation = getTilePresentation(tile);
          const isDisabled =
            tile.visibility === TILE_VISIBILITY.REVEALED ||
            state.status === GAME_STATUS.WON ||
            state.status === GAME_STATUS.LOST;

          return `
            <button
              class="tile ${presentation.className}"
              type="button"
              data-row="${tile.row}"
              data-column="${tile.column}"
              aria-label="${presentation.ariaLabel}"
              ${isDisabled ? "disabled" : ""}
            >
              <span>${presentation.text}</span>
            </button>
          `;
        })
        .join(""),
    )
    .join("");
}

export function renderGame(root, state) {
  const boardElement = root.querySelector("[data-board]");
  const statusElement = root.querySelector("[data-status-copy]");
  const stateBadge = root.querySelector("[data-state-badge]");
  const remainingMinesElement = root.querySelector("[data-remaining-mines]");
  const hiddenSafeTilesElement = root.querySelector("[data-hidden-safe-tiles]");
  const boardFrame = root.querySelector("[data-board-frame]");

  boardElement.innerHTML = renderBoardMarkup(state);
  boardElement.style.setProperty("--board-columns", String(state.board[0]?.length ?? 0));

  boardFrame.dataset.status = state.status;
  stateBadge.textContent = formatGameStatus(state.status);
  statusElement.textContent = getStatusCopy(state);
  remainingMinesElement.textContent = String(state.mineCount - state.flagsUsed);
  hiddenSafeTilesElement.textContent = String(state.hiddenSafeTiles);
}
