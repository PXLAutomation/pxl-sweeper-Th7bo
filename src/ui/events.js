export function bindGameEvents(root, handlers) {
  const boardElement = root.querySelector("[data-board]");
  const resetButton = root.querySelector("[data-reset]");

  boardElement.addEventListener("click", (event) => {
    const tile = event.target.closest("[data-row][data-column]");

    if (!tile) {
      return;
    }

    handlers.onReveal(Number(tile.dataset.row), Number(tile.dataset.column));
  });

  boardElement.addEventListener("contextmenu", (event) => {
    const tile = event.target.closest("[data-row][data-column]");

    if (!tile) {
      return;
    }

    event.preventDefault();
    handlers.onFlag(Number(tile.dataset.row), Number(tile.dataset.column));
  });

  resetButton.addEventListener("click", () => {
    handlers.onReset();
  });
}
