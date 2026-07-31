import React from "react";
import ControlBar from "./ControlBar";
import PlayerControls from "./PlayerControls";
import GameOver from "./GameOver";
import GameText from "./GameText";
import {canEndTurnQ} from "../logic/canEndTurnQ";
import {calculateScore} from "../logic/calculateScore";
import {mergeOverlayAndPlayed} from "../logic/mergeOverlayAndPlayed";
import Board from "./Board";

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

  if (gameOver) {
    return (
      <GameOver
        dispatchGameState={dispatchGameState}
        gameState={gameState}
        setDisplay={setDisplay}
        setInstallPromptEvent={setInstallPromptEvent}
        showInstallButton={showInstallButton}
        installPromptEvent={installPromptEvent}
      ></GameOver>
    );
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

  const [placementIsLegal, illegalPlacementInfo] = canEndTurnQ({
    overlayTopLeft: gameState.overlayTopLeft,
    played: gameState.played,
    overlay: gameState.overlay,
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

      <GameText
        overlayTopLeft={gameState.overlayTopLeft}
        placementIsLegal={placementIsLegal}
        illegalPlacementInfo={illegalPlacementInfo}
        playerScore={playerScore}
        opponentScore={opponentScore}
      ></GameText>

      <Board
        dispatchGameState={dispatchGameState}
        gameState={gameState}
      ></Board>

      <PlayerControls
        overlayTopLeft={gameState.overlayTopLeft}
        dispatchGameState={dispatchGameState}
        overlay={gameState.overlay}
        deck={gameState.deck}
        placementIsLegal={placementIsLegal}
        currentColor={currentColor}
        playerScore={playerScore}
        opponentScore={opponentScore}
        potentialScore={potentialScore}
      ></PlayerControls>
    </div>
  );
}
