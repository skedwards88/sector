import React from "react";
import ControlBar from "./ControlBar";
import Overlay from "./Overlay";
import Played from "./Played";
import Deck from "./Deck";
import {canEndTurnQ} from "../logic/canEndTurnQ";
import {calculateScore} from "../logic/calculateScore";
import {mergeOverlayAndPlayed} from "../logic/mergeOverlayAndPlayed";

export default function Game({
  gameState,
  dispatchGameState,
  setDisplay,
  setInstallPromptEvent,
  showInstallButton,
  installPromptEvent,
}) {
  const currentColor = gameState.isBlueTurn ? "blue" : "red";
  const opponentColor = gameState.isBlueTurn ? "red" : "blue";

  const [placementIsLegal, illegalPlacementInfo] = canEndTurnQ({
    overlayTopLeft: gameState.overlayTopLeft,
    played: gameState.played,
    overlay: gameState.overlay,
  });

  const playerScore = gameState.scores[currentColor];
  const opponentScore = gameState.scores[opponentColor];

  const potentialScore = calculateScore(
    currentColor,
    gameState.overlayTopLeft === undefined
      ? gameState.played
      : mergeOverlayAndPlayed({
          played: gameState.played,
          overlay: gameState.overlay,
          overlayTopLeft: gameState.overlayTopLeft,
        }),
  );

  let feedback = "> ";
  feedback += PlayerGoal({playerScore, opponentScore, potentialScore});
  if (gameState.overlayTopLeft === undefined) {
    feedback += `\n\n> move the tile into the expanse`;
  } else if (!placementIsLegal) {
    feedback += `\n\n> ${illegalPlacementInfo}`;
  }

  return (
    <div id="app">
      <ControlBar
        dispatchGameState={dispatchGameState}
        setDisplay={setDisplay}
        setInstallPromptEvent={setInstallPromptEvent}
        showInstallButton={showInstallButton}
        installPromptEvent={installPromptEvent}
      ></ControlBar>
      <div id="board">
        <Played played={gameState.played}></Played>
        <Overlay
          overlayTopLeft={gameState.overlayTopLeft}
          overlay={gameState.overlay}
          expanseSize={Math.sqrt(gameState.played.length)}
          dispatchGameState={dispatchGameState}
        ></Overlay>
      </div>

      <div id="playerControls" className={currentColor}>
        {!gameState.overlay ? (
          <></>
        ) : (
          <Deck
            overlay={gameState.overlay}
            overlayTopLeft={gameState.overlayTopLeft}
            dispatchGameState={dispatchGameState}
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
