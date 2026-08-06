import logo from "../images/logo.svg";
import {sendAnalyticsCF} from "@skedwards88/shared-components/src/logic/sendAnalyticsCF";
import {useMetadataContext} from "@skedwards88/shared-components/src/components/MetadataContextProvider";

function BoardGameButton({
  text,
  link,
  userId,
  sessionId,
  analyticsDescriptor,
}: {
  text: string;
  link: string;
  userId: string;
  sessionId: string;
  analyticsDescriptor: string;
}): React.JSX.Element {
  return (
    <a
      className="boardGameButton"
      href={link}
      aria-label={text}
      onClick={() => {
        sendAnalyticsCF({
          userId,
          sessionId,
          analyticsToLog: [
            {eventName: "boardGame", eventInfo: {click: analyticsDescriptor}},
          ],
        });
      }}
    >
      {text}
    </a>
  );
}

export default function BoardGame(): React.JSX.Element {
  const {userId, sessionId} = useMetadataContext();

  return (
    <div className="boardGame">
      <img src={logo} alt="Sector logo" id="logo" />
      <BoardGameButton
        link="/boardGameRules.pdf"
        text="Detailed rules (PDF)"
        userId={userId}
        sessionId={sessionId}
        analyticsDescriptor="rules"
      />
      <BoardGameButton
        link="/"
        text="Play online"
        userId={userId}
        sessionId={sessionId}
        analyticsDescriptor="onlinePlay"
      />
      <BoardGameButton
        link="https://www.thegamecrafter.com/"
        text="Buy the game (Coming soon)"
        userId={userId}
        sessionId={sessionId}
        analyticsDescriptor="buy"
      />
      <BoardGameButton
        link="https://twistedtrailgames.com/"
        text="Explore other games"
        userId={userId}
        sessionId={sessionId}
        analyticsDescriptor="moreGames"
      />
    </div>
  );
}
