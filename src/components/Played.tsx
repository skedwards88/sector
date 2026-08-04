import type {Square} from "../Types";

function getBotPlayedIndexes(
  botPlayedTopLeft: number,
  played: Square[],
): number[] {
  const boardDimension = Math.sqrt(played.length);

  return [
    botPlayedTopLeft, // top left
    botPlayedTopLeft + 1, // top right
    botPlayedTopLeft + boardDimension, // bottom left
    botPlayedTopLeft + boardDimension + 1, // bottom right
  ];
}

export default function Played({
  played,
  botPlayedTopLeft,
}: {
  played: Square[];
  botPlayedTopLeft: number | null;
}): React.JSX.Element {
  const botPlayedIndexes =
    botPlayedTopLeft != undefined
      ? getBotPlayedIndexes(botPlayedTopLeft, played)
      : [];

  return (
    <div id="played">
      {played.map((data, index) => (
        <div
          className={`square ${data.color || ""} ${data.shape || ""} ${
            botPlayedIndexes.includes(index) ? "highlight" : ""
          }`}
          key={index}
        ></div>
      ))}
    </div>
  );
}
