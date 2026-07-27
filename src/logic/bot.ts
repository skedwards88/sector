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

function getMaxPlacement(
  tileToPlay: Tile,
  played: Square[],
  botColor: PlayerColor,
): {
  bestScore: number;
  bestOverlay: Tile;
  bestOverlayTopLeft: number;
} {
  let currentMaxScore = 0;
  let currentMaxOverlay; // the tile to play, in the desired rotation
  let currentMaxOverlayTopLeft; // the position to play at

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

      const simulatedScore = calculateScore(botColor, simulatedPlayed);

      if (simulatedScore > currentMaxScore) {
        currentMaxScore = simulatedScore;
        currentMaxOverlay = simulatedTile;
        currentMaxOverlayTopLeft = boardIndex;
      }
      // If haven't stored a best play yet, store the first legal move so that the bot at least plays something
      else if (
        currentMaxOverlayTopLeft === undefined ||
        currentMaxOverlay === undefined
      ) {
        currentMaxOverlay = simulatedTile;
        currentMaxOverlayTopLeft = boardIndex;
      }
    }
  }

  // this should only happen if there were no legal moves
  if (
    currentMaxOverlayTopLeft === undefined ||
    currentMaxOverlay === undefined
  ) {
    throw new Error("Did not find a legal move");
  }

  return {
    bestScore: currentMaxScore,
    bestOverlay: currentMaxOverlay,
    bestOverlayTopLeft: currentMaxOverlayTopLeft,
  };
}

function getLikelyMaxPlacement(
  tileToPlay: Tile,
  played: Square[],
  scores: Scores,
  botColor: PlayerColor,
  opponentColor: PlayerColor,
  numTileRemaining: number,
): {
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

  const tileRotations = getRotations(tileToPlay);
  const nextTileRotations = getRotations([
    {color: "black", shape: null},
    {color: "red", shape: null},
    {color: "blue", shape: null},
    {color: "black", shape: null},
  ]);

  for (
    let currentTileBoardIndex = 0;
    currentTileBoardIndex < maxOverlayIndex;
    currentTileBoardIndex++
  ) {
    currentTileRotationLoop: for (
      let currentTileRotationNumber = 0;
      currentTileRotationNumber < 4;
      currentTileRotationNumber++
    ) {
      const simulatedTile = tileRotations[currentTileRotationNumber];

      const [placementIsLegal, illegalPlacementInfo] = canEndTurnQ({
        overlay: simulatedTile,
        overlayTopLeft: currentTileBoardIndex,
        played: played,
      });

      if (
        illegalPlacementInfo ===
        "the tile must make contact with the existing tiles"
      ) {
        // If the tile isn't touching other tiles, don't bother testing the other rotations at this board position
        break currentTileRotationLoop;
      }

      if (!placementIsLegal) {
        // If placement is not legal for some other reason, skip to the next rotation at this board position
        continue currentTileRotationLoop;
      }

      const simulatedPlayed = mergeOverlayAndPlayed({
        played: played,
        overlay: simulatedTile,
        overlayTopLeft: currentTileBoardIndex,
      });

      const simulatedScore = calculateScore(botColor, simulatedPlayed); // z

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
          currentBestOverlayTopLeft = currentTileBoardIndex;
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
          currentBestOverlayTopLeft = currentTileBoardIndex;
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
          currentBestOverlayTopLeft = currentTileBoardIndex;

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

      // If haven't stored a best play yet, store the first legal move so that the bot at least plays something
      if (
        currentBestOverlayTopLeft === undefined ||
        currentBestOverlay === undefined
      ) {
        currentBestOverlay = simulatedTile;
        currentBestOverlayTopLeft = currentTileBoardIndex;
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
  const botColor = "red";
  const opponentColor = "blue";

  const opponentScore = currentGameState.scores[opponentColor];
  const botScore = currentGameState.scores[botColor];

  const numTileRemaining = currentGameState.deck.length;

  const isBotLastTurn = numTileRemaining <= 2;
  const opponentHasScored = opponentScore != undefined;
  const botHasScored = botScore != undefined;
  const neitherPlayerHasScored = !opponentHasScored && !botHasScored;

  if ((isBotLastTurn && neitherPlayerHasScored) || opponentHasScored) {
    const {bestScore, bestOverlay, bestOverlayTopLeft} = getMaxPlacement(
      currentGameState.overlay,
      currentGameState.played,
      botColor,
    );

    // If this is the bot's last turn
    // OR
    // if opponent has scored AND bot can score higher
    // place for highest current score, then score
    if (isBotLastTurn || (opponentHasScored && bestScore > opponentScore)) {
      return {
        botOverlay: bestOverlay,
        botOverlayTopLeft: bestOverlayTopLeft,
        andScore: true,
      };
    }
  }

  // Otherwise, try to predict the best placement
  const {bestOverlay, bestOverlayTopLeft, andScore} = getLikelyMaxPlacement(
    currentGameState.overlay,
    currentGameState.played,
    currentGameState.scores,
    botColor,
    opponentColor,
    numTileRemaining,
  );

  return {
    botOverlay: bestOverlay,
    botOverlayTopLeft: bestOverlayTopLeft,
    andScore,
  };
}
