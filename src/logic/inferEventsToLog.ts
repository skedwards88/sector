import type {GameState} from "../Types";

export function inferEventsToLog(
  oldState: GameState,
  newState: GameState,
): {
  eventName: string;
  eventInfo?: object;
}[] {
  const analyticsToLog = [];

  // If a new game was generated
  if (oldState.id !== newState.id) {
    analyticsToLog.push({
      eventName: "new_game",
      eventInfo: {
        isVsBot: newState.isVsBot,
      },
    });
  }

  // If a game completed
  if (
    newState.scores.blue != undefined &&
    newState.scores.red != undefined &&
    (oldState.scores.blue === undefined || oldState.scores.red === undefined)
  ) {
    const blueScore = newState.scores.blue;
    const redScore = newState.scores.red;
    let winner;
    if (redScore != blueScore) {
      // not a tie
      winner = redScore > blueScore ? "red" : "blue";
    } else {
      // ties go to the player who scored first
      // if no player scored before end of game, then the tie is a legit tie
      winner = newState.firstScorer ?? "tie";
    }

    analyticsToLog.push({
      eventName: "gameOver",
      eventInfo: {
        isVsBot: oldState.isVsBot,
        colorWon: winner,
      },
    });
  }

  return analyticsToLog;
}
