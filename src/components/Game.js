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
  const [canEndTurn, canEndTurnReason] = canEndTurnQ({
    overlayTopLeft: gameState.overlayTopLeft,
    played: gameState.played,
    overlay: gameState.overlay,
  });

  const canScore = gameState.scores[currentColor] === undefined;


  let feedback = "";
  if (gameState.overlayTopLeft === undefined) {
    feedback = `${currentColor.toUpperCase()}'s turn.\n\nMove the tile into the expanse.`;
  } else if (!canEndTurn) {
    feedback = canEndTurnReason;
  }

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
      <div id="console">
        <div id="console-left"></div>
        {gameState.overlayTopLeft != undefined || !gameState.overlay ? (
          <>{gameState.deck.length}</>
        ) : (
          <Deck
            overlay={gameState.overlay}
            dispatchGameState={dispatchGameState}
          ></Deck>
        )}
        <div id="console-right"></div>
      </div>

      <div id="feedback">{feedback}</div>
      <div id="end-turn-buttons">
        <button
          disabled={!canEndTurn}
          onClick={() => dispatchGameState({action: "endTurn"})}
          className={gameState.isBlueTurn ? "blue" : "red"}
        >
          End turn
        </button>
        {canScore ? <button
          disabled={!canEndTurn}
          onClick={() => dispatchGameState({action: "endTurn", andScore: true})}
          className={gameState.isBlueTurn ? "blue" : "red"}
        >
          {`End turn and score ${potentialScore}`}
        </button> : <></>}
        
      </div>
    </div>
  );
}
