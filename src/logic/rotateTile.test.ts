import type {Tile} from "../Types";
import {rotateTile} from "./rotateTile";

describe("rotateTile", () => {
  test("rotates the tile 90 degrees", () => {
    const inputTile: Tile = [
      {color: "red", shape: "whirl"},
      {color: "red", shape: "star"},
      {color: "blue", shape: "planet"},
      {color: "black", shape: null},
    ];

    const expected = [
      {color: "blue", shape: "planet"},
      {color: "red", shape: "whirl"},
      {color: "black", shape: null},
      {color: "red", shape: "star"},
    ];

    const rotated = rotateTile(inputTile);

    expect(rotated).toStrictEqual(expected);
  });

  test("does not mutate the input tile", () => {
    const inputTile: Tile = [
      {color: "red", shape: "whirl"},
      {color: "red", shape: "star"},
      {color: "blue", shape: "planet"},
      {color: "black", shape: null},
    ];

    const clone = structuredClone(inputTile);
    const clone2 = structuredClone(inputTile);

    rotateTile(clone2);

    expect(clone).toStrictEqual(clone2);
  });
});
