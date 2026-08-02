function PlayerGoal({
  playerScore,
  opponentScore,
}: {
  playerScore: number | undefined;
  opponentScore: number | undefined;
}): string {
  if (playerScore === undefined && opponentScore === undefined) {
    return "goal: maximize your score";
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
  placementIsLegal,
  illegalPlacementInfo,
  playerScore,
  opponentScore,
}: {
  overlayTopLeft: number | undefined;
  placementIsLegal: boolean;
  illegalPlacementInfo: string;
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
    if (!placementIsLegal) {
      feedback += `> ${illegalPlacementInfo}\n\n`;
    }
  }

  return <div id="terminal">{feedback}</div>;
}
