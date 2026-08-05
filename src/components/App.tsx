import React from "react";
import {gameInit} from "../logic/gameInit";
import {gameReducer} from "../logic/gameReducer";
import Game from "./Game";
import Heart from "./Heart";
import Rules from "./Rules";
import {
  handleAppInstalled,
  handleBeforeInstallPrompt,
  type BeforeInstallPromptEvent,
} from "@skedwards88/shared-components/src/logic/handleInstall";
import {sendAnalyticsCF} from "@skedwards88/shared-components/src/logic/sendAnalyticsCF";
import {useMetadataContext} from "@skedwards88/shared-components/src/components/MetadataContextProvider";
import {inferEventsToLog} from "../logic/inferEventsToLog";
import Home from "./Home";
import type {DisplayState} from "../Types";
import {playBot} from "../logic/bot";

export default function App(): React.JSX.Element {
  // *****
  // Install handling setup
  // *****
  // Set up states that will be used by the handleAppInstalled and handleBeforeInstallPrompt listeners
  const [installPromptEvent, setInstallPromptEvent] =
    React.useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallButton, setShowInstallButton] =
    React.useState<boolean>(true);

  React.useEffect(() => {
    // Need to store the function in a variable so that
    // the add and remove actions can reference the same function
    const listener = (event: BeforeInstallPromptEvent): void =>
      handleBeforeInstallPrompt(
        event,
        setInstallPromptEvent,
        setShowInstallButton,
      );

    window.addEventListener("beforeinstallprompt", listener);

    return (): void =>
      window.removeEventListener("beforeinstallprompt", listener);
  }, []);

  React.useEffect(() => {
    // Need to store the function in a variable so that
    // the add and remove actions can reference the same function
    const listener = (): void =>
      handleAppInstalled(setInstallPromptEvent, setShowInstallButton);

    window.addEventListener("appinstalled", listener);

    return (): void => window.removeEventListener("appinstalled", listener);
  }, []);
  // *****
  // End install handling setup
  // *****

  const [display, setDisplay] = React.useState<DisplayState>("home");

  const [gameState, dispatchGameState] = React.useReducer(
    gameReducer,
    {},
    gameInit,
  );

  const {userId, sessionId} = useMetadataContext();

  // Store the previous state so that we can infer which analytics events to send
  const previousStateRef = React.useRef(gameState);

  // Send analytics following reducer updates, if needed
  React.useEffect(() => {
    const previousState = previousStateRef.current;

    const analyticsToLog = inferEventsToLog(previousState, gameState);

    if (analyticsToLog.length) {
      sendAnalyticsCF({userId, sessionId, analyticsToLog});
    }

    previousStateRef.current = gameState;
  }, [gameState, sessionId, userId]);

  const [botIsThinking, setBotIsThinking] = React.useState(false);

  const [botPlayedTopLeft, setBotPlayedTopLeft] = React.useState<number | null>(
    null,
  );

  const onTurnChange = React.useEffectEvent(() => {
    const gameOver =
      gameState.scores.blue != undefined && gameState.scores.red != undefined;

    if (!gameState.isVsBot || gameState.isBlueTurn || gameOver) {
      return;
    }

    setBotIsThinking(true);

    const timer = setTimeout(() => {
      const {botOverlay, botOverlayTopLeft, andScore} = playBot(
        gameState,
        "red",
      );

      dispatchGameState({
        action: "endTurn",
        andScore,
        overlay: botOverlay,
        overlayTopLeft: botOverlayTopLeft,
      });

      setBotIsThinking(false);

      setBotPlayedTopLeft(botOverlayTopLeft);
    }, 3000); // time to spin the deck

    return timer;
  });

  React.useEffect(() => {
    const timer = onTurnChange();

    return (): void => {
      clearTimeout(timer);
      setBotIsThinking(false);
    };
  }, [gameState.isBlueTurn, onTurnChange]);

  React.useEffect(() => {
    if (botPlayedTopLeft === null) {
      return;
    }

    const timer = setTimeout(() => {
      setBotPlayedTopLeft(null);
    }, 3000); // time to fade the played piece; this should match the animation time in css since the animation isn't infinite

    return (): void => {
      clearTimeout(timer);
      setBotPlayedTopLeft(null);
    };
  }, [botPlayedTopLeft]);

  const [needToAnnounceScoring, setNeedToAnnounceScoring] =
    React.useState(false);

  React.useEffect(() => {
    // Don't do anything if the score changed just due to initialization
    if (
      gameState.scores.red === undefined &&
      gameState.scores.blue === undefined
    ) {
      return;
    }

    // If the human scored while playing the bot, don't do anything
    if (gameState.isVsBot && gameState.scores.blue != undefined) {
      return;
    }

    setNeedToAnnounceScoring(true);
  }, [gameState.scores.red, gameState.scores.blue, gameState.isVsBot]);

  switch (display) {
    case "heart":
      return <Heart setDisplay={setDisplay}></Heart>;
    case "rules":
      return <Rules setDisplay={setDisplay}></Rules>;
    case "home":
      return (
        <Home
          dispatchGameState={dispatchGameState}
          setDisplay={setDisplay}
        ></Home>
      );
    default:
      return (
        <Game
          dispatchGameState={dispatchGameState}
          gameState={gameState}
          setDisplay={setDisplay}
          setInstallPromptEvent={setInstallPromptEvent}
          showInstallButton={showInstallButton}
          installPromptEvent={installPromptEvent}
          botIsThinking={botIsThinking}
          botPlayedTopLeft={botPlayedTopLeft}
          setNeedToAnnounceScoring={setNeedToAnnounceScoring}
          needToAnnounceScoring={needToAnnounceScoring}
        ></Game>
      );
  }
}
