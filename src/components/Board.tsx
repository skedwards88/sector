import {type ReducerPayload} from "../logic/gameReducer";
import type {GameState} from "../Types";
import Overlay from "./Overlay";
import Played from "./Played";

export default function Board({
  gameState,
  dispatchGameState,
  botPlayedTopLeft,
}: {
  gameState: GameState;
  dispatchGameState: React.Dispatch<ReducerPayload>;
  botPlayedTopLeft: number | null;
}): React.JSX.Element {
  return (
    <div id="board">
      <Played
        played={gameState.played}
        botPlayedTopLeft={botPlayedTopLeft}
      ></Played>
      <Overlay
        overlayTopLeft={gameState.overlayTopLeft}
        overlay={gameState.overlay}
        expanseSize={Math.sqrt(gameState.played.length)}
        dispatchGameState={dispatchGameState}
      ></Overlay>
      <div id="sheen"></div>
    </div>
  );
}
