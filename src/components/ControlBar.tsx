import {
  handleInstall,
  type BeforeInstallPromptEvent,
} from "@skedwards88/shared-components/src/logic/handleInstall";
import type {DisplayState} from "../Types";
import {useMetadataContext} from "@skedwards88/shared-components/src/components/MetadataContextProvider";

export default function ControlBar({
  setDisplay,
  setInstallPromptEvent,
  showInstallButton,
  installPromptEvent,
}: {
  setDisplay: React.Dispatch<React.SetStateAction<DisplayState>>;
  setInstallPromptEvent: React.Dispatch<
    React.SetStateAction<BeforeInstallPromptEvent | null>
  >;
  showInstallButton: boolean;
  installPromptEvent: BeforeInstallPromptEvent | null;
}): React.JSX.Element {
  const {userId, sessionId} = useMetadataContext();

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
            handleInstall(
              installPromptEvent,
              setInstallPromptEvent,
              userId,
              sessionId,
            )
          }
        ></button>
      ) : (
        <></>
      )}
    </div>
  );
}
