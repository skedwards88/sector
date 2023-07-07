import React from "react";
import ControlBar from "./ControlBar";
import Overlay from "./Overlay";
import Played from "./Played";
import Deck from "./Deck";

export default function Game({
  gameState,
  dispatchGameState,
  setDisplay,
  setInstallPromptEvent,
  showInstallButton,
  installPromptEvent,
}) {
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
            overlay={gameState.deck[0]}
            expanseSize={gameState.expanseSize}
            dispatchGameState={dispatchGameState}
          ></Overlay>
        </div>
        {gameState.overlayTopLeft ? <>{gameState.deck.length - 1}</> : <Deck
            overlay={gameState.deck[0]}
            dispatchGameState={dispatchGameState}
          ></Deck>}
        
        <div>feedback</div>
        <div>
          {/* todo disable end turn buttons if not valid placement */}
          <button onClick={() => dispatchGameState({action: "endTurn"})}>End turn</button>
          <button onClick={() => console.log("todo")}>End turn and score</button>
        </div>
      </div>
    </div>
  );
}
