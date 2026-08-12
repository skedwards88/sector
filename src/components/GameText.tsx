function PlayerGoal({
  playerScore,
  opponentScore,
}: {
  playerScore: number | undefined;
  opponentScore: number | undefined;
}): string {
  if (playerScore === undefined && opponentScore === undefined) {
    return `goal: maximize your score (you can score once per game)`;
  }
  if (playerScore != undefined) {
    return `goal: prevent your opponent from scoring more than ${playerScore} points`;
  }

  if (opponentScore != undefined) {
    return `goal: score more than ${opponentScore} points`;
  }

  return "";
}

export default function GameText({
  overlayTopLeft,
  turnInvalidReason,
  playerScore,
  opponentScore,
}: {
  overlayTopLeft: number | undefined;
  turnInvalidReason: string | null;
  playerScore: number | undefined;
  opponentScore: number | undefined;
}): React.JSX.Element {
  let feedback = "";
  if (overlayTopLeft === undefined) {
    feedback =
      "> drag to move; tap to rotate\n\n> move the tile into the expanse";
  } else {
    feedback = `> ${PlayerGoal({
      playerScore,
      opponentScore,
    })}\n\n`;
    if (turnInvalidReason) {
      feedback += `> ${turnInvalidReason}\n\n`;
    }
  }

  return <div id="terminal">{feedback}</div>;
}
