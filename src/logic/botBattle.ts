import {gameInit} from "./gameInit";
import {gameReducer} from "./gameReducer";
import {type BotParameters, playBot} from "./bot";
import type {GameState, Scores} from "../Types";

// For tweaking the bot algorithm

// Starting bot parameters
const startingBotParameters = {
  numBotTopScores: 4,
  numBotLowScores: 4,
  numOpponentTopScores: 4,
  numOpponentLowScores: 4,
  weightW: 3,
  weightY: 4,
  numTilesRemainingWeight: 10,
  maxPlacementsToFind: 25,
};

function pickRandomItemFromArray<T>(inputArray: T[]): T {
  return inputArray[Math.floor(Math.random() * inputArray.length)];
}

// Randomly modify the bot parameters
function tweakParameters(startingParameters: BotParameters): BotParameters {
  const {
    numBotTopScores,
    numBotLowScores,
    numOpponentTopScores,
    numOpponentLowScores,
    weightW,
    weightY,
    numTilesRemainingWeight,
    maxPlacementsToFind,
  } = startingParameters;

  const numScoreIncrements = [-1, 0, 0, 0, 1];
  const maxNumScoreIncrements = 8;
  const minNumScoreIncrements = 0;
  const newNumBotTopScores = Math.max(
    minNumScoreIncrements,
    Math.min(
      maxNumScoreIncrements,
      pickRandomItemFromArray(numScoreIncrements) + numBotTopScores,
    ),
  );
  const newNumBotLowScores = Math.max(
    minNumScoreIncrements,
    Math.min(
      maxNumScoreIncrements,
      pickRandomItemFromArray(numScoreIncrements) + numBotLowScores,
    ),
  );
  const newNumOpponentTopScores = Math.max(
    minNumScoreIncrements,
    Math.min(
      maxNumScoreIncrements,
      pickRandomItemFromArray(numScoreIncrements) + numOpponentTopScores,
    ),
  );
  const newNumOpponentLowScores = Math.max(
    minNumScoreIncrements,
    Math.min(
      maxNumScoreIncrements,
      pickRandomItemFromArray(numScoreIncrements) + numOpponentLowScores,
    ),
  );

  const weightIncrements = [-0.5, -0.2, 0, 0.2, 0.5];
  const newWeightW = pickRandomItemFromArray(weightIncrements) + weightW;
  const newWeightY = pickRandomItemFromArray(weightIncrements) + weightY;

  const newNumTilesRemainingWeight =
    pickRandomItemFromArray([-0.5, 0, 0.5]) + numTilesRemainingWeight;

  return {
    numBotTopScores: newNumBotTopScores,
    numBotLowScores: newNumBotLowScores,
    numOpponentTopScores: newNumOpponentTopScores,
    numOpponentLowScores: newNumOpponentLowScores,
    weightW: newWeightW,
    weightY: newWeightY,
    numTilesRemainingWeight: newNumTilesRemainingWeight,
    maxPlacementsToFind,
  };
}

// single bot v bot game
function runBattle(
  botParametersBlue: BotParameters,
  botParametersRed: BotParameters,
): Scores {
  let gameState: GameState = gameInit({});

  while (
    gameState.scores.blue === undefined ||
    gameState.scores.red === undefined
  ) {
    const {botOverlay, botOverlayTopLeft, andScore} = playBot(
      gameState,
      gameState.isBlueTurn ? "blue" : "red",
      gameState.isBlueTurn ? botParametersBlue : botParametersRed,
    );

    gameState = gameReducer(gameState, {
      action: "endTurn",
      andScore,
      overlay: botOverlay,
      overlayTopLeft: botOverlayTopLeft,
    });
  }

  return gameState.scores;
}

// N rounds of bot v bot games between 2 bot parameters
function battleBots(
  numBattles: number,
  botParametersA: BotParameters,
  botParametersB: BotParameters,
): BotParameters {
  console.log(`--- Starting ${numBattles} games ---`);

  const overallWinCounts = {botParametersA: 0, botParametersB: 0};

  for (let index = 0; index < numBattles; index++) {
    console.log(`Game ${index}`);
    // Alternate which bot goes first
    const botAIsBlue = Boolean(index % 2);
    const scores = runBattle(
      botAIsBlue ? botParametersA : botParametersB,
      botAIsBlue ? botParametersB : botParametersA,
    );

    // Ties go to blue
    // (This slightly biases towards the bot that gets more turns playing as blue, but ties are fairly rare)
    const winningColor =
      (scores.red ?? 0) > (scores.blue ?? 0) ? "red" : "blue";
    if (
      (winningColor === "blue" && botAIsBlue) ||
      (winningColor === "red" && !botAIsBlue)
    ) {
      overallWinCounts["botParametersA"]++;
    } else {
      overallWinCounts["botParametersB"]++;
    }
  }

  // Return the bot parameters that won the most games
  // Ties go to parameters B (but there shouldn't be ties if numBattles is odd)
  return overallWinCounts.botParametersA > overallWinCounts.botParametersB
    ? botParametersA
    : botParametersB;
}

function evolveBot(numEvolutions: number): BotParameters {
  const numBattlesPerEvolution = 9;

  let botParametersA = startingBotParameters;
  let botParametersB = tweakParameters(startingBotParameters);

  for (let index = 0; index < numEvolutions; index++) {
    const winningParameters = battleBots(
      numBattlesPerEvolution,
      botParametersA,
      botParametersB,
    );

    botParametersA = winningParameters;
    botParametersB = tweakParameters(winningParameters);
  }

  console.log(JSON.stringify(botParametersA));

  // Return the winning parameters (which is assigned to botParametersA in the evolution loop)
  return botParametersA;
}

evolveBot(2);
