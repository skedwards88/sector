import React from "react";

function handlePointerDown({event, overlayIndex, dispatchGameState}) {
  // Release pointer capture so that pointer events can fire on other elements
  event.currentTarget.releasePointerCapture(event.pointerId);

  event.preventDefault();

  dispatchGameState({action: "dragStart", draggedOverlayIndex: overlayIndex});
}

export default function Deck({
  overlayTopLeft,
  overlay,
  dispatchGameState,
  deck,
}) {
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
          onPointerDown={(event) =>
            handlePointerDown({event, overlayIndex, dispatchGameState})
          }
          onClick={() => dispatchGameState({action: "rotate"})}
          className={`square overlay ${overlay[overlayIndex].color || ""} ${
            overlay[overlayIndex].shape || ""
          }`}
          key={`overlay${overlayIndex}`}
        ></div>,
      );
    }
  }
  return (
    <div id="deckAndRemaining">
      <div id="deckRemaining" className={hideDeck ? "" : "hidden"}>{`${
        deck.length - 1
      }\nleft`}</div>
      <div id="deck" className={hideDeck ? "hidden" : ""}>
        {deckDivs}
      </div>
    </div>
  );
}
