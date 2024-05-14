import React from "react";
import Share from "./Share";
import packageJson from "../../package.json";

export default function Heart({setDisplay}) {
  const feedbackLink = `https://github.com/skedwards88/sector/issues/new?body=Sector+version+${packageJson.version}`;

  return (
    <div className="App heart">
      <h1>Sector</h1>
      <div className="heartText">
        {"Like this game? Share it with your friends.\n\n"}
        {
          <Share
            appName={"Sector"}
            url={"https://skedwards88.github.io/sector/"}
            text={"Check out this quick spatial strategy game!"}
          ></Share>
        }
        {`\n`}
        {<hr></hr>}
        {`\n`}
        {`Want more games? Check `}
        <a href="https://skedwards88.github.io/">these</a>
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
