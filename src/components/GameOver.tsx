import ControlBar from "./ControlBar";
import Board from "./Board";
import {type ReducerPayload} from "../logic/gameReducer";
import type {DisplayState, GameState} from "../Types";
import {type BeforeInstallPromptEvent} from "@skedwards88/shared-components/src/logic/handleInstall";

export default function GameOver({
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
  installPromptEvent: BeforeInstallPromptEvent | null;
}): React.JSX.Element {
  const redScore = gameState.scores.red ?? 0;
  const blueScore = gameState.scores.blue ?? 0;

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
