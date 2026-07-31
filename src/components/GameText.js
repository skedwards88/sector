import React from "react";

function PlayerGoal({playerScore, opponentScore}) {
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
  currentColor,
}) {
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

  return (
    <div id="gameText">
      <div id="redScore" className="score">
        {currentColor === "red" ? playerScore : opponentScore}
      </div>
      <div id="blueScore" className="score">
        {currentColor === "blue" ? playerScore : opponentScore}
      </div>
      <div id="terminal">{feedback}</div>
    </div>
  );
}
