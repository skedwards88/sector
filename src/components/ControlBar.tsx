import {handleInstall} from "../logic/handleInstall";
import type {DisplayState} from "../Types";

export default function ControlBar({
  setDisplay,
  setInstallPromptEvent,
  showInstallButton,
  installPromptEvent,
}: {
  setDisplay: React.Dispatch<React.SetStateAction<DisplayState>>;
  setInstallPromptEvent;
  showInstallButton;
  installPromptEvent;
}): React.JSX.Element {
  return (
    <div id="controls">
      <button
        id="newGameButton"
        onClick={() => {
          setDisplay("home");
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
