export function canEndTurnQ({overlay, overlayTopLeft, played, expanseSize}) {
  // Determine whether the overlay placement is legal

  // If the overlay is not on the board, return
  if (overlayTopLeft === undefined) {
    console.log("not on board");
    return false;
  }

  // If blue is on red or vice versa, placement is invalid
  for (let overlayIndex = 0; overlayIndex < overlay.length; overlayIndex++) {
    const adjustedIndex =
      overlayIndex < 2
        ? overlayTopLeft + overlayIndex
        : overlayTopLeft + expanseSize + overlayIndex - 2;
    if (
      (played[adjustedIndex].color === "red" &&
        overlay[overlayIndex].color === "blue") ||
      (played[adjustedIndex].color === "blue" &&
        overlay[overlayIndex].color === "red")
    ) {
      console.log("overlap");
      return false;
    }
  }

  // If the overlay doesn't overlap or share an edge with any played spaces, placement is invalid
  let contactFound = false;
  for (let overlayIndex = 0; overlayIndex < overlay.length; overlayIndex++) {
    const adjustedIndex =
      overlayIndex < 2
        ? overlayTopLeft + overlayIndex
        : overlayTopLeft + expanseSize + overlayIndex - 2;
    if (
      played[adjustedIndex].color ||
      played[adjustedIndex - expanseSize]?.color ||
      played[adjustedIndex + expanseSize]?.color ||
      played[adjustedIndex - 1]?.color ||
      played[adjustedIndex + 1]?.color
    ) {
      contactFound = true;
      break;
    }
  }

  if (!contactFound) {
    return false;
  }

  return true;
}
