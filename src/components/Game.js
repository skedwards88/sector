import React from "react";
import ControlBar from "./ControlBar";
import Overlay from "./Overlay";
import Played from "./Played";
import Deck from "./Deck";
import {canEndTurnQ} from "../logic/canEndTurnQ";
import {calculateScore} from "../logic/calculateScore";

export default function Game({
  gameState,
  dispatchGameState,
  setDisplay,
  setInstallPromptEvent,
  showInstallButton,
  installPromptEvent,
}) {
  const [canEndTurn, canEndTurnReason] = canEndTurnQ({
    overlayTopLeft: gameState.overlayTopLeft,
    played: gameState.played,
    overlay: gameState.overlay,
    expanseSize: gameState.expanseSize,
  });

  const currentColor = gameState.isBlueTurn ? "blue" : "red";

  let feedback = "";
  if (gameState.overlayTopLeft === undefined) {
    feedback = `${currentColor.toUpperCase()}'s turn.\n\nMove the tile into the expanse.`
  } else if (!canEndTurn) {
    feedback = canEndTurnReason
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
            expanseSize={gameState.expanseSize}
            dispatchGameState={dispatchGameState}
          ></Overlay>
        </div>
        <div id="console">
          <div id="console-left"></div>
        {gameState.overlayTopLeft != undefined ? (
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
          <button
            disabled={!canEndTurn}
            onClick={() => console.log("todo")}
            className={gameState.isBlueTurn ? "blue" : "red"}
          >
            {`End turn and score ${calculateScore(currentColor, gameState.played)}`}
          </button>
        </div>
    </div>
  );
}
