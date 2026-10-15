import {FIRST_COLOR, type GameState} from "../Types";

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
    let winner: "tie" | "first" | "second";
    if (redScore != blueScore) {
      // not a tie
      const winningColor = redScore > blueScore ? "red" : "blue";
      winner = FIRST_COLOR === winningColor ? "first" : "second";
    } else if (newState.firstScorer) {
      // ties go to the player who scored first
      winner = FIRST_COLOR === newState.firstScorer ? "first" : "second";
    } else {
      // if no player scored before end of game, then the tie is a legit tie
      winner = "tie";
    }

    analyticsToLog.push({
      eventName: "gameOver",
      eventInfo: {
        isVsBot: oldState.isVsBot,
        winner,
      },
    });
  }

  return analyticsToLog;
}
