import ControlBar from "./ControlBar";
import PlayerControls from "./PlayerControls";
import GameOver from "./GameOver";
import GameText from "./GameText";
import {getEndTurnInvalidReason} from "../logic/getEndTurnInvalidReason";
import {calculateScore} from "../logic/calculateScore";
import {mergeOverlayAndPlayed} from "../logic/mergeOverlayAndPlayed";
import Board from "./Board";
import type {DisplayState, GameState} from "../Types";
import {type ReducerPayload} from "../logic/gameReducer";
import {type BeforeInstallPromptEvent} from "@skedwards88/shared-components/src/logic/handleInstall";

export default function Game({
  gameState,
  dispatchGameState,
  setDisplay,
  setInstallPromptEvent,
  showInstallButton,
  installPromptEvent,
}: {
  gameState: GameState;
  dispatchGameState: React.Dispatch<ReducerPayload>;
  setDisplay: React.Dispatch<React.SetStateAction<DisplayState>>;
  setInstallPromptEvent: React.Dispatch<
    React.SetStateAction<BeforeInstallPromptEvent | null>
  >;
  showInstallButton: boolean;
  installPromptEvent: BeforeInstallPromptEvent;
}): React.JSX.Element {
  const currentColor = gameState.isBlueTurn ? "blue" : "red";
  const opponentColor = gameState.isBlueTurn ? "red" : "blue";
  const playerScore = gameState.scores[currentColor];
  const opponentScore = gameState.scores[opponentColor];
  const gameOver = playerScore != undefined && opponentScore != undefined;

  if (gameOver || gameState.overlay === undefined) {
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

  const turnInvalidReason = getEndTurnInvalidReason({
    overlayTopLeft: gameState.overlayTopLeft,
    played: gameState.played,
    overlay: gameState.overlay,
  });

  return (
    <div className="app" id="game">
      <ControlBar
        setDisplay={setDisplay}
        setInstallPromptEvent={setInstallPromptEvent}
        showInstallButton={showInstallButton}
        installPromptEvent={installPromptEvent}
      ></ControlBar>

      <GameText
        overlayTopLeft={gameState.overlayTopLeft}
        turnInvalidReason={turnInvalidReason}
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
        placementIsLegal={turnInvalidReason === null}
        currentColor={currentColor}
        playerScore={playerScore}
        opponentScore={opponentScore}
        potentialScore={potentialScore}
      ></PlayerControls>
    </div>
  );
}
