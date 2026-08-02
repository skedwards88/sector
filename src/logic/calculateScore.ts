import {partitionArray} from "@skedwards88/word_logic";
import type {PlayerColor, Square} from "../Types";

class Sector {
  indexes: Set<string>;
  shapes: Set<string>;

  constructor({
    indexes = new Set<string>(),
    shapes = new Set<string>(),
  }: {indexes?: Set<string>; shapes?: Set<string>} = {}) {
    this.indexes = indexes;
    this.shapes = shapes;
  }

  get score(): number {
    return this.indexes.size + this.shapes.size;
  }
}

function findSectors(color: PlayerColor, played: Square[]): Sector[] {
  // split the played indexes into rows to make it
  // easier to see top/bottom/left/right neighbors
  const playedCopy = structuredClone(played);
  const playedRows = partitionArray(playedCopy, Math.sqrt(playedCopy.length));

  const sectors: Sector[] = [];
  const row_deltas = [-1, 1, 0, 0];
  const column_deltas = [0, 0, -1, 1];

  playedRows.forEach((row, row_index) =>
    row.forEach((square, column_index) => {
      // If the square's color matches the color that we are scoring
      // start a sector and search around that square
      if (square.color == color) {
        const currentSector = new Sector({});
        const coordinatesToSearch = [[row_index, column_index]];
        // Semi-iteratively search around each coordinate of interest
        // for squares of the same color
        //   while ((idToCheck = idsToCheck.pop()) !== undefined) {
        let searchCoordinates: number[] | undefined;
        while ((searchCoordinates = coordinatesToSearch.pop()) != undefined) {
          const [search_row, search_column] = searchCoordinates;
          // Record this square in the sector
          currentSector.indexes.add(`${search_row},${search_column}`);
          if (playedRows[search_row][search_column].shape) {
            currentSector.shapes.add(
              playedRows[search_row][search_column].shape,
            );
          }
          // Clear the color from the board so we don't record it more than once
          playedRows[search_row][search_column].color = "black";
          // Search up/down/left right for squares of the same color
          // If one is found, add it to the list of coordinates to search
          row_deltas.forEach((row_delta, delta_index) => {
            const column_delta = column_deltas[delta_index];
            if (
              playedRows[search_row + row_delta]?.[search_column + column_delta]
                ?.color === color
            ) {
              coordinatesToSearch.push([
                search_row + row_delta,
                search_column + column_delta,
              ]);
            }
          });
        }
        // Once we have completed the sector, add this sector to the list of sectors
        sectors.push(currentSector);
      }
    }),
  );
  return sectors;
}

export function calculateScore(color: PlayerColor, played: Square[]): number {
  const sectors = findSectors(color, played);

  if (!sectors.length) {
    return 0;
  }

  const scores = sectors.map((sector) => sector.score);
  return Math.max(...scores);
}
