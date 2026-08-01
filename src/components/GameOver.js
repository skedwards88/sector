import React from "react";
import ControlBar from "./ControlBar";
import Board from "./Board";

export default function GameOver({
  gameState,
  dispatchGameState,
  setDisplay,
  setInstallPromptEvent,
  showInstallButton,
  installPromptEvent,
}) {
  const redScore = gameState.scores.red;
  const blueScore = gameState.scores.blue;

  const isTie = gameState.isTie;
  const winner = redScore > blueScore ? "red" : "blue";

  return (
    <div className="app" id="gameOver">
      <ControlBar
        setDisplay={setDisplay}
        setInstallPromptEvent={setInstallPromptEvent}
        showInstallButton={showInstallButton}
        installPromptEvent={installPromptEvent}
      ></ControlBar>

      <div id="gameOverResult" className={winner}>
        <div>{isTie ? "Tie!" : `${winner.toUpperCase()} wins!`}</div>
        <div>
          {`${Math.max(redScore, blueScore)} vs ${Math.min(
            redScore,
            blueScore,
          )}`}
        </div>
      </div>

      <Board
        dispatchGameState={dispatchGameState}
        gameState={gameState}
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
