import React from "react";
import Deck from "./Deck";

function EndTurnButton({
  placementIsLegal,
  opponentScore,
  potentialScore,
  dispatchGameState,
  overlay,
  overlayTopLeft,
}) {
  // Disable if the placement is invalid (obviously)
  // and if the current score is more than the opponent score (because you should end+score instead)
  const isDisabled =
    !placementIsLegal ||
    (opponentScore != undefined && potentialScore > opponentScore);

  return (
    <button
      id="endTurn"
      disabled={isDisabled}
      onClick={() =>
        dispatchGameState({action: "endTurn", overlay, overlayTopLeft})
      }
    >
      end turn
    </button>
  );
}

function EndTurnAndScoreButton({
  placementIsLegal,
  opponentScore,
  playerScore,
  potentialScore,
  dispatchGameState,
  overlay,
  overlayTopLeft,
}) {
  // Don't show the button if the player has already scored
  if (playerScore != undefined) {
    return <></>;
  }

  // Disable if the placement is invalid (obviously)
  // and if the current score is less than or equal to the opponent score
  // (because scoring would automatically lose)
  const isDisabled =
    !placementIsLegal ||
    (opponentScore != undefined && potentialScore <= opponentScore);

  return (
    <button
      id="endAndScore"
      disabled={isDisabled}
      onClick={() =>
        dispatchGameState({
          action: "endTurn",
          overlay,
          overlayTopLeft,
          andScore: true,
        })
      }
    >
      {`end turn; score ${potentialScore}`}
    </button>
  );
}

export default function PlayerControls({
  overlayTopLeft,
  dispatchGameState,
  overlay,
  deck,
  placementIsLegal,
  currentColor,
  playerScore,
  opponentScore,
  potentialScore,
}) {
  return (
    <div id="playerScreen">
      <div id="playerControls" className={currentColor}>
        {!overlay ? (
          <></>
        ) : (
          <Deck
            overlay={overlay}
            overlayTopLeft={overlayTopLeft}
            dispatchGameState={dispatchGameState}
            deck={deck}
          ></Deck>
        )}
        <EndTurnButton
          placementIsLegal={placementIsLegal}
          opponentScore={opponentScore}
          potentialScore={potentialScore}
          dispatchGameState={dispatchGameState}
          overlay={overlay}
          overlayTopLeft={overlayTopLeft}
        ></EndTurnButton>
        <EndTurnAndScoreButton
          placementIsLegal={placementIsLegal}
          opponentScore={opponentScore}
          playerScore={playerScore}
          potentialScore={potentialScore}
          dispatchGameState={dispatchGameState}
          overlay={overlay}
          overlayTopLeft={overlayTopLeft}
        ></EndTurnAndScoreButton>
      </div>

      <div id="sheen"></div>
    </div>
  );
}
