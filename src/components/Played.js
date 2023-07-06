import React from "react";

export default function Played({played
}) {
  return (
    <div id="played">
      {played.map((data, index) => <div className={`square ${data.color || "black"} ${data.shape || ""}`} key={index}></div>)}
    </div>
  );
}
