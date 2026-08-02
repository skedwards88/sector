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

function handlePointerEnter({
  event,
  dispatchGameState,
  index,
}: {
  event: React.PointerEvent;
  dispatchGameState: React.Dispatch<ReducerPayload>;
  index: number;
}): void {
  event.preventDefault();

  dispatchGameState({action: "dragEnter", dropIndex: index});
}

function handlePointerUp({
  event,
  dispatchGameState,
}: {
  event: React.PointerEvent;
  dispatchGameState: React.Dispatch<ReducerPayload>;
}): void {
  event.preventDefault();

  dispatchGameState({action: "drop"});
}

export default function Overlay({
  overlay,
  overlayTopLeft,
  expanseSize,
  dispatchGameState,
}: {
  overlay: Tile | undefined;
  overlayTopLeft: number | undefined;
  expanseSize: number;
  dispatchGameState: React.Dispatch<ReducerPayload>;
}): React.JSX.Element {
  const overlayDivs = [];
  for (let index = 0; index < expanseSize * expanseSize; index++) {
    overlayDivs.push(
      <div
        key={index}
        onPointerEnter={(event) =>
          handlePointerEnter({event, dispatchGameState, index})
        }
        onPointerUp={(event) => handlePointerUp({event, dispatchGameState})}
        onClick={() => dispatchGameState({action: "rotate"})}
      ></div>,
    );
  }

  // Replace the quadrants where the overlaid piece actually is with the quadrant color/shape
  if (overlayTopLeft != undefined && overlay != undefined) {
    for (let overlayIndex = 0; overlayIndex < overlay.length; overlayIndex++) {
      let cornerClass = "";
      switch (overlayIndex) {
        case 0:
          cornerClass = "topLeft";
          break;
        case 1:
          cornerClass = "topRight";
          break;
        case 2:
          cornerClass = "bottomLeft";
          break;
        case 3:
          cornerClass = "bottomRight";
          break;

        default:
          break;
      }
      const adjustedIndex =
        overlayIndex < 2
          ? overlayTopLeft + overlayIndex
          : overlayTopLeft + expanseSize + overlayIndex - 2;
      overlayDivs[adjustedIndex] = (
        <div
          onPointerDown={(event) =>
            handlePointerDown({event, overlayIndex, dispatchGameState})
          }
          onPointerEnter={(event) =>
            handlePointerEnter({event, dispatchGameState, index: adjustedIndex})
          }
          onPointerUp={(event) =>
            handlePointerUp({
              event,
              dispatchGameState,
            })
          }
          onClick={() => dispatchGameState({action: "rotate"})}
          className={`square overlay ${cornerClass} ${
            overlay[overlayIndex].color || ""
          } ${overlay[overlayIndex].shape || ""}`}
          key={`overlay${overlayIndex}`}
        ></div>
      );
    }
  }
  return <div id="overlay">{overlayDivs}</div>;
}
