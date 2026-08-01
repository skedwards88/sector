export type PlayerColor = "red" | "blue";

export type Color = PlayerColor | "black";

export type Shape = "planet" | "whirl" | "moon" | "star" | null;

export type Square = {
  color: Color;
  shape: Shape;
};

export type Tile = [Square, Square, Square, Square];

export type Scores = Record<PlayerColor, number>;

export type GameState = {
  id: string;
  lastBreakingChange: string;
  played: Square[];
  deck: Tile[];
  overlay: Tile|undefined;
  draggedOverlayIndex: number | undefined;
  overlayTopLeft: number | undefined;
  isBlueTurn: boolean;
  isTie: boolean;
  scores: Scores;
};
