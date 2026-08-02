import {useMetadataContext} from "@skedwards88/shared-components/src/components/MetadataContextProvider";
import packageJson from "../../package.json";
import type {DisplayState} from "../Types";
import Share from "@skedwards88/shared-components/src/components/Share";

export default function Heart({
  setDisplay,
}: {
  setDisplay: React.Dispatch<React.SetStateAction<DisplayState>>;
}): React.JSX.Element {
  const {userId, sessionId} = useMetadataContext();

  const feedbackLink = `https://github.com/skedwards88/sector/issues/new?body=Sector+version+${packageJson.version}`;

  return (
    <div className="App heart">
      <h1>Sector</h1>
      <div className="heartText">
        {"Like this game? Share it with your friends.\n\n"}
        {
          <Share
            appName="Sector"
            text="Check out this quick spatial strategy game!"
            url="https://sector.twistedtrailgames.com"
            origin="heart"
            content="Share"
            userId={userId}
            sessionId={sessionId}
          ></Share>
        }
        {`\n`}
        {<hr></hr>}
        {`\n`}
        {`Want more games? Check `}
        <a href="https://twistedtrailgames.com">these</a>
        {` out. `}
        {`\n\n`}
        {<hr></hr>}
        {`\n`}
        {"Feedback? "}
        <a href={feedbackLink}>Open an issue</a>
        {" on GitHub."}
        {`\n\n`}
        {<hr></hr>}
        {`\n`}
        <a href="./privacy.html">Privacy policy</a>
        {`\n\n\n\n`}
        <small id="rulesVersion">version {packageJson.version}</small>
      </div>
      <button className="close" onClick={() => setDisplay("game")}>
        Close
      </button>
    </div>
  );
}
