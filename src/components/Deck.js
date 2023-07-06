import React from "react";
import dragImage from "../images/moon.svg"

function handleDragStart({event, overlayIndex, dispatchGameState}) {
  console.log('drag start deck')
  // todo figure out ghost image
  const blankImage = new Image();
  blankImage.src = dragImage
  blankImage.setAttribute("style", "display:none;");
  event.dataTransfer.setDragImage(blankImage, 0, 0);

  // Since we want to know the overlayIndex in the dragEnter event,
  // store that info in the game state
  // instead of using `event.dataTransfer.setData`
  // since the dragEnter event can't use `event.dataTransfer.getData`
  dispatchGameState({action: "dragStart", draggedOverlayIndex: overlayIndex});
}


export default function Deck({
  overlay,
  dispatchGameState,
}) {
  console.log('render deck')
  let deckDivs = [];
  for (let overlayIndex = 0; overlayIndex < overlay.length; overlayIndex++) {
    deckDivs.push(
      <div
        draggable
        onDragStart={(event) => handleDragStart({event, overlayIndex, dispatchGameState})}
        className={`square overlay ${overlay[overlayIndex].color || ""} ${
          overlay[overlayIndex].shape || ""
        }`}
        key={`overlay${overlayIndex}`}
      >
        {overlayIndex}
      </div>
    );
  }
  return <div id="deck">{deckDivs}</div>;
}
