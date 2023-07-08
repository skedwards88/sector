import React from "react";
import ControlBar from "./ControlBar";
import Overlay from "./Overlay";
import Played from "./Played";
import Deck from "./Deck";
import {canEndTurnQ} from "../logic/canEndTurnQ";
import {calculateScore} from "../logic/calculateScore"

export default function Game({
  gameState,
  dispatchGameState,
  setDisplay,
  setInstallPromptEvent,
  showInstallButton,
  installPromptEvent,
}) {
  const canEndTurn = canEndTurnQ({
    overlayTopLeft: gameState.overlayTopLeft,
    played: gameState.played,
    overlay: gameState.overlay,
    expanseSize: gameState.expanseSize,
  });

  return (
    <div id="app">
      <ControlBar
        dispatchGameState={dispatchGameState}
        setDisplay={setDisplay}
        setInstallPromptEvent={setInstallPromptEvent}
        showInstallButton={showInstallButton}
        installPromptEvent={installPromptEvent}
      ></ControlBar>
      <div>
        <div id="board">
          <Played played={gameState.played}></Played>
          <Overlay
            overlayTopLeft={gameState.overlayTopLeft}
            overlay={gameState.overlay}
            expanseSize={gameState.expanseSize}
            dispatchGameState={dispatchGameState}
          ></Overlay>
        </div>
        {gameState.overlayTopLeft != undefined ? (
          <>{gameState.deck.length}</>
        ) : (
          <Deck
            overlay={gameState.overlay}
            dispatchGameState={dispatchGameState}
          ></Deck>
        )}

        <div>feedback</div>
        <div>{"red: " + calculateScore("red", gameState.played)}</div>
        <div>{"blue: " + calculateScore("blue", gameState.played)}</div>
        <div>
          {/* todo disable end turn buttons if not valid placement */}
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
            End turn and score
          </button>
        </div>
      </div>
    </div>
  );
}
