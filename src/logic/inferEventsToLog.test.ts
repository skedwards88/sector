import type {GameState, PlayerColor} from "../Types";
import {deck} from "./deck";
import {inferEventsToLog} from "./inferEventsToLog";

describe("inferEventsToLog", () => {
  const genericBase: GameState = {
    id: "test",
    isVsBot: false,
    played: [],
    deck: [],
    overlay: deck[0],
    overlayTopLeft: undefined,
    draggedOverlayIndex: undefined,
    isBlueTurn: true,
    scores: {
      red: undefined,
      blue: undefined,
    },
    firstScorer: undefined,
    lastBreakingChange: "20230706",
  };

  test("new_game logged if the id changes", () => {
    const oldState = {
      ...genericBase,
      id: "A",
      isVsBot: true,
    };

    const newState = {
      ...genericBase,
      id: "B",
      isVsBot: false,
    };

    expect(inferEventsToLog(oldState, newState)).toStrictEqual([
      {
        eventName: "new_game",
        eventInfo: {
          isVsBot: newState.isVsBot,
        },
      },
    ]);
  });

  test("gameOver logged if scores are completed (winner case)", () => {
    const oldState = {
      ...genericBase,
      scores: {
        red: undefined,
        blue: undefined,
      },
    };

    const newState = {
      ...genericBase,
      scores: {
        red: 0,
        blue: 5,
      },
    };

    expect(inferEventsToLog(oldState, newState)).toStrictEqual([
      {
        eventName: "gameOver",
        eventInfo: {
          isVsBot: newState.isVsBot,
          colorWon: "blue",
        },
      },
    ]);
  });

  test("gameOver logged if scores are completed (tie case without first scorer)", () => {
    const oldState = {
      ...genericBase,
      scores: {
        red: undefined,
        blue: undefined,
      },
    };

    const newState = {
      ...genericBase,
      scores: {
        red: 5,
        blue: 5,
      },
    };

    expect(inferEventsToLog(oldState, newState)).toStrictEqual([
      {
        eventName: "gameOver",
        eventInfo: {
          isVsBot: newState.isVsBot,
          colorWon: "tie",
        },
      },
    ]);
  });

  test("gameOver logged if scores are completed (tie case with first scorer)", () => {
    const oldState = {
      ...genericBase,
      scores: {
        red: 5,
        blue: undefined,
      },
    };

    const newState = {
      ...genericBase,
      scores: {
        red: 5,
        blue: 5,
      },
      firstScorer: "red" as PlayerColor,
    };

    expect(inferEventsToLog(oldState, newState)).toStrictEqual([
      {
        eventName: "gameOver",
        eventInfo: {
          isVsBot: newState.isVsBot,
          colorWon: "red",
        },
      },
    ]);
  });
});
