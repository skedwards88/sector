import ControlBar from "./ControlBar";
import Board from "./Board";
import {type ReducerPayload} from "../logic/gameReducer";
import type {DisplayState, GameState, PlayerColor} from "../Types";

export default function GameOver({
  gameState,
  dispatchGameState,
  setDisplay,
  botPlayedTopLeft,
}: {
  gameState: GameState;
  dispatchGameState: React.Dispatch<ReducerPayload>;
  setDisplay: React.Dispatch<React.SetStateAction<DisplayState>>;
  botPlayedTopLeft: number | null;
}): React.JSX.Element {
  const redScore = gameState.scores.red ?? 0;
  const blueScore = gameState.scores.blue ?? 0;

  let winner: PlayerColor | undefined;
  let gameOverText: string;
  if (redScore != blueScore) {
    // not a tie
    winner = redScore > blueScore ? "red" : "blue";
    gameOverText = `${winner.toUpperCase()} wins!\n\n${Math.max(
      redScore,
      blueScore,
    )} vs ${Math.min(redScore, blueScore)}`;
  } else {
    // ties go to the player who scored first
    // if no player scored before end of game, then the tie is a legit tie
    winner = gameState.firstScorer;
    if (winner != undefined) {
      gameOverText = `${winner.toUpperCase()} wins!\n\n${Math.max(
        redScore,
        blueScore,
      )} vs ${Math.min(redScore, blueScore)}\n\n(${winner} scored first)`;
    } else {
      gameOverText = `Tie!\n\n${Math.max(redScore, blueScore)} vs ${Math.min(
        redScore,
        blueScore,
      )}`;
    }
  }

  return (
    <div className="app" id="gameOver">
      <ControlBar setDisplay={setDisplay}></ControlBar>

      <div id="gameOverResult" className={winner}>
        {gameOverText}
      </div>

      <Board
        dispatchGameState={dispatchGameState}
        gameState={gameState}
        botPlayedTopLeft={botPlayedTopLeft}
      ></Board>

      <div id="playerScreen">
        <div id="playerControls" className={winner}>
          <button
            id="gameOverNewGame"
            onClick={() => {
              setDisplay("home");
            }}
          >
            new game
          </button>
        </div>
        <div id="sheen"></div>
      </div>
    </div>
  );
}
