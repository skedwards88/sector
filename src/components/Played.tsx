import type {Square} from "../Types";

export default function Played({
  played,
}: {
  played: Square[];
}): React.JSX.Element {
  return (
    <div id="played">
      {played.map((data, index) => (
        <div
          className={`square ${data.color || ""} ${data.shape || ""}`}
          key={index}
        ></div>
      ))}
    </div>
  );
}
