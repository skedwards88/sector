import React from "react";

function handlePointerDown({event, overlayIndex, dispatchGameState}) {
  // Release pointer capture so that pointer events can fire on other elements
  event.currentTarget.releasePointerCapture(event.pointerId);

  event.preventDefault();

  dispatchGameState({action: "dragStart", draggedOverlayIndex: overlayIndex});
}

function handlePointerEnter({event, dispatchGameState, index}) {
  event.preventDefault();

  dispatchGameState({action: "dragEnter", dropIndex: index});
}

function handlePointerUp({event, dispatchGameState, index}) {
  event.preventDefault();

  dispatchGameState({action: "drop", dropIndex: index});
}

export default function Overlay({
  overlay,
  overlayTopLeft,
  expanseSize,
  dispatchGameState,
}) {
  let overlayDivs = [];
  for (let index = 0; index < expanseSize * expanseSize; index++) {
    overlayDivs.push(
      <div
        key={index}
        onPointerEnter={(event) =>
          handlePointerEnter({event, dispatchGameState, index})
        }
        onPointerUp={(event) =>
          handlePointerUp({event, dispatchGameState, index})
        }
        onClick={() => dispatchGameState({action: "rotate"})}
      ></div>,
    );
  }

  // Replace the quadrants where the overlaid piece actually is with the quadrant color/shape
  if (overlayTopLeft != undefined) {
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
              index: adjustedIndex,
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
