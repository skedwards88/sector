import React from "react";

const rules = [
  {
    text: [
      "players take turns dragging a tile onto the board",
      "players drag to move and tap to rotate the tile",
      "the color of the control panel reflects the color of the current player",
    ],
    image: "",
  },
  {
    text: [
      "each tile is divided into quadrants",
      "quadrants are blue, red, or black",
      "some quadrants have one of four different icons",
    ],
    image: "example_tile",
  },
  {
    text: [
      "the new tile can completely or partially overlap another tile",
      "however, blue and red cannot overlap each other",
      "at least one quadrant of the new tile must be adjacent to or overlap another tile",
      "if a placement is not legal, the 'end turn' button will be dark",
    ],
    image: "legal_moves",
  },
  {
    text: [
      "a sector is any connected set of quadrants of the same color",
      "a sector is worth one point per quadrant, plus one point per unique icon",
      "in this example, there is a 4 point red sector, 3 point red sector, and 8 point blue sector",
    ],
    image: "example_sectors",
  },
  {
    text: [
      "once per game, a player can choose to score their current highest scoring sector",
      "after this point, the un-scored player tries to beat their score, and the scored player tries to prevent this",
      "(if no player has scored by the end of the game, the highest scoring sector wins)",
    ],
    image: "",
  },
];

export default function Rules({setDisplay}) {
  const [ruleNumber, setRuleNumber] = React.useState(0);

  let formattedRuleText = "";
  rules[ruleNumber].text.forEach(
    (rule) => (formattedRuleText += `> ${rule}\n\n`),
  );

  return (
    <div id="app" className="rules">
      <div id="ruleControlsPlaceholder"></div>

      <div id="rulesBoardPlaceholder">
        <div className="ruleImage" id={rules[ruleNumber].image}></div>
      </div>

      <div id="playerScreen">
        <div id="ruleControls">
          <div id="ruleButtons">
            <button
              disabled={ruleNumber === 0}
              onClick={() => setRuleNumber(Math.max(0, ruleNumber - 1))}
            >
              Previous
            </button>
            <button className="close" onClick={() => setDisplay("game")}>
              Close
            </button>
            <button
              disabled={ruleNumber === rules.length - 1}
              onClick={() =>
                setRuleNumber(Math.min(ruleNumber + 1, rules.length - 1))
              }
            >
              Next
            </button>
          </div>

          <div id="terminal">{formattedRuleText}</div>
        </div>

        <div id="sheen"></div>
      </div>
    </div>
  );
}
