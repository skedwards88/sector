import {calculateScore} from "./calculateScore";
import {gameInit} from "./gameInit";
import {mergeOverlayAndPlayed} from "./mergeOverlayAndPlayed";
import {rotateTile} from "./rotateTile";
import type {GameState, PlayerColor, Tile} from "../Types";

export type ReducerPayload =
  | {action: "newGame"; isVsBot: boolean}
  | {action: "rotate"}
  | {action: "dragStart"; draggedOverlayIndex: number}
  | {action: "dragEnter"; dropIndex: number}
  | {action: "drop"}
  | {
      action: "endTurn";
      overlay: Tile;
      overlayTopLeft: number;
      andScore: boolean;
    };

function updateDraggedOverlayIndex({
  draggedOverlayIndex,
  dropIndex,
  boardDimension,
  tileDimension,
}: {
  draggedOverlayIndex: number;
  dropIndex: number;
  boardDimension: number;
  tileDimension: number;
}): number {
  // Convert the index where the overlay was dropped to a row/column
  const dropRow = Math.floor(dropIndex / boardDimension);
  const dropColumn = dropIndex - dropRow * boardDimension;

  // Convert the overlay quadrant index that the user dragged to a row/column
  const overlayRow = Math.floor(draggedOverlayIndex / tileDimension);
  const overlayColumn = draggedOverlayIndex - overlayRow * tileDimension;

  // Adjust the index where the overlay was dropped
  // to reflect the index where the top left of the overlay ended up
  // but don't let the overlay go off the board
  const adjustedDropRow = Math.min(
    Math.max(0, dropRow - overlayRow),
    boardDimension - 2,
  );
  const adjustedDropColumn = Math.min(
    Math.max(0, dropColumn - overlayColumn),
    boardDimension - 2,
  );

  // Convert the row/column back to the index where the top left of the overlay ended up
  const newOverlayTopLeft =
    adjustedDropColumn + boardDimension * adjustedDropRow;

  return newOverlayTopLeft;
}

export function gameReducer(
  currentGameState: GameState,
  payload: ReducerPayload,
): GameState {
  if (payload.action === "newGame") {
    return gameInit({isVsBot: payload.isVsBot});
  } else if (payload.action === "rotate") {
    const overlay = currentGameState.overlay;
    if (overlay === undefined) {
      return currentGameState;
    }

    const newOverlay = rotateTile(overlay);
    return {
      ...currentGameState,
      overlay: newOverlay,
    };
  } else if (payload.action === "dragStart") {
    // Store the quadrant that the player is dragging
    // in the game state instead of in the event data
    // so that we can access the data from a different event
    return {
      ...currentGameState,
      draggedOverlayIndex: payload.draggedOverlayIndex,
    };
  } else if (payload.action === "dragEnter") {
    // Update the overlay, but don't update the played pieces yet (that is taken care of by the 'end turn' action)

    const overlay = currentGameState.overlay;

    const draggedOverlayIndex = currentGameState.draggedOverlayIndex;

    if (draggedOverlayIndex === undefined || overlay === undefined) {
      return currentGameState;
    }

    const newOverlayTopLeft = updateDraggedOverlayIndex({
      draggedOverlayIndex,
      dropIndex: payload.dropIndex,
      boardDimension: Math.sqrt(currentGameState.played.length),
      tileDimension: Math.sqrt(overlay.length),
    });

    return {
      ...currentGameState,
      overlayTopLeft: newOverlayTopLeft,
    };
  } else if (payload.action === "drop") {
    return {
      ...currentGameState,
      draggedOverlayIndex: undefined,
    };
  } else if (payload.action === "endTurn") {
    console.log(`end turn reducer ${JSON.stringify(payload)}`);
    // In all cases, update the board
    const newPlayed = mergeOverlayAndPlayed({
      played: currentGameState.played,
      overlay: payload.overlay,
      overlayTopLeft: payload.overlayTopLeft,
    });

    // Draw the next tile from the deck
    // If this was the last turn, the deck is empty and
    //   the drawn tile will be `undefined`
    const newDeck = structuredClone(currentGameState.deck);
    const playerColor = currentGameState.isBlueTurn ? "blue" : "red";
    const opponentColor = currentGameState.isBlueTurn ? "red" : "blue";

    const newOverlay = newDeck.pop();

    // Calculate the score in certain cases:
    const newScores = structuredClone(currentGameState.scores);
    let newIsTie = currentGameState.isTie;
    if (newOverlay === undefined) {
      // Calculate the score(s) if this is the last turn
      // If neither player has scored AND the scores are tied, this is a tie
      // (if a player has already scored, ties count as a win for that player)
      const canBeTie = Object.values(newScores).every(
        (color) => color === undefined,
      );
      for (const color in newScores) {
        if (newScores[color as PlayerColor] === undefined) {
          const score = calculateScore(color as PlayerColor, newPlayed);
          newScores[color as PlayerColor] = score;
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
    console.log(
      `unknown action: ${(payload as unknown as {action: string}).action}`,
    );
    return currentGameState;
  }
}
