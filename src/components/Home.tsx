import {sendAnalyticsCF} from "@skedwards88/shared-components/src/logic/sendAnalyticsCF";
import logo from "../images/logo.svg";
import {type ReducerPayload} from "../logic/gameReducer";
import type {DisplayState} from "../Types";
import {useMetadataContext} from "@skedwards88/shared-components/src/components/MetadataContextProvider";

export default function Home({
  dispatchGameState,
  setDisplay,
}: {
  dispatchGameState: React.Dispatch<ReducerPayload>;
  setDisplay: React.Dispatch<React.SetStateAction<DisplayState>>;
}): React.JSX.Element {
  const {userId, sessionId} = useMetadataContext();

  return (
    <div className="app" id="home">
      <img src={logo} alt="Sector logo" id="logo" />

      <button
        onClick={() => {
          dispatchGameState({action: "newGame", isVsBot: false});
          setDisplay("game");
        }}
      >
        human vs human
      </button>
      <button
        onClick={() => {
          dispatchGameState({action: "newGame", isVsBot: true});
          setDisplay("game");
        }}
      >
        human vs bot
      </button>
      <button
        onClick={() => {
          sendAnalyticsCF({
            userId,
            sessionId,
            analyticsToLog: [{eventName: "appRules"}],
          });
          setDisplay("rules");
        }}
      >
        rules
      </button>
    </div>
  );
}
