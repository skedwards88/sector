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
      "at least one quadrant of the new tile must be adjacent to or overlap another tile",
      "however, blue and red cannot overlap each other",
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

function Rule({text, image}) {
  return (
    <>
      {text.map((sentence) => (
        <p key={sentence}>{`${sentence}.`}</p>
      ))}
      {image ? <div className="ruleImage" id={image}></div> : <></>}
      <hr></hr>
    </>
  );
}

export default function BoardGame() {
  rules.map((rule, index) => (
    <Rule text={rule.text} image={rule.image} key={index}></Rule>
  ));

  return (
    <div className="boardGame boardGameRules">
      {rules.map((rule, index) => (
        <Rule text={rule.text} image={rule.image} key={index}></Rule>
      ))}
    </div>
  );
}
