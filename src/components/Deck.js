import React from "react";
import {polyfill} from "mobile-drag-drop";

polyfill();

function handleDragStart({event, overlayIndex, dispatchGameState}) {
  console.log("drag start deck");

  // Since we want to know the overlayIndex in the dragEnter event,
  // store that info in the game state
  // instead of using `event.dataTransfer.setData`
  // since the dragEnter event can't use `event.dataTransfer.getData`
  dispatchGameState({action: "dragStart", draggedOverlayIndex: overlayIndex});
}

export default function Deck({overlayTopLeft, overlay, dispatchGameState}) {
  // If overlayTopLeft is not undefined, the tile is being dragged (is not on the deck).
  // In this case, we don't want to show the deck,
  // but the mobile drag-drop polyfill freezes if we remove the source drag element mid-drag
  // so still render the elements, but hide them

  const hideDeck = overlayTopLeft != undefined;

  let deckDivs = [];

  if (hideDeck) {
    for (let overlayIndex = 0; overlayIndex < overlay.length; overlayIndex++) {
      deckDivs.push(<div key={`overlay${overlayIndex}`}></div>);
    }
  } else {
    for (let overlayIndex = 0; overlayIndex < overlay.length; overlayIndex++) {
      deckDivs.push(
        <div
          draggable
          onDragStart={(event) =>
            handleDragStart({event, overlayIndex, dispatchGameState})
          }
          onClick={() => dispatchGameState({action: "rotate"})}
          className={`square overlay ${overlay[overlayIndex].color || ""} ${
            overlay[overlayIndex].shape || ""
          }`}
          key={`overlay${overlayIndex}`}
          onDragEnd={() => console.log("drag end")}
        ></div>,
      );
    }
  }
  return <div id="deck" className={hideDeck ? "hidden" : ""}>{deckDivs}</div>;
}
