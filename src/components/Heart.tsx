import {useMetadataContext} from "@skedwards88/shared-components/src/components/MetadataContextProvider";
import packageJson from "../../package.json";
import type {DisplayState} from "../Types";
import Share from "@skedwards88/shared-components/src/components/Share";
import logo from "../images/logo.svg";

export default function Heart({
  setDisplay,
}: {
  setDisplay: React.Dispatch<React.SetStateAction<DisplayState>>;
}): React.JSX.Element {
  const {userId, sessionId} = useMetadataContext();

  const feedbackLink = `https://github.com/skedwards88/sector/issues/new?body=Sector+version+${packageJson.version}`;

  return (
    <div className="app heart">
      <img src={logo} alt="Sector logo" id="logo" />
      <div className="heartText">
        <p>Like this game? Share it with your friends.</p>
        <Share
          appName="Sector"
          text="Check out this quick spatial strategy game!"
          url="https://sector.twistedtrailgames.com"
          origin="heart"
          content="Share"
          userId={userId}
          sessionId={sessionId}
        ></Share>
        <hr></hr>
        <p>
          Want more games? Check{" "}
          <a href={"https://twistedtrailgames.com"}>these</a> out.
        </p>
        <hr></hr>
        <p>
          Feedback? <a href={feedbackLink}>Open an issue</a> on GitHub or email
          TwistedTrailGames@gmail.com.
        </p>
        <hr></hr>
        <p>
          <a href="./privacy.html">Privacy policy</a>
        </p>
        <small>tl;dr: We only collect anonymous data about usage.</small>
      </div>
      <button className="close" onClick={() => setDisplay("game")}>
        Close
      </button>
      <small id="rulesVersion">version {packageJson.version}</small>
    </div>
  );
}
