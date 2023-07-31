import React from "react";
import ControlBar from "./ControlBar";
import Overlay from "./Overlay";
import Played from "./Played";
import PlayerControls from "./PlayerControls";
import GameOver from "./GameOver";

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
  const playerScore = gameState.scores[currentColor];
  const opponentScore = gameState.scores[opponentColor];
  const gameOver = playerScore != undefined && opponentScore != undefined;

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

      {gameOver ? (
        <GameOver
          scores={gameState.scores}
          isTie={gameState.isTie}
          dispatchGameState={dispatchGameState}
        ></GameOver>
      ) : (
        <PlayerControls
          isBlueTurn={gameState.isBlueTurn}
          scores={gameState.scores}
          overlayTopLeft={gameState.overlayTopLeft}
          dispatchGameState={dispatchGameState}
          played={gameState.played}
          overlay={gameState.overlay}
          deck={gameState.deck}
        ></PlayerControls>
      )}
    </div>
  );
}
