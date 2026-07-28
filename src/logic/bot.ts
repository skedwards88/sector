import type {GameState, PlayerColor, Scores, Square, Tile} from "../Types";
import {calculateScore} from "./calculateScore";
import {canEndTurnQ} from "./canEndTurnQ";
import {mergeOverlayAndPlayed} from "./mergeOverlayAndPlayed";
import {rotateTile} from "./rotateTile";
import {sumArray} from "./sumArray";

function updateTrackedScores(
  newScore: number,
  scores: number[],
  comparator: (oldScore: number, newScore: number) => boolean,
): number[] {
  const indexToUpdate = scores.findIndex((score) =>
    comparator(score, newScore),
  );

  if (indexToUpdate < 0) {
    return scores;
  }

  const newScores = [...scores];
  newScores[indexToUpdate] = newScore;
  return newScores;
}

function getRotations(tile: Tile): [Tile, Tile, Tile, Tile] {
  const r0 = structuredClone(tile);
  const r1 = rotateTile(r0);
  const r2 = rotateTile(r1);
  const r3 = rotateTile(r2);
  return [r0, r1, r2, r3];
}

function getMaxOverlayIndex(played: Square[]): number {
  const overlayDiameter = 2;
  const expanseDiameter = Math.sqrt(played.length);

  return (
    played.length -
    (overlayDiameter / 2) * expanseDiameter -
    overlayDiameter / 2
  );
}

type Placement = {
  botScore: number;
  opponentScore: number;
  overlay: Tile;
  overlayTopLeft: number;
};

function scoreDiff(placement: Placement): number {
  if (placement.botScore === undefined || placement.opponentScore === undefined)
    return -Infinity;
  return placement.botScore - placement.opponentScore;
}

// Returns a list with 2 items:
// 1: The placement with the highest bot score (not considering opponent score)
// 2: A list of the placements (up to numPlacementsToFind) with the highest bot minus opponent score, ordered high to low
function findBestPlacements({
  tileToPlay,
  played,
  botColor,
  opponentColor,
  numPlacementsToFind,
}: {
  tileToPlay: Tile;
  played: Square[];
  botColor: PlayerColor;
  opponentColor: PlayerColor;
  numPlacementsToFind: number;
}): [Omit<Placement, "opponentScore">, Placement[]] {
  let currentMaxScore = -Infinity;
  let currentMaxOverlay; // the tile to play, in the desired rotation
  let currentMaxOverlayTopLeft; // the position to play at

  const currentBestPlacements: Placement[] = [];

  const rotatedTiles = getRotations(tileToPlay);

  // for each position on the board, for each rotation at that board position
  for (
    let boardIndex = 0;
    boardIndex < getMaxOverlayIndex(played);
    boardIndex++
  ) {
    rotationLoop: for (
      let rotationNumber = 0;
      rotationNumber < 4;
      rotationNumber++
    ) {
      const simulatedTile = rotatedTiles[rotationNumber];

      const [placementIsLegal, illegalPlacementInfo] = canEndTurnQ({
        overlay: simulatedTile,
        overlayTopLeft: boardIndex,
        played: played,
      });

      if (
        illegalPlacementInfo ===
        "the tile must make contact with the existing tiles"
      ) {
        // If the tile isn't touching other tiles, don't bother testing the other rotations at this board position
        break rotationLoop;
      }

      if (!placementIsLegal) {
        // If placement is not legal for some other reason, skip to the next rotation at this board position
        continue rotationLoop;
      }

      // If placement is legal, simulate the play and calculate the score
      const simulatedPlayed = mergeOverlayAndPlayed({
        played: played, // what has been played already
        overlay: simulatedTile, // current tile to play
        overlayTopLeft: boardIndex, // location of current tile to play
      });

      const simulatedBotScore = calculateScore(botColor, simulatedPlayed);
      const simulatedOpponentScore = calculateScore(
        opponentColor,
        simulatedPlayed,
      );

      if (simulatedBotScore > currentMaxScore) {
        currentMaxScore = simulatedBotScore;
        currentMaxOverlay = simulatedTile;
        currentMaxOverlayTopLeft = boardIndex;
      }

      const currentPlacement = {
        botScore: simulatedBotScore,
        opponentScore: simulatedOpponentScore,
        overlay: simulatedTile,
        overlayTopLeft: boardIndex,
      };

      // If we haven't found all of the placements yet, just append to the list
      if (currentBestPlacements.length < numPlacementsToFind) {
        currentBestPlacements.push(currentPlacement);
      }
      // otherwise only add the placement if it is larger than one of the found scores
      else if (
        scoreDiff(currentBestPlacements[0]) <
        simulatedBotScore - simulatedOpponentScore
      ) {
        // Sort so smallest bot-opponent score first
        currentBestPlacements.sort(
          (placementA, placementB) =>
            scoreDiff(placementA) - scoreDiff(placementB),
        );

        currentBestPlacements[0] = currentPlacement;
      }
    }
  }

  // Sort so largest bot-opponent score first
  currentBestPlacements.sort(
    (placementA, placementB) => scoreDiff(placementB) - scoreDiff(placementA),
  );

  // this should only happen if there were no legal moves
  if (
    currentMaxOverlayTopLeft === undefined ||
    currentMaxOverlay === undefined
  ) {
    throw new Error("Did not find a legal move");
  }

  return [
    {
      botScore: currentMaxScore,
      overlay: currentMaxOverlay,
      overlayTopLeft: currentMaxOverlayTopLeft,
    },
    currentBestPlacements,
  ];
}

