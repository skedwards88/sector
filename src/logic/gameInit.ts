import type {GameState, Square} from "../Types";
import {deck} from "./deck";
import {shuffleArray} from "@skedwards88/word_logic";

export function gameInit({isVsBot = false}: {isVsBot?: boolean}): GameState {
  const expanseSize = 10;

  const shuffledDeck = shuffleArray(deck);

  // The played quadrants are empty except for a single tile in the middle of the board
  const played: Square[] = Array.from(
    {length: expanseSize * expanseSize},
    () => ({
      color: null,
      shape: null,
    }),
  );
  const firstTileTopLeft = 44; // todo could calc from expanse size
  const firstTile = shuffledDeck.pop();

  if (firstTile === undefined) {
    throw new Error("deck is empty");
  }

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
    id: crypto.randomUUID(), // just a random ID to track when the user generates a new puzzle
    isVsBot,
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
    firstScorer: undefined,
    lastBreakingChange: "20230706",
  };
}
