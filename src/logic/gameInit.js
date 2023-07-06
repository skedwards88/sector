import sendAnalytics from "./sendAnalytics";
import {deck} from "./deck"

export function gameInit({
  expanseSize = 10,
  useSaved = true,
}) {

  sendAnalytics("new_game");

  const played = Array.from({ length: expanseSize * expanseSize }, () => ({color: "black", shape: ""}));
  played[2].color = "red"
  played[3].color = "blue"
  played[3].shape = "planet"

// todo shuffle deck

  return {
    played,
    expanseSize,
    deck,
    overlayTopLeft: undefined,// todo change to undefined and handle undefined in overlay render
    draggedOverlayIndex: undefined,
    lastBreakingChange: "20230706",
  };
}
