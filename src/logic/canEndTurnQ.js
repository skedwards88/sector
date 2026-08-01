export function canEndTurnQ({overlay, overlayTopLeft, played}) {
  // Determine whether the overlay placement is legal

  // If the overlay is not on the board, return
  if (overlayTopLeft === undefined) {
    return [false];
  }

  const expanseSize = Math.sqrt(played.length);

  let contactFound = false;
  for (let overlayIndex = 0; overlayIndex < overlay.length; overlayIndex++) {
    const adjustedIndex =
      overlayIndex < 2
        ? overlayTopLeft + overlayIndex
        : overlayTopLeft + expanseSize + overlayIndex - 2;
    // If blue is on red or vice versa, placement is invalid
    if (
      (played[adjustedIndex].color === "red" &&
        overlay[overlayIndex].color === "blue") ||
      (played[adjustedIndex].color === "blue" &&
        overlay[overlayIndex].color === "red")
    ) {
      return [false, "red and blue may not overlap"];
    }

    if (
      played[adjustedIndex].color ||
      played[adjustedIndex - expanseSize]?.color ||
      played[adjustedIndex + expanseSize]?.color ||
      played[adjustedIndex - 1]?.color ||
      played[adjustedIndex + 1]?.color
    ) {
      contactFound = true;
    }
  }

  // If the overlay doesn't overlap or share an edge with any played spaces, placement is invalid
  if (!contactFound) {
    return [false, "the tile must make contact with the existing tiles"];
  }

  return [true];
}
