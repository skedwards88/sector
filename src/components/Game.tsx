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

export default function Game({
  gameState,
  dispatchGameState,
  setDisplay,
  botIsThinking,
  botPlayedTopLeft,
  needToAnnounceScoring,
  setNeedToAnnounceScoring,
}: {
  gameState: GameState;
  dispatchGameState: React.Dispatch<ReducerPayload>;
  setDisplay: React.Dispatch<React.SetStateAction<DisplayState>>;
  botIsThinking: boolean;
  botPlayedTopLeft: number | null;
  needToAnnounceScoring: boolean;
  setNeedToAnnounceScoring: React.Dispatch<React.SetStateAction<boolean>>;
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
        botPlayedTopLeft={botPlayedTopLeft}
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
      <ControlBar setDisplay={setDisplay}></ControlBar>

      <GameText
        overlayTopLeft={gameState.overlayTopLeft}
        turnInvalidReason={turnInvalidReason}
        playerScore={playerScore}
        opponentScore={opponentScore}
      ></GameText>

      <Board
        dispatchGameState={dispatchGameState}
        gameState={gameState}
        botPlayedTopLeft={botPlayedTopLeft}
      ></Board>

      <PlayerControls
        overlayTopLeft={gameState.overlayTopLeft}
        dispatchGameState={dispatchGameState}
        overlay={gameState.overlay}
        deck={gameState.deck}
        placementIsLegal={turnInvalidReason === null}
        currentColor={currentColor}
        opponentColor={opponentColor}
        playerScore={playerScore}
        opponentScore={opponentScore}
        potentialScore={potentialScore}
        botIsThinking={botIsThinking}
        botPlayedTopLeft={botPlayedTopLeft}
        setNeedToAnnounceScoring={setNeedToAnnounceScoring}
        needToAnnounceScoring={needToAnnounceScoring}
      ></PlayerControls>
    </div>
  );
}
