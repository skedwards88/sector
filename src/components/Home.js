import React from "react";
import logo from "../images/logo.svg"

export default function Home({dispatchGameState, setDisplay}) {
  return (
    <div className="app" id="home">

      <img src={logo} alt="Sector logo" id="logo"/>

      <button
        onClick={() => {
          dispatchGameState({action: "newGame", isVsBot: false});
          setDisplay("game");
        }}
      >
        human vs human
      </button>
      <button
        onClick={() => {
          dispatchGameState({action: "newGame", isVsBot: true});
          setDisplay("game");
        }}
      >
        human vs bot
      </button>
      <button onClick={() =>setDisplay("rules")}>rules</button>
    </div>
  );
}
