class Sector {
  constructor({indexes = new Set(), shapes = new Set()}) {
    this.indexes = indexes;
    this.shapes = shapes;
  }

  get score() {
    return this.indexes.size + this.shapes.size;
  }
}

function partitionArray(array, partitionSize) {
  let partitioned = [];
  for (let i = 0; i < array.length; i += partitionSize) {
    partitioned.push(array.slice(i, i + partitionSize));
  }
  return partitioned;
}

function findSectors(color, played) {
  // split the played indexes into rows to make it
  // easier to see top/bottom/left/right neighbors
  const playedCopy = JSON.parse(JSON.stringify(played));
  const playedRows = partitionArray(playedCopy, Math.sqrt(playedCopy.length));

  let sectors = [];
  let row_deltas = [-1, 1, 0, 0];
  let column_deltas = [0, 0, -1, 1];

  playedRows.forEach((row, row_index) =>
    row.forEach((square, column_index) => {
      // If the square's color matches the color that we are scoring
      // start a sector and search around that square
      if (square.color == color) {
        let currentSector = new Sector({});
        let coordinatesToSearch = [[row_index, column_index]];
        // Semi-iteratively search around each coordinate of interest
        // for squares of the same color
        while (coordinatesToSearch.length > 0) {
          let [search_row, search_column] = coordinatesToSearch.pop();
          // Record this square in the sector
          currentSector.indexes.add(
            JSON.stringify([search_row, search_column]),
          );
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
            let column_delta = column_deltas[delta_index];
            if (
              playedRows[search_row + row_delta]?.[search_column + column_delta]
                .color === color
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

export function calculateScore(color, played) {
  const sectors = findSectors(color, played);

  if (!sectors.length) {
    return 0
  }

  const scores = sectors.map((sector) => sector.score);
  return Math.max(...scores);
}
