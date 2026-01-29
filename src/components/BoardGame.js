import React from "react";

function BoardGameButton({text, link}) {
  return (
    <a className="boardGameButton" href={link} aria-label={text}>
      {text}
    </a>
  );
}
export default function BoardGame() {
  return (
    <div className="boardGame">
      <h1>Sector Board Game</h1>
      <BoardGameButton
        link="/boardGameRules"
        text="Detailed rules (Coming soon)"
      />
      <BoardGameButton link="/" text="Play online" />
      <BoardGameButton
        link="https://www.thegamecrafter.com/"
        text="Buy the game (Coming soon)"
      />
      <BoardGameButton
        link="https://twistedtrailgames.com/"
        text="Explore other games"
      />
    </div>
  );
}
