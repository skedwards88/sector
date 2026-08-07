import React from "react";
import {gameInit} from "../logic/gameInit";
import {gameReducer} from "../logic/gameReducer";
import Game from "./Game";
import MoreGames from "@skedwards88/shared-components/src/components/MoreGames";
import Rules from "./Rules";
import InstallOverview from "@skedwards88/shared-components/src/components/InstallOverview";
import PWAInstall from "@skedwards88/shared-components/src/components/PWAInstall";
import {sendAnalyticsCF} from "@skedwards88/shared-components/src/logic/sendAnalyticsCF";
import {useMetadataContext} from "@skedwards88/shared-components/src/components/MetadataContextProvider";
import {inferEventsToLog} from "../logic/inferEventsToLog";
import Home from "./Home";
import type {DisplayState} from "../Types";
import {playBot} from "../logic/bot";
import packageJson from "../../package.json";

export default function App(): React.JSX.Element {
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

  const [previousIsBlueTurn, setPreviousIsBlueTurn] = React.useState(
    gameState.isBlueTurn,
  );

  const gameOver =
    gameState.scores.blue != undefined && gameState.scores.red != undefined;

  const botShouldThink =
    gameState.isVsBot && !gameState.isBlueTurn && !gameOver;

  if (previousIsBlueTurn !== gameState.isBlueTurn) {
    setPreviousIsBlueTurn(gameState.isBlueTurn);
    if (botShouldThink) {
      setBotIsThinking(true);
    }
  }

  const onTurnChange = React.useEffectEvent(() => {
    if (!botShouldThink) {
      return;
    }

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
      if (timer !== undefined) {
        clearTimeout(timer);
        setBotIsThinking(false);
      }
    };
  }, [gameState.isBlueTurn]);

  React.useEffect(() => {
    if (botPlayedTopLeft === null) {
      return;
    }

    const timer = setTimeout(() => {
      setBotPlayedTopLeft(null);
    }, 2000); // time to fade the played piece; this should be <= the animation time in css since the animation isn't infinite

    return (): void => {
      clearTimeout(timer);
      setBotPlayedTopLeft(null);
    };
  }, [botPlayedTopLeft]);

  const [previousScore, setPreviousScore] = React.useState(gameState.scores);

  const [needToAnnounceScoring, setNeedToAnnounceScoring] =
    React.useState(false);

  if (
    previousScore.red != gameState.scores.red ||
    previousScore.blue != gameState.scores.blue
  ) {
    setPreviousScore(gameState.scores);

    const isInitialization =
      gameState.scores.red === undefined && gameState.scores.blue === undefined;

    const isHumanScoredVsBot =
      gameState.isVsBot && gameState.scores.blue != undefined;

    // Don't do anything if the score changed just due to initialization
    // or if the human scored while playing the bot
    if (!isInitialization && !isHumanScoredVsBot) {
      setNeedToAnnounceScoring(true);
    } else {
      setNeedToAnnounceScoring(false);
    }
  }

  switch (display) {
    case "heart":
      return (
        <MoreGames
          setDisplay={setDisplay}
          games={["deepSpaceSlime", "lexlet", "crossjig"]}
          repoName="https://github.com/skedwards88/sector"
          includeExtraInfo={true}
          version={packageJson.version}
        ></MoreGames>
      );

    case "rules":
      return <Rules setDisplay={setDisplay}></Rules>;

    case "home":
      return (
        <Home
          dispatchGameState={dispatchGameState}
          setDisplay={setDisplay}
        ></Home>
      );

    case "installOverview":
      return (
        <InstallOverview
          setDisplay={setDisplay}
          userId={userId}
          sessionId={sessionId}
        ></InstallOverview>
      );

    case "pwaInstall":
      return (
        <PWAInstall
          setDisplay={setDisplay}
          pwaLink={"https://sector.twistedtrailgames.com"}
          userId={userId}
          sessionId={sessionId}
        ></PWAInstall>
      );

    default:
      return (
        <Game
          dispatchGameState={dispatchGameState}
          gameState={gameState}
          setDisplay={setDisplay}
          botIsThinking={botIsThinking}
          botPlayedTopLeft={botPlayedTopLeft}
          setNeedToAnnounceScoring={setNeedToAnnounceScoring}
          needToAnnounceScoring={needToAnnounceScoring}
        ></Game>
      );
  }
}
