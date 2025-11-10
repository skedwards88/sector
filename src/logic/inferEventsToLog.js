export function inferEventsToLog(oldState, newState) {
  let analyticsToLog = [];

  // If a new game was generated
  if (oldState.id !== newState.id) {
    analyticsToLog.push({
      eventName: "new_game",
    });
  }

  return analyticsToLog;
}
