import cloneDeep from "lodash.clonedeep";
import {calculateScore} from "./calculateScore.js";
import {gameInit} from "./gameInit.js";
import {mergeOverlayAndPlayed} from "./mergeOverlayAndPlayed";

export function gameReducer(currentGameState, payload) {
  if (payload.action === "newGame") {
    return gameInit({
      ...currentGameState,
      ...payload,
      useSaved: false,
    });
  } else if (payload.action === "rotate") {
    let oldOverlay = currentGameState.overlay;
    let newOverlay = [
      oldOverlay[2],
      oldOverlay[0],
      oldOverlay[3],
      oldOverlay[1],
    ];
    return {
      ...currentGameState,
      overlay: newOverlay,
    };
  } else if (payload.action === "dragStart") {
    // Store the quadrant that the player is dragging
    // in the game state instead of in the event data
    // so that we can access the data from the dragEnter event
    return {
      ...currentGameState,
      draggedOverlayIndex: payload.draggedOverlayIndex,
    };
  } else if (payload.action === "drop" || payload.action === "dragEnter") {
    // Drop/move a piece on the overlay, but don't update the played pieces yet (that is taken care of by the 'end turn' action)

    // Convert the index where the overlay was dropped to a row/column
    const expanseSize = Math.sqrt(currentGameState.played.length);
    const dropIndex = payload.dropIndex;
    const dropRow = Math.floor(dropIndex / expanseSize);
    const dropColumn = dropIndex - dropRow * expanseSize;

    // Convert the overlay quadrant index that the user dragged t oa row/column
    const overlayIndex = currentGameState.draggedOverlayIndex;
    const overlayRow = Math.floor(
      overlayIndex / (currentGameState.overlay.length / 2),
    );
    const overlayColumn =
      overlayIndex - overlayRow * (currentGameState.overlay.length / 2);

    // Adjust the index where the overlay was dropped
    // to reflect the index where the top left of the overlay ended up
    // but don't let the overlay go off the board
    const adjustedDropRow = Math.min(
      Math.max(0, dropRow - overlayRow),
      expanseSize - 2,
    );
    const adjustedDropColumn = Math.min(
      Math.max(0, dropColumn - overlayColumn),
      expanseSize - 2,
    );

    // Convert the row/column back to the index where the top left of the overlay ended up
    const newOverlayTopLeft =
      adjustedDropColumn + expanseSize * adjustedDropRow;

    return {
      ...currentGameState,
      overlayTopLeft: newOverlayTopLeft,
    };
  } else if (payload.action === "endTurn") {
    // In all cases, update the board
    let newPlayed = mergeOverlayAndPlayed({
      played: currentGameState.played,
      overlay: currentGameState.overlay,
      overlayTopLeft: currentGameState.overlayTopLeft,
    });

    // Draw the next tile from the deck
    // If this was the last turn, the deck is empty and
    //   the drawn tile will be `undefined`
    let newDeck = cloneDeep(currentGameState.deck);
    const playerColor = currentGameState.isBlueTurn ? "blue" : "red";
    const opponentColor = currentGameState.isBlueTurn ? "red" : "blue";

    const newOverlay = newDeck.pop();

    // Calculate the score in certain cases:
    let newScores = cloneDeep(currentGameState.scores);
    let newIsTie = currentGameState.isTie;
    if (!newDeck.length) {
      // Calculate the score(s) if this is the last turn
      // If neither player has scored AND the scores are tied, this is a tie
      // (if a player has already scored, ties count as a win for that player)
      const canBeTie = Object.values(newScores).every(
        (color) => color === undefined,
      );
      for (const color in newScores) {
        if (newScores[color] === undefined) {
          const score = calculateScore(color, newPlayed);
          newScores[color] = score;
        }
      }
      newIsTie =
        canBeTie && Object.values(newScores)[0] === Object.values(newScores)[1];
    } else if (payload.andScore) {
      // Calculate the score if the player requested
      const score = calculateScore(playerColor, newPlayed);
      newScores[playerColor] = score;
    } else if (newScores[opponentColor] != undefined) {
      // Calculate the score if the opponent has scored
      //  AND the current players score is > the opponent's score
      const potentialScore = calculateScore(playerColor, newPlayed);
      if (potentialScore > newScores[opponentColor]) {
        newScores[playerColor] = potentialScore;
      }
    }

    return {
      ...currentGameState,
      deck: newDeck,
      overlay: newOverlay,
      draggedOverlayIndex: undefined,
      overlayTopLeft: undefined,
      played: newPlayed,
      isBlueTurn: !currentGameState.isBlueTurn,
      scores: newScores,
      isTie: newIsTie,
    };
  } else {
    console.error(`unhandled action: ${payload.action}`);
    return {...currentGameState};
  }
}
