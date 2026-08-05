import type {Square, Tile} from "../Types";
import {mergeOverlayAndPlayed} from "./mergeOverlayAndPlayed";

describe("mergeOverlayAndPlayed", () => {
  const emptyPlayed: Square[] = [
    {color: null, shape: null},
    {color: null, shape: null},
    {color: null, shape: null},
    {color: null, shape: null},
    {color: null, shape: null},
    {color: null, shape: null},
    {color: null, shape: null},
    {color: null, shape: null},
    {color: null, shape: null},
    {color: null, shape: null},
    {color: null, shape: null},
    {color: null, shape: null},
    {color: null, shape: null},
    {color: null, shape: null},
    {color: null, shape: null},
    {color: null, shape: null},
    {color: null, shape: null},
    {color: null, shape: null},
    {color: null, shape: null},
    {color: null, shape: null},
    {color: null, shape: null},
    {color: null, shape: null},
    {color: null, shape: null},
    {color: null, shape: null},
    {color: null, shape: null},
    {color: null, shape: null},
    {color: null, shape: null},
    {color: null, shape: null},
    {color: null, shape: null},
    {color: null, shape: null},
    {color: null, shape: null},
    {color: null, shape: null},
    {color: null, shape: null},
    {color: null, shape: null},
    {color: null, shape: null},
    {color: null, shape: null},
    {color: null, shape: null},
    {color: null, shape: null},
    {color: null, shape: null},
    {color: null, shape: null},
    {color: null, shape: null},
    {color: null, shape: null},
    {color: null, shape: null},
    {color: null, shape: null},
    {color: null, shape: null},
    {color: null, shape: null},
    {color: null, shape: null},
    {color: null, shape: null},
    {color: null, shape: null},
    {color: null, shape: null},
    {color: null, shape: null},
    {color: null, shape: null},
    {color: null, shape: null},
    {color: null, shape: null},
    {color: null, shape: null},
    {color: null, shape: null},
    {color: null, shape: null},
    {color: null, shape: null},
    {color: null, shape: null},
    {color: null, shape: null},
    {color: null, shape: null},
    {color: null, shape: null},
    {color: null, shape: null},
    {color: null, shape: null},
    {color: null, shape: null},
    {color: null, shape: null},
    {color: null, shape: null},
    {color: null, shape: null},
    {color: null, shape: null},
    {color: null, shape: null},
    {color: null, shape: null},
    {color: null, shape: null},
    {color: null, shape: null},
    {color: null, shape: null},
    {color: null, shape: null},
    {color: null, shape: null},
    {color: null, shape: null},
    {color: null, shape: null},
    {color: null, shape: null},
    {color: null, shape: null},
    {color: null, shape: null},
    {color: null, shape: null},
    {color: null, shape: null},
    {color: null, shape: null},
    {color: null, shape: null},
    {color: null, shape: null},
    {color: null, shape: null},
    {color: null, shape: null},
    {color: null, shape: null},
    {color: null, shape: null},
    {color: null, shape: null},
    {color: null, shape: null},
    {color: null, shape: null},
    {color: null, shape: null},
    {color: null, shape: null},
    {color: null, shape: null},
    {color: null, shape: null},
    {color: null, shape: null},
    {color: null, shape: null},
    {color: null, shape: null},
  ];

  test("does not mutate the input played", () => {
    const overlay: Tile = [
      {
        color: "blue",
        shape: "moon",
      },
      {
        color: "red",
        shape: "planet",
      },
      {
        color: "black",
        shape: null,
      },
      {
        color: "blue",
        shape: "planet",
      },
    ];

    const overlayTopLeft = 48;

    const played = structuredClone(emptyPlayed);
    played[44] = {
      color: "blue",
      shape: "moon",
    };
    played[45] = {
      color: "red",
      shape: null,
    };
    played[54] = {
      color: "blue",
      shape: "star",
    };
    played[55] = {
      color: "black",
      shape: null,
    };

    const playedClone = structuredClone(played);

    mergeOverlayAndPlayed({played, overlay, overlayTopLeft});

    expect(played).toEqual(playedClone);
  });

  test("returns the played unchanged if overlayTopLeft is not defined", () => {
    const overlay: Tile = [
      {
        color: "blue",
        shape: "moon",
      },
      {
        color: "red",
        shape: "planet",
      },
      {
        color: "black",
        shape: null,
      },
      {
        color: "blue",
        shape: "planet",
      },
    ];

    const overlayTopLeft = undefined;

    const played = structuredClone(emptyPlayed);
    played[44] = {
      color: "blue",
      shape: "moon",
    };
    played[45] = {
      color: "red",
      shape: null,
    };
    played[54] = {
      color: "blue",
      shape: "star",
    };
    played[55] = {
      color: "black",
      shape: null,
    };

    const output = mergeOverlayAndPlayed({played, overlay, overlayTopLeft});

    expect(played).toEqual(output);
  });

  test("returns the played unchanged if overlayTopLeft is not defined", () => {
    const overlay: Tile = [
      {
        color: "blue",
        shape: "moon",
      },
      {
        color: "red",
        shape: "planet",
      },
      {
        color: "black",
        shape: null,
      },
      {
        color: "blue",
        shape: "planet",
      },
    ];

    const overlayTopLeft = 54;

    const played = structuredClone(emptyPlayed);
    played[44] = {
      color: "blue",
      shape: "star",
    };
    played[45] = {
      color: "red",
      shape: null,
    };
    played[54] = {
      color: "blue",
      shape: "star",
    };
    played[55] = {
      color: "black",
      shape: null,
    };

    const output = mergeOverlayAndPlayed({played, overlay, overlayTopLeft});

    output.forEach((square, index) => {
      if (index === overlayTopLeft) {
        expect(square).toEqual(overlay[0]);
      } else if (index === overlayTopLeft + 1) {
        expect(square).toEqual(overlay[1]);
      } else if (index === overlayTopLeft + Math.sqrt(played.length)) {
        expect(square).toEqual(overlay[2]);
      } else if (index === overlayTopLeft + Math.sqrt(played.length) + 1) {
        expect(square).toEqual(overlay[3]);
      } else {
        expect(square).toEqual(played[index]);
      }
    });
  });
});
