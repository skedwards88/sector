import type {DisplayState} from "../Types";
import {useMetadataContext} from "@skedwards88/shared-components/src/components/MetadataContextProvider";
import Share from "@skedwards88/shared-components/src/components/Share";
import {isRunningStandalone} from "@skedwards88/shared-components/src/logic/isRunningStandalone";
import {sendAnalyticsCF} from "@skedwards88/shared-components/src/logic/sendAnalyticsCF";

export default function ControlBar({
  setDisplay,
}: {
  setDisplay: React.Dispatch<React.SetStateAction<DisplayState>>;
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
      <button
        id="rulesButton"
        onClick={() => {
          sendAnalyticsCF({
            userId,
            sessionId,
            analyticsToLog: [{eventName: "appRules"}],
          });
          setDisplay("rules");
        }}
      ></button>
      <Share
        id="shareButton"
        appName="Sector"
        text="Check out this quick spatial strategy game!"
        url="https://sector.twistedtrailgames.com"
        origin="control bar"
        userId={userId}
        sessionId={sessionId}
      ></Share>
      {!isRunningStandalone() ? (
        <button
          id="installButton"
          onClick={() => setDisplay("installOverview")}
        ></button>
      ) : (
        <></>
      )}
    </div>
  );
}
