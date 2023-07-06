import {gameInit} from "./gameInit.js";

export function gameReducer(currentGameState, payload) {
  if (payload.action === "newGame") {

    return gameInit({
      ...currentGameState,
      ...payload,
      useSaved: false,
    });
  } else if (payload.action === "dragStart") {
    return {
      ...currentGameState,
      draggedOverlayIndex: payload.draggedOverlayIndex,
    }
  } else if (payload.action === "drop" || payload.action === "dragEnter") {
    // Drop a piece on the overlay, but don't update the played pieces yet (that is taken care of by the 'end turn' action)

    // Adjust the position depending on which quadrant was dragged
    let newOverlayTopLeft
    switch (parseInt(currentGameState.draggedOverlayIndex)) {
      case 0:
        newOverlayTopLeft = payload.dropIndex
        break;
      case 1:
        newOverlayTopLeft = payload.dropIndex - 1
        break;
      case 2:
        newOverlayTopLeft = payload.dropIndex - currentGameState.expanseSize
        break;
      case 3:
        newOverlayTopLeft = payload.dropIndex - currentGameState.expanseSize - 1
        break;
  
      default:
        newOverlayTopLeft = payload.dropIndex
        break;
    }
    return {
      ...currentGameState,
      overlayTopLeft: newOverlayTopLeft,
    };
  } else if (payload.action === "endTurn") {
    console.log("endTurn")
    // todo:

    // set currentGameState.draggedOverlayIndex to undefined
    //   need to make the deck use the next card in the deck
    // update played
    return {
      ...currentGameState,
    }
  } else {
    console.error(`unhandled action: ${payload.action}`);
    return {...currentGameState};
  }
}
