import React from "react";
import {handleInstall} from "../logic/handleInstall";

export default function ControlBar({
  setDisplay,
  setInstallPromptEvent,
  showInstallButton,
  installPromptEvent,
}) {
  return (
    <div id="controls">
      <button
        id="newGameButton"
        onClick={() => {
          setDisplay("home")
        }}
      ></button>
      <button id="heartButton" onClick={() => setDisplay("heart")}></button>
      <button id="rulesButton" onClick={() => setDisplay("rules")}></button>
      {showInstallButton && installPromptEvent ? (
        <button
          id="installButton"
          onClick={() =>
            handleInstall(installPromptEvent, setInstallPromptEvent)
          }
        ></button>
      ) : (
        <></>
      )}
    </div>
  );
}
