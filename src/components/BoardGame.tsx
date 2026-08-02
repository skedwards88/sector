function BoardGameButton({
  text,
  link,
}: {
  text: string;
  link: string;
}): React.JSX.Element {
  return (
    <a className="boardGameButton" href={link} aria-label={text}>
      {text}
    </a>
  );
}
export default function BoardGame(): React.JSX.Element {
  return (
    <div className="boardGame">
      <h1>Sector Board Game</h1>
      <BoardGameButton link="/boardGameRules.pdf" text="Detailed rules (PDF)" />
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
