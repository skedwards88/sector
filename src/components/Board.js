import React from "react";
import Overlay from "./Overlay";
import Played from "./Played";

export default function Board({gameState, dispatchGameState}) {
  return (
    <div id="board">
      <Played played={gameState.played}></Played>
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