function findBestPlacementsWithSecondary({
  played,
  botColor,
  opponentColor,
  numTileRemaining,
  scores,
  primaryPlacements,
}: {
  played: Square[];
  botColor: PlayerColor;
  opponentColor: PlayerColor;
  numTileRemaining: number;
  scores: Scores;
  primaryPlacements: Placement[];
}): {
  bestOverlay: Tile;
  bestOverlayTopLeft: number;
  andScore: boolean;
} {
  const numBotTopScores = 4; // x1
  const numBotLowScores = 4; // x2
  const numOpponentTopScores = 4; // x3
  const numOpponentLowScores = 4; // x4
  const varW = 3; // w todo get better var name
  const varY = 4; // y todo get better var name
  const numTilesRemainingAdjustment = 8;

  const maxOverlayIndex = getMaxOverlayIndex(played);

  const botScore = scores[botColor];
  const opponentScore = scores[opponentColor];

  let currentBestScore = 0;
  let currentBestOverlay; // the tile to play, in the desired rotation
  let currentBestOverlayTopLeft; // the position to play at
  let andScore = false;

  const nextTileRotations = getRotations([
    {color: "black", shape: null},
    {color: "red", shape: null},
    {color: "blue", shape: null},
    {color: "black", shape: null},
  ]);

  for (const placement of primaryPlacements) {
    const simulatedTile = placement.overlay;
    const simulatedOverlay = placement.overlayTopLeft;

    const simulatedPlayed = mergeOverlayAndPlayed({
      played: played,
      overlay: simulatedTile,
      overlayTopLeft: placement.overlayTopLeft,
    });

    const simulatedScore = placement.botScore; // z

    let topBotNextScores = Array.from({length: numBotTopScores}, () => 0);
    let lowBotNextScores = Array.from({length: numBotLowScores}, () => 0);
    let topOpponentNextScores = Array.from(
      {length: numOpponentTopScores},
      () => 0,
    );
    let lowOpponentNextScores = Array.from(
      {length: numOpponentLowScores},
      () => 0,
    );

    for (
      let nextTileBoardIndex = 0;
      nextTileBoardIndex < maxOverlayIndex;
      nextTileBoardIndex++
    ) {
      nextTileRotationLoop: for (
        let nextTileRotationNumber = 0;
        nextTileRotationNumber < 4;
        nextTileRotationNumber++
      ) {
        const simulatedNextTile = nextTileRotations[nextTileRotationNumber];

        const [placementIsLegal, illegalPlacementInfo] = canEndTurnQ({
          overlay: simulatedNextTile,
          overlayTopLeft: nextTileBoardIndex,
          played: simulatedPlayed,
        });

        if (
          illegalPlacementInfo ===
          "the tile must make contact with the existing tiles"
        ) {
          // If the tile isn't touching other tiles, don't bother testing the other rotations at this board position
          break nextTileRotationLoop;
        }

        if (!placementIsLegal) {
          // If placement is not legal for some other reason, skip to the next rotation at this board position
          continue nextTileRotationLoop;
        }

        const simulatedNextPlayed = mergeOverlayAndPlayed({
          played: simulatedPlayed,
          overlay: simulatedNextTile,
          overlayTopLeft: nextTileBoardIndex,
        });

        const simulatedNextBotScore = calculateScore(
          botColor,
          simulatedNextPlayed,
        );
        const simulatedNextOpponentScore = calculateScore(
          opponentColor,
          simulatedNextPlayed,
        );

        topBotNextScores = updateTrackedScores(
          simulatedNextBotScore,
          topBotNextScores,
          (oldScore, newScore) => newScore > oldScore,
        );
        lowBotNextScores = updateTrackedScores(
          simulatedNextBotScore,
          lowBotNextScores,
          (oldScore, newScore) => newScore < oldScore,
        );
        topOpponentNextScores = updateTrackedScores(
          simulatedNextOpponentScore,
          topOpponentNextScores,
          (oldScore, newScore) => newScore > oldScore,
        );
        lowOpponentNextScores = updateTrackedScores(
          simulatedNextOpponentScore,
          lowOpponentNextScores,
          (oldScore, newScore) => newScore < oldScore,
        );
      }
    }

    // If bot has already scored, optimize for lowest opponent score
    if (botScore != undefined) {
      const conglomerateScore =
        sumArray(topOpponentNextScores) + sumArray(lowOpponentNextScores);

      if (conglomerateScore < (currentBestScore || Infinity)) {
        currentBestScore = conglomerateScore;
        currentBestOverlay = simulatedTile;
        currentBestOverlayTopLeft = simulatedOverlay;
      }
    }

    // If opponent has already scored, optimize for highest bot score
    else if (opponentScore != undefined) {
      const conglomerateScore =
        varY * simulatedScore +
        sumArray(topBotNextScores) +
        sumArray(lowBotNextScores);

      if (conglomerateScore > (currentBestScore || -Infinity)) {
        currentBestScore = conglomerateScore;
        currentBestOverlay = simulatedTile;
        currentBestOverlayTopLeft = simulatedOverlay;
      }
    }

    // Otherwise, optimize for highest bot/lowest opponent score
    else {
      const conglomerateScore =
        varY * simulatedScore +
        sumArray(topBotNextScores) +
        sumArray(lowBotNextScores) -
        sumArray(topOpponentNextScores) -
        sumArray(lowOpponentNextScores);

      if (conglomerateScore > (currentBestScore || -Infinity)) {
        currentBestScore = conglomerateScore;
        currentBestOverlay = simulatedTile;
        currentBestOverlayTopLeft = simulatedOverlay;

        if (
          varW * simulatedScore >
          sumArray(topOpponentNextScores) +
            sumArray(lowOpponentNextScores) -
            numTilesRemainingAdjustment +
            numTileRemaining
        ) {
          andScore = true;
        } else {
          andScore = false;
        }
      }
    }
  }

  // this should only happen if there were no legal moves
  if (
    currentBestOverlay === undefined ||
    currentBestOverlayTopLeft === undefined
  ) {
    throw new Error("Did not find a legal move");
  }

  return {
    bestOverlay: currentBestOverlay,
    bestOverlayTopLeft: currentBestOverlayTopLeft,
    andScore,
  };
}

