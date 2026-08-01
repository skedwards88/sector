import React from "react";

function handlePointerDown({event, overlayIndex, dispatchGameState}) {
  // Release pointer capture so that pointer events can fire on other elements
  event.currentTarget.releasePointerCapture(event.pointerId);

  event.preventDefault();

  dispatchGameState({action: "dragStart", draggedOverlayIndex: overlayIndex});
}

function DeckAsTile({overlay, dispatchGameState}) {
  let deckDivs = [];
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

  return <div id="deck">{deckDivs}</div>;
}

function DeckAsNumRemaining({deck}) {
  return <div id="deckRemaining">{`${deck.length - 1}\nleft`}</div>;
}

export default function Deck({
  overlayTopLeft,
  overlay,
  dispatchGameState,
  deck,
}) {
  // If overlayTopLeft is not undefined, the tile is being dragged (is not on the deck).
  // In this case, we don't want to show the deck
  if (overlayTopLeft != undefined) {
    return <DeckAsNumRemaining deck={deck}></DeckAsNumRemaining>;
  } else
    return (
      <DeckAsTile
        overlay={overlay}
        dispatchGameState={dispatchGameState}
      ></DeckAsTile>
    );
}
