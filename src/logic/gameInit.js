import sendAnalytics from "./sendAnalytics";
import {deck} from "./deck"

export function gameInit({
  expanseSize = 10, // todo this isnt being used everywhere (e.g. css)
  useSaved = true,
}) {

  sendAnalytics("new_game");

  const played = Array.from({ length: expanseSize * expanseSize }, () => ({color: "black", shape: ""}));

  const firstTileTopLeft = 44; // todo could calc from expanse size
  const firstTile = deck.pop();
  for (let quadrantIndex = 0; quadrantIndex < firstTile.length; quadrantIndex++) {
    const adjustedIndex =
      quadrantIndex < 2
        ? firstTileTopLeft + quadrantIndex
        : firstTileTopLeft + expanseSize + quadrantIndex - 2;
      played[adjustedIndex].color = firstTile[quadrantIndex].color
      played[adjustedIndex].shape = firstTile[quadrantIndex].shape
  }

// todo shuffle deck

  return {
    played,
    expanseSize,
    deck,
    overlayTopLeft: undefined, // undefined indicates that the overlay piece is off the board (on top of the deck)
    draggedOverlayIndex: undefined,
    lastBreakingChange: "20230706",
  };
}