export function playBot(currentGameState: GameState): {
  botOverlay: Tile;
  botOverlayTopLeft: number;
  andScore: boolean;
} {
  const numPlacementsToFind = 10;

  const botColor = "red";
  const opponentColor = "blue";

  const opponentScore = currentGameState.scores[opponentColor];
  const botScore = currentGameState.scores[botColor];

  const numTileRemaining = currentGameState.deck.length;

  const isBotLastTurn = numTileRemaining <= 2;
  const opponentHasScored = opponentScore != undefined;
  const botHasScored = botScore != undefined;
  const neitherPlayerHasScored = !opponentHasScored && !botHasScored;

  const [bestBotPlacement, bestBotVsOppPlacements] = findBestPlacements({
    tileToPlay: currentGameState.overlay,
    played: currentGameState.played,
    botColor,
    opponentColor,
    numPlacementsToFind,
  });

  // If opponent has scored and bot can score higher,
  // place for highest current score, then score
  if (opponentHasScored && bestBotPlacement.botScore > opponentScore) {
    return {
      botOverlay: bestBotPlacement.overlay,
      botOverlayTopLeft: bestBotPlacement.overlayTopLeft,
      andScore: true,
    };
  }

  // If neither player has scored and this is the bot's last turn,
  // place for highest score difference, then score
  if (neitherPlayerHasScored && isBotLastTurn) {
    return {
      botOverlay: bestBotVsOppPlacements[0].overlay,
      botOverlayTopLeft: bestBotVsOppPlacements[0].overlayTopLeft,
      andScore: true,
    };
  }

  // Otherwise, try to predict the best placement by approximating the next turn
  // for the best current moves found above
  const {bestOverlay, bestOverlayTopLeft, andScore} =
    findBestPlacementsWithSecondary({
      played: currentGameState.played,
      botColor,
      opponentColor,
      scores: currentGameState.scores,
      numTileRemaining,
      primaryPlacements: bestBotVsOppPlacements,
    });

  return {
    botOverlay: bestOverlay,
    botOverlayTopLeft: bestOverlayTopLeft,
    andScore,
  };
}
