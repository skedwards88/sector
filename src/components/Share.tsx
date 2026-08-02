import {handleShare} from "../logic/handleShare";

export default function Share({
  appName,
  text,
  url,
  seed,
}: {
  appName: string;
  text: string;
  url: string;
  seed: string;
}): React.JSX.Element {
  if ("canShare" in navigator) {
    return (
      <button onClick={() => handleShare({appName, text, url, seed})}>
        Share
      </button>
    );
  } else {
    return <></>;
  }
}
