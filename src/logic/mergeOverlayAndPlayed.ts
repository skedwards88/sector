import type {Square, Tile} from "../Types";

export function mergeOverlayAndPlayed({
  played,
  overlay,
  overlayTopLeft,
}: {
  played: Square[];
  overlay: Tile;
  overlayTopLeft: number | undefined;
}): Square[] {
  // If the overlay is not on the board, return
  if (overlayTopLeft === undefined) {
    return played;
  }

  const newPlayed = structuredClone(played);
  const expanseSize = Math.sqrt(played.length);

  for (let overlayIndex = 0; overlayIndex < overlay.length; overlayIndex++) {
    const adjustedIndex =
      overlayIndex < 2
        ? overlayTopLeft + overlayIndex
        : overlayTopLeft + expanseSize + overlayIndex - 2;
    newPlayed[adjustedIndex].color = overlay[overlayIndex].color;
    newPlayed[adjustedIndex].shape = overlay[overlayIndex].shape;
  }
  return newPlayed;
}
