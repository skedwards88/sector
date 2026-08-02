import {type ReducerPayload} from "../logic/gameReducer";
import type {Tile} from "../Types";

function handlePointerDown({
  event,
  overlayIndex,
  dispatchGameState,
}: {
  event: React.PointerEvent;
  overlayIndex: number;
  dispatchGameState: React.Dispatch<ReducerPayload>;
}): void {
  // Release pointer capture so that pointer events can fire on other elements
  event.currentTarget.releasePointerCapture(event.pointerId);

  event.preventDefault();

  dispatchGameState({action: "dragStart", draggedOverlayIndex: overlayIndex});
}

function DeckAsTile({
  overlay,
  dispatchGameState,
}: {
  overlay: Tile;
  dispatchGameState: React.Dispatch<ReducerPayload>;
}): React.JSX.Element {
  const deckDivs = [];
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

function DeckAsNumRemaining({deck}: {deck: Tile[]}): React.JSX.Element {
  return <div id="deckRemaining">{`${deck.length}\nleft`}</div>;
}

export default function Deck({
  overlayTopLeft,
  overlay,
  dispatchGameState,
  deck,
}: {
  overlayTopLeft: number;
  overlay: Tile;
  dispatchGameState: React.Dispatch<ReducerPayload>;
  deck: Tile[];
}): React.JSX.Element {
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
