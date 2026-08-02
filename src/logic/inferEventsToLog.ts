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

  return analyticsToLog;
}
