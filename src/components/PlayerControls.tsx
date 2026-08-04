import {type ReducerPayload} from "../logic/gameReducer";
import type {PlayerColor, Tile} from "../Types";
import Deck from "./Deck";

function EndTurnButton({
  placementIsLegal,
  opponentScore,
  potentialScore,
  dispatchGameState,
  overlay,
  overlayTopLeft,
}: {
  placementIsLegal: boolean;
  opponentScore: number | undefined;
  potentialScore: number;
  dispatchGameState: React.Dispatch<ReducerPayload>;
  overlay: Tile;
  overlayTopLeft: number | undefined;
}): React.JSX.Element {
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
        dispatchGameState({
          action: "endTurn",
          overlay,
          overlayTopLeft: overlayTopLeft!, // The button is disabled if overlayTopLeft is undefined
          andScore: false,
        })
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
}: {
  placementIsLegal: boolean;
  opponentScore: number | undefined;
  playerScore: number | undefined;
  potentialScore: number;
  dispatchGameState: React.Dispatch<ReducerPayload>;
  overlay: Tile;
  overlayTopLeft: number | undefined;
}): React.JSX.Element {
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
          overlayTopLeft: overlayTopLeft!, // The button is disabled if overlayTopLeft is undefined
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
  opponentColor,
  playerScore,
  opponentScore,
  potentialScore,
  botIsThinking,
  botPlayedTopLeft,
}: {
  overlayTopLeft: number | undefined;
  dispatchGameState: React.Dispatch<ReducerPayload>;
  overlay: Tile;
  deck: Tile[];
  placementIsLegal: boolean;
  currentColor: PlayerColor;
  opponentColor: PlayerColor;
  playerScore: number | undefined;
  opponentScore: number | undefined;
  potentialScore: number;
  botIsThinking: boolean;
  botPlayedTopLeft: number | null;
}): React.JSX.Element {
  return (
    <div id="playerScreen">
      <div
        id="playerControls"
        className={botPlayedTopLeft != undefined ? opponentColor : currentColor}
      >
        <Deck
          overlay={overlay}
          overlayTopLeft={overlayTopLeft}
          dispatchGameState={dispatchGameState}
          deck={deck}
          botIsThinking={botIsThinking}
          botPlayedTopLeft={botPlayedTopLeft}
        ></Deck>
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
