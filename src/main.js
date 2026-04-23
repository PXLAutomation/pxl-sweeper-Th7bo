import { revealTile, toggleFlag } from "./game/actions.js";
import { createGameState } from "./game/state.js";
import { bindGameEvents } from "./ui/events.js";
import { renderGame } from "./ui/render.js";

const root = document.querySelector("[data-game-root]");

if (root) {
  let state = createGameState();

  const update = () => {
    renderGame(root, state);
  };

  bindGameEvents(root, {
    onReveal(row, column) {
      state = revealTile(state, row, column);
      update();
    },
    onFlag(row, column) {
      state = toggleFlag(state, row, column);
      update();
    },
    onReset() {
      state = createGameState();
      update();
    },
  });

  update();
}
