import React from "react";
import {calculateScore} from "../logic/calculateScore";
import {mergeOverlayAndPlayed} from "../logic/mergeOverlayAndPlayed";
import Deck from "./Deck";
import {canEndTurnQ} from "../logic/canEndTurnQ";

function PlayerGoal({playerScore, opponentScore, potentialScore}) {
  if (playerScore === undefined && opponentScore === undefined) {
    return "goal: maximize your score";
  }
  if (playerScore != undefined) {
    return `goal: prevent your opponent from ending their turn with more than ${playerScore} points`;
  }

  if (opponentScore != undefined) {
    return `goal: end your turn with more than ${opponentScore} points\n\n> current points: ${potentialScore}`;
  }

  return "";
}

export default function PlayerControls({
  isBlueTurn,
  scores,
  overlayTopLeft,
  dispatchGameState,
  played,
  overlay,
  deck,
}) {
  const [placementIsLegal, illegalPlacementInfo] = canEndTurnQ({
    overlayTopLeft: overlayTopLeft,
    played: played,
    overlay: overlay,
  });

  const currentColor = isBlueTurn ? "blue" : "red";
  const opponentColor = isBlueTurn ? "red" : "blue";
  const playerScore = scores[currentColor];
  const opponentScore = scores[opponentColor];

  const potentialScore = calculateScore(
    currentColor,
    overlayTopLeft === undefined
      ? played
      : mergeOverlayAndPlayed({
          played: played,
          overlay: overlay,
          overlayTopLeft: overlayTopLeft,
        }),
  );

  let feedback = "> ";
  feedback += PlayerGoal({playerScore, opponentScore, potentialScore});
  if (overlayTopLeft === undefined) {
    feedback += `\n\n> move the tile into the expanse`;
  } else if (!placementIsLegal) {
    feedback += `\n\n> ${illegalPlacementInfo}`;
  }

  return (
    <div id="playerScreen">
      <div id="playerControls" className={currentColor}>
        {!overlay ? (
          <></>
        ) : (
          <Deck
            overlay={overlay}
            overlayTopLeft={overlayTopLeft}
            dispatchGameState={dispatchGameState}
            deck={deck}
          ></Deck>
        )}
        <button
          id="endTurn"
          disabled={!placementIsLegal}
          onClick={() => dispatchGameState({action: "endTurn"})}
          className={currentColor}
        >
          {`end turn`}
        </button>
        {playerScore === undefined && opponentScore === undefined ? (
          <button
            id="endAndScore"
            disabled={!placementIsLegal}
            className={currentColor}
            onClick={() =>
              dispatchGameState({action: "endTurn", andScore: true})
            }
          >
            {`end turn; score ${potentialScore}`}
          </button>
        ) : (
          <div></div>
        )}
        <div id="terminal">{feedback}</div>
      </div>

      <div id="sheen"></div>
    </div>
  );
}
