import type {GameState, PlayerColor, Square, Tile} from "../Types";
import {calculateScore} from "./calculateScore";
import {getEndTurnInvalidReason} from "./getEndTurnInvalidReason";
import {mergeOverlayAndPlayed} from "./mergeOverlayAndPlayed";
import {rotateTile} from "./rotateTile";

type Placement = {
  botScore: number;
  opponentScore: number;
  overlay: Tile;
  overlayTopLeft: number;
};

const Scenario = {
  OpponentScored: "opponentScored",
  BotScored: "botScored",
  NeitherScored: "neitherScored",
} as const;

type Scenario = (typeof Scenario)[keyof typeof Scenario];

export type BotParameters = {
  numBotTopScores: number; // x1
  numBotLowScores: number; // x2
  numOpponentTopScores: number; // x3
  numOpponentLowScores: number; // x4
  weightW: number;
  weightY: number;
  numTilesRemainingWeight: number;
  maxPlacementsToFind: number;
};

export function isOnBoard(
  boardIndex: number,
  tileDiameter: number,
  boardDiameter: number,
): boolean {
  // If the tile would go off the bottom of the board, return false
  const row = Math.floor(boardIndex / boardDiameter);

  if (row + tileDiameter > boardDiameter) {
    return false;
  }

  // If the tile would go off the right side of the board, return false
  const column = boardIndex - row * boardDiameter;

  if (column + tileDiameter > boardDiameter) {
    return false;
  }

  return true;
}

function dropInfinitiesAndSumArray(array: number[]): number {
  const noInfinities = array.filter((i) => i != Infinity && i != -Infinity);
  return noInfinities.reduce(
    (currentSum, currentValue) => currentSum + currentValue,
    0,
  );
}

function getRotations(tile: Tile): [Tile, Tile, Tile, Tile] {
  const r0 = structuredClone(tile);
  const r1 = rotateTile(r0);
  const r2 = rotateTile(r1);
  const r3 = rotateTile(r2);
  return [r0, r1, r2, r3];
}

function getPlacementValue(scenario: Scenario, placement: Placement): number {
  switch (scenario) {
    case Scenario.OpponentScored:
      // Care about higher bot score
      return placement.botScore;
    case Scenario.BotScored:
      // Care about lower opponent score (hence the negative)
      return -placement.opponentScore;
    case Scenario.NeitherScored:
      // Care about higher bot-opponent score diff
      return placement.botScore - placement.opponentScore;
  }
}

function sortPlacements(scenario: Scenario, placements: Placement[]): void {
  placements.sort(
    (placementA, placementB) =>
      getPlacementValue(scenario, placementA) -
      getPlacementValue(scenario, placementB),
  );
}

