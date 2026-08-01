import type {Tile} from "../Types";

export function rotateTile(tile: Tile): Tile {
  return [tile[2], tile[0], tile[3], tile[1]];
}
