import type {Square, Tile} from "../Types";
import {getEndTurnInvalidReason} from "./getEndTurnInvalidReason";

describe("getEndTurnInvalidReason", () => {
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

  test("if the overlay tile is not on the board", () => {
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

    const played = emptyPlayed;

    const output = getEndTurnInvalidReason({overlay, overlayTopLeft, played});

    expect(output).toBe("the card must be on the board");
  });

  test("if red is on top of blue", () => {
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
    played[49] = {
      color: "blue",
      shape: "moon",
    };

    const output = getEndTurnInvalidReason({overlay, overlayTopLeft, played});

    expect(output).toBe("red and blue may not overlap");
  });

  test("if blue is on top of red", () => {
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

    const overlayTopLeft = 38;

    const played = structuredClone(emptyPlayed);
    played[49] = {
      color: "red",
      shape: "moon",
    };

    const output = getEndTurnInvalidReason({overlay, overlayTopLeft, played});

    expect(output).toBe("red and blue may not overlap");
  });

  test("if tile is not touching", () => {
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

    const overlayTopLeft = 27;

    const played = structuredClone(emptyPlayed);
    played[49] = {
      color: "red",
      shape: "moon",
    };

    const output = getEndTurnInvalidReason({overlay, overlayTopLeft, played});

    expect(output).toBe("the card must make contact with the existing cards");
  });

  test("overlapping shapes ok", () => {
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

    const overlayTopLeft = 49;

    const played = structuredClone(emptyPlayed);
    played[49] = {
      color: "black",
      shape: "moon",
    };
    played[50] = {
      color: "red",
      shape: "star",
    };

    const output = getEndTurnInvalidReason({overlay, overlayTopLeft, played});

    expect(output).toBe(null);
  });

  test("black overlap with red/blue ok", () => {
    const overlay: Tile = [
      {
        color: "blue",
        shape: "moon",
      },
      {
        color: "black",
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

    const overlayTopLeft = 49;

    const played = structuredClone(emptyPlayed);
    played[49] = {
      color: "black",
      shape: "moon",
    };
    played[50] = {
      color: "red",
      shape: "star",
    };

    const output = getEndTurnInvalidReason({overlay, overlayTopLeft, played});

    expect(output).toBe(null);
  });

  test("no overlap ok as long as touching edge", () => {
    const overlay: Tile = [
      {
        color: "blue",
        shape: "moon",
      },
      {
        color: "black",
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

    const overlayTopLeft = 47;

    const played = structuredClone(emptyPlayed);
    played[49] = {
      color: "black",
      shape: "moon",
    };

    const output = getEndTurnInvalidReason({overlay, overlayTopLeft, played});

    expect(output).toBe(null);
  });
});
