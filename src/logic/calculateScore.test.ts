import type {Square} from "../Types";
import {calculateScore} from "./calculateScore";

describe("calculateScore", () => {
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

  test("zero if no squares played", () => {
    expect(calculateScore("red", emptyPlayed)).toBe(0);
    expect(calculateScore("blue", emptyPlayed)).toBe(0);
  });

  test("zero if no squares played for that color", () => {
    const played = structuredClone(emptyPlayed);
    played[44] = {
      color: "blue",
      shape: "moon",
    };
    played[45] = {
      color: "black",
      shape: "planet",
    };
    played[54] = {
      color: "blue",
      shape: "star",
    };
    played[55] = {
      color: "black",
      shape: null,
    };

    expect(calculateScore("red", played)).toBe(0);
    expect(calculateScore("blue", played)).not.toBe(0);
  });

  test("shapes only count once per shape type", () => {
    const played = structuredClone(emptyPlayed);
    played[44] = {
      color: "blue",
      shape: "moon",
    };
    played[45] = {
      color: "blue",
      shape: "planet",
    };
    played[54] = {
      color: "blue",
      shape: "star",
    };
    played[55] = {
      color: "blue",
      shape: "planet",
    };

    expect(calculateScore("blue", played)).toBe(7);
  });

  test("only the highest scoring sector scores", () => {
    const played = structuredClone(emptyPlayed);
    played[44] = {
      color: "blue",
      shape: "moon",
    };
    played[45] = {
      color: "blue",
      shape: "planet",
    };
    played[54] = {
      color: "blue",
      shape: "star",
    };
    played[55] = {
      color: "blue",
      shape: "planet",
    };
    played[12] = {
      color: "blue",
      shape: "star",
    };
    played[13] = {
      color: "blue",
      shape: "planet",
    };

    expect(calculateScore("blue", played)).toBe(7);
  });
});
