import React from "react";
import {gameInit} from "../logic/gameInit";
import {gameReducer} from "../logic/gameReducer";
import Game from "./Game";
import Heart from "./Heart";
import Rules from "./Rules";
import {
  handleAppInstalled,
  handleBeforeInstallPrompt,
} from "../logic/handleInstall";

export default function App() {
  const [display, setDisplay] = React.useState("game");
  const [installPromptEvent, setInstallPromptEvent] = React.useState();
  const [showInstallButton, setShowInstallButton] = React.useState(true);

  const [gameState, dispatchGameState] = React.useReducer(
    gameReducer,
    {},
    gameInit,
  );

  React.useEffect(() => {
    window.addEventListener("beforeinstallprompt", (event) =>
      handleBeforeInstallPrompt(
        event,
        setInstallPromptEvent,
        setShowInstallButton,
      ),
    );
    return () =>
      window.removeEventListener("beforeinstallprompt", (event) =>
        handleBeforeInstallPrompt(
          event,
          setInstallPromptEvent,
          setShowInstallButton,
        ),
      );
  }, []);

  React.useEffect(() => {
    window.addEventListener("appinstalled", () =>
      handleAppInstalled(setInstallPromptEvent, setShowInstallButton),
    );
    return () => window.removeEventListener("appinstalled", handleAppInstalled);
  }, []);

  React.useEffect(() => {
    window.localStorage.setItem("sectorState", JSON.stringify(gameState));
  }, [gameState]);

  switch (display) {
    case "heart":
      return <Heart setDisplay={setDisplay}></Heart>;
    case "rules":
      return <Rules setDisplay={setDisplay}></Rules>;
    default:
      return (
        <Game
          dispatchGameState={dispatchGameState}
          gameState={gameState}
          setDisplay={setDisplay}
          setInstallPromptEvent={setInstallPromptEvent}
          showInstallButton={showInstallButton}
          installPromptEvent={installPromptEvent}
        ></Game>
      );
  }
}
