import {isOnBoard} from "./bot";

describe("isOffBoard", () => {
  const tileDiameter = 2;
  const boardDiameter = 5;

  test("true if tile is fully on the board", () => {
    expect(isOnBoard(6, tileDiameter, boardDiameter)).toBe(true);
  });

  test("false if tile goes off right side", () => {
    expect(isOnBoard(4, tileDiameter, boardDiameter)).toBe(false);
  });

  test("false if tile goes off bottom", () => {
    expect(isOnBoard(21, tileDiameter, boardDiameter)).toBe(false);
  });

  test("false if tile goes off bottom and right", () => {
    expect(isOnBoard(24, tileDiameter, boardDiameter)).toBe(false);
  });

  test("true if tile is at right edge but not off", () => {
    expect(isOnBoard(8, tileDiameter, boardDiameter)).toBe(true);
  });

  test("true if tile is at bottom edge but not off", () => {
    expect(isOnBoard(15, tileDiameter, boardDiameter)).toBe(true);
  });

  test("true if tile is at bottom right edge but not off", () => {
    expect(isOnBoard(18, tileDiameter, boardDiameter)).toBe(true);
  });
});