// Returns a list of the top N (maxPlacementsToFind) placements, ordered worst to best:
//   If opponent has scored, the returned placements have the lowest opponent scores
//   If bot has scored, the returned placements have the highest bot scores
//   If neither has scored, the returned placements have the highest bot minus opponent score
function findBestPlacements({
  tileToPlay,
  played,
  botColor,
  opponentColor,
  maxPlacementsToFind,
  scenario,
}: {
  tileToPlay: Tile;
  played: Square[];
  botColor: PlayerColor;
  opponentColor: PlayerColor;
  maxPlacementsToFind: number;
  scenario: Scenario;
}): Placement[] {
  const bestPlacements: Placement[] = [];

  const rotatedTiles = getRotations(tileToPlay);

  // Tile and board are both square
  const tileDiameter = Math.sqrt(tileToPlay.length);
  const boardDiameter = Math.sqrt(played.length);

  // for each position on the board, for each rotation at that board position
  boardLoop: for (
    let boardIndex = 0;
    boardIndex < played.length;
    boardIndex++
  ) {
    if (!isOnBoard(boardIndex, tileDiameter, boardDiameter)) {
      continue boardLoop;
    }

    rotationLoop: for (
      let rotationNumber = 0;
      rotationNumber < 4;
      rotationNumber++
    ) {
      const simulatedTile = rotatedTiles[rotationNumber];

      const turnInvalidReason = getEndTurnInvalidReason({
        overlay: simulatedTile,
        overlayTopLeft: boardIndex,
        played: played,
      });

      if (
        turnInvalidReason ===
        "the tile must make contact with the existing tiles"
      ) {
        // If the tile isn't touching other tiles, don't bother testing the other rotations at this board position
        break rotationLoop;
      }

      if (turnInvalidReason != null) {
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

      const currentPlacement = {
        botScore: simulatedBotScore,
        opponentScore: simulatedOpponentScore,
        overlay: simulatedTile,
        overlayTopLeft: boardIndex,
      };

      // If we haven't found all of the placements yet, just append to the list
      if (bestPlacements.length < maxPlacementsToFind) {
        bestPlacements.push(currentPlacement);

        // Sort worst to best if now at the max list length (so that we can just look at the first item for future updates)
        if (bestPlacements.length === maxPlacementsToFind) {
          sortPlacements(scenario, bestPlacements);
        }
      }
      // otherwise only add the placement if it is better than one of the found placements
      // then sort so worst is first (so that we can just look at the first item for future updates)
      else if (
        getPlacementValue(scenario, currentPlacement) >
        getPlacementValue(scenario, bestPlacements[0])
      ) {
        bestPlacements[0] = currentPlacement;
        sortPlacements(scenario, bestPlacements);
      }
    }
  }

  // need to sort before returning in case we found less than maxPlacementsToFind and therefore never sorted the list
  sortPlacements(scenario, bestPlacements);

  return bestPlacements;
}

function findBestPlacementsWithSecondary({
  played,
  botColor,
  opponentColor,
  numTileRemaining,
  primaryPlacements,
  scenario,
  botParameters,
}: {
  played: Square[];
  botColor: PlayerColor;
  opponentColor: PlayerColor;
  numTileRemaining: number;
  primaryPlacements: Placement[];
  scenario: Scenario;
  botParameters: BotParameters;
}): {
  bestOverlay: Tile;
  bestOverlayTopLeft: number;
  andScore: boolean;
} {
  const {
    numBotTopScores,
    numBotLowScores,
    numOpponentTopScores,
    numOpponentLowScores,
    weightW,
    weightY,
    numTilesRemainingWeight,
  } = botParameters;

  let currentBestScore;
  let currentBestOverlay; // the tile to play, in the desired rotation
  let currentBestOverlayTopLeft; // the position to play at
  let andScore = false;

  const nextTileA: Tile = [
    {color: "black", shape: null},
    {color: "red", shape: null},
    {color: "blue", shape: null},
    {color: "black", shape: null},
  ];
  const nextTileB: Tile = [
    {color: "red", shape: null},
    {color: "red", shape: null},
    {color: "blue", shape: null},
    {color: "blue", shape: null},
  ];

  const nextTileRotationsA = getRotations(nextTileA);
  const nextTileRotationsB = getRotations(nextTileB);

  // Tile and board are both square
  const tileDiameter = Math.sqrt(nextTileA.length);
  const boardDiameter = Math.sqrt(played.length);

  for (const placement of primaryPlacements) {
    const simulatedTile = placement.overlay;
    const simulatedOverlay = placement.overlayTopLeft;

    const simulatedPlayed = mergeOverlayAndPlayed({
      played: played,
      overlay: simulatedTile,
      overlayTopLeft: placement.overlayTopLeft,
    });

    const simulatedScore = placement.botScore; // z

    const topBotNextScores = Array.from(
      {length: numBotTopScores},
      () => -Infinity,
    );
    const lowBotNextScores = Array.from(
      {length: numBotLowScores},
      () => Infinity,
    );
    const topOpponentNextScores = Array.from(
      {length: numOpponentTopScores},
      () => -Infinity,
    );
    const lowOpponentNextScores = Array.from(
      {length: numOpponentLowScores},
      () => Infinity,
    );

    boardLoop: for (
      let nextTileBoardIndex = 0;
      nextTileBoardIndex < played.length;
      nextTileBoardIndex++
    ) {
      if (!isOnBoard(nextTileBoardIndex, tileDiameter, boardDiameter)) {
        continue boardLoop;
      }
      nextTileRotationLoop: for (
        let nextTileRotationNumber = 0;
        nextTileRotationNumber < 4;
        nextTileRotationNumber++
      ) {
        nextTileLoop: for (const nextTileRotations of [
          nextTileRotationsA,
          nextTileRotationsB,
        ]) {
          const simulatedNextTile = nextTileRotations[nextTileRotationNumber];

          const turnInvalidReason = getEndTurnInvalidReason({
            overlay: simulatedNextTile,
            overlayTopLeft: nextTileBoardIndex,
            played: simulatedPlayed,
          });

          if (
            turnInvalidReason ===
            "the tile must make contact with the existing tiles"
          ) {
            // If the tile isn't touching other tiles, don't bother testing the other rotations at this board position
            break nextTileRotationLoop;
          }

          if (turnInvalidReason != null) {
            // If placement is not legal for some other reason, skip to the next rotation at this board position
            continue nextTileLoop;
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

          if (simulatedNextBotScore > topBotNextScores[0]) {
            // replace the lowest score
            topBotNextScores[0] = simulatedNextBotScore;

            // sort so the list stays low -> high
            topBotNextScores.sort((a, b) => a - b);
          }

          if (simulatedNextBotScore < lowBotNextScores[0]) {
            // replace the highest score
            lowBotNextScores[0] = simulatedNextBotScore;

            // sort so the list stays high -> low
            lowBotNextScores.sort((a, b) => b - a);
          }

          if (simulatedNextOpponentScore > topOpponentNextScores[0]) {
            // replace the lowest score
            topOpponentNextScores[0] = simulatedNextOpponentScore;

            // sort so the list stays low -> high
            topOpponentNextScores.sort((a, b) => a - b);
          }

          if (simulatedNextOpponentScore < lowOpponentNextScores[0]) {
            // replace the highest score
            lowOpponentNextScores[0] = simulatedNextOpponentScore;

            // sort so the list stays high -> low
            lowOpponentNextScores.sort((a, b) => b - a);
          }
        }
      }
    }

    let conglomerateScore;
    switch (scenario) {
      case Scenario.OpponentScored:
        // Care about higher bot score
        conglomerateScore =
          weightY * simulatedScore +
          dropInfinitiesAndSumArray(topBotNextScores) +
          dropInfinitiesAndSumArray(lowBotNextScores);
        break;
      case Scenario.BotScored:
        // Care about lower opponent score (hence the negative)
        conglomerateScore = -(
          dropInfinitiesAndSumArray(topOpponentNextScores) +
          dropInfinitiesAndSumArray(lowOpponentNextScores)
        );
        break;
      case Scenario.NeitherScored:
        // Care about higher bot-opponent score diff
        conglomerateScore =
          weightY * simulatedScore +
          dropInfinitiesAndSumArray(topBotNextScores) +
          dropInfinitiesAndSumArray(lowBotNextScores) -
          dropInfinitiesAndSumArray(topOpponentNextScores) -
          dropInfinitiesAndSumArray(lowOpponentNextScores);
    }

    if (conglomerateScore > (currentBestScore ?? -Infinity)) {
      currentBestScore = conglomerateScore;
      currentBestOverlay = simulatedTile;
      currentBestOverlayTopLeft = simulatedOverlay;

      if (scenario === Scenario.NeitherScored) {
        andScore =
          weightW * simulatedScore >
          dropInfinitiesAndSumArray(topOpponentNextScores) +
            numTilesRemainingWeight +
            numTileRemaining;
        // + dropInfinitiesAndSumArray(lowOpponentNextScores)
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

export function playBot(
  currentGameState: GameState,
  botColor: PlayerColor,
  botParameters: BotParameters = {
    numBotTopScores: 1,
    numBotLowScores: 2,
    numOpponentTopScores: 8,
    numOpponentLowScores: 6,
    weightW: 8.75,
    weightY: 4,
    numTilesRemainingWeight: 9,
    maxPlacementsToFind: 12,
  },
): {
  botOverlay: Tile;
  botOverlayTopLeft: number;
  andScore: boolean;
} {
  if (currentGameState.overlay === undefined) {
    throw new Error("No tiles remaining to play");
  }

  const opponentColor: PlayerColor = botColor === "red" ? "blue" : "red";

  const numTileRemaining = currentGameState.deck.length;

  const isBotLastTurn = numTileRemaining <= 1;

  const opponentScore = currentGameState.scores[opponentColor];
  const botScore = currentGameState.scores[botColor];

  let scenario;
  if (opponentScore != undefined) {
    scenario = Scenario.OpponentScored;
  } else if (botScore != undefined) {
    scenario = Scenario.BotScored;
  } else {
    scenario = Scenario.NeitherScored;
  }

  const bestPlacements = findBestPlacements({
    tileToPlay: currentGameState.overlay,
    played: currentGameState.played,
    botColor,
    opponentColor,
    maxPlacementsToFind: botParameters.maxPlacementsToFind,
    scenario,
  });
  const bestPlacement = bestPlacements[bestPlacements.length - 1];

  // If opponent has scored and bot can score higher,
  // place for highest current score, then score
  if (
    scenario === Scenario.OpponentScored &&
    opponentScore != undefined && // TS is too dumb to remember that this is only true if scenario === Scenario.OpponentScored, so check again
    bestPlacement.botScore > opponentScore
  ) {
    return {
      botOverlay: bestPlacement.overlay,
      botOverlayTopLeft: bestPlacement.overlayTopLeft,
      andScore: true,
    };
  }

  // If neither player has scored and this is the bot's last turn,
  // place for highest score difference, then score
  if (scenario === Scenario.NeitherScored && isBotLastTurn) {
    return {
      botOverlay: bestPlacement.overlay,
      botOverlayTopLeft: bestPlacement.overlayTopLeft,
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
      numTileRemaining,
      primaryPlacements: bestPlacements,
      scenario,
      botParameters,
    });

  return {
    botOverlay: bestOverlay,
    botOverlayTopLeft: bestOverlayTopLeft,
    andScore,
  };
}
