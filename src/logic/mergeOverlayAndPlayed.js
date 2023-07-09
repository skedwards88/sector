export function mergeOverlayAndPlayed({played, overlay, overlayTopLeft}) {
  console.log(JSON.stringify({overlayTopLeft}));
  let newPlayed = JSON.parse(JSON.stringify(played));
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
