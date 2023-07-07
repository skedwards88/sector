import React from "react";
import dragImage from "../images/moon.svg";

function handleDragStart({event, overlayIndex, dispatchGameState}) {
  // todo figure out ghost image
  const blankImage = new Image();
  blankImage.src = dragImage;
  blankImage.setAttribute("style", "display:none;");
  event.dataTransfer.setDragImage(blankImage, 0, 0);

  // Since we want to know the overlayIndex in the dragEnter event,
  // store that info in the game state
  // instead of using `event.dataTransfer.setData`
  // since the dragEnter event can't use `event.dataTransfer.getData`
  dispatchGameState({action: "dragStart", draggedOverlayIndex: overlayIndex});
}

function handleOnDragOver({event}) {
  // don't do anything except cancel default behavior here
  // since this basically fires continuously
  event.preventDefault();
}

function handleOnDragEnter({event, dispatchGameState, index}) {
  event.preventDefault();
  dispatchGameState({action: "dragEnter", dropIndex: index});
}

function handleOnDrop({event, dispatchGameState, index, source}) {
  event.preventDefault();
  dispatchGameState({action: "drop", dropIndex: index});
}

export default function Overlay({
  overlay,
  overlayTopLeft,
  expanseSize,
  dispatchGameState,
}) {
  // The overlay is just a bunch of empty drop targets
  let overlayDivs = [];
  for (let index = 0; index < expanseSize * expanseSize; index++) {
    overlayDivs.push(
      <div
        key={index}
        onDragOver={(event) => handleOnDragOver({event})}
        onDragEnter={(event) =>
          handleOnDragEnter({event, dispatchGameState, index})
        }
        onDrop={(event) =>
          handleOnDrop({event, dispatchGameState, index, source: "blank"})
        }
        onClick={() => dispatchGameState({action: "rotate"})}
      >
        {index}
      </div>,
    );
  }

  // Replace the quadrants where the overlaid piece actually is with the quadrant color/shape
  // And make the quadrant draggable in addition to being a drop target
  if (overlayTopLeft != undefined) {
    for (let overlayIndex = 0; overlayIndex < overlay.length; overlayIndex++) {
      const adjustedIndex =
        overlayIndex < 2
          ? overlayTopLeft + overlayIndex
          : overlayTopLeft + expanseSize + overlayIndex - 2;
      overlayDivs[adjustedIndex] = (
        <div
          draggable
          onDragStart={(event) =>
            handleDragStart({event, overlayIndex, dispatchGameState})
          }
          onDragOver={(event) => handleOnDragOver({event})}
          onDragEnter={(event) =>
            handleOnDragEnter({event, dispatchGameState, index: adjustedIndex})
          }
          onDrop={(event) =>
            handleOnDrop({
              event,
              dispatchGameState,
              index: adjustedIndex,
              source: "overlay",
            })
          }
          onClick={() => dispatchGameState({action: "rotate"})}
          className={`square overlay ${overlay[overlayIndex].color || ""} ${
            overlay[overlayIndex].shape || ""
          }`}
          key={`overlay${overlayIndex}`}
        >
          {overlayIndex}
        </div>
      );
    }
  }
  return <div id="overlay">{overlayDivs}</div>;
}
