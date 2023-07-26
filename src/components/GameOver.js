import React from "react";

export default function GameOver({scores, isTie}) {
  const redScore = scores.red;
  const blueScore = scores.blue;

  if (isTie) {
    return (
      <div id="gameOver">{`Tie!\n\nRed: ${redScore}\n\nBlue: ${blueScore}`}</div>
    );
  }

  const winner = redScore > blueScore ? "red" : "blue";

  return (
    <div
      id="gameOver"
      className={winner}
    >{`${winner.toUpperCase()} wins!\n\nRed: ${redScore}\n\nBlue: ${blueScore}`}</div>
  );
}
