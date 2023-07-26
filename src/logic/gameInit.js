import sendAnalytics from "./sendAnalytics";
import {deck} from "./deck";
import {shuffleArray} from "./shuffleArray";

export function gameInit({expanseSize = 10, useSaved = true}) {
  const shuffledDeck = shuffleArray(deck);

  sendAnalytics("new_game");

  // The played quadrants are empty except for a single tile in the middle of the board
  const played = Array.from({length: expanseSize * expanseSize}, () => ({
    color: "",
    shape: "",
  }));
  const firstTileTopLeft = 44; // todo could calc from expanse size
  const firstTile = shuffledDeck.pop();
  for (
    let quadrantIndex = 0;
    quadrantIndex < firstTile.length;
    quadrantIndex++
  ) {
    const adjustedIndex =
      quadrantIndex < 2
        ? firstTileTopLeft + quadrantIndex
        : firstTileTopLeft + expanseSize + quadrantIndex - 2;
    played[adjustedIndex].color = firstTile[quadrantIndex].color;
    played[adjustedIndex].shape = firstTile[quadrantIndex].shape;
  }

  const overlay = shuffledDeck.pop();

  return {
    played,
    deck: shuffledDeck,
    overlay,
    overlayTopLeft: undefined, // undefined indicates that the overlay piece is off the board (on top of the deck)
    draggedOverlayIndex: undefined,
    isBlueTurn: true,
    scores: {
      red: undefined,
      blue: undefined,
    },
    isTie: false,
    lastBreakingChange: "20230706",
  };
}
