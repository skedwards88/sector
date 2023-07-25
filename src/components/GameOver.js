import React from "react";

export default function GameOver({scores}) {
  const redScore = scores.red;
  const blueScore = scores.blue;

  const winner = redScore > blueScore ? "red" : "blue";

  return (
    <div
      id="gameOver"
      className={winner}
    >{`${winner.toUpperCase()} wins!\n\nRed: ${redScore}\n\nBlue: ${blueScore}`}</div>
  );
}
