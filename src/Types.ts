export type PlayerColor = "red" | "blue";

export type Color = PlayerColor | "black" | null;

export type Shape = "planet" | "whirl" | "moon" | "star" | null;

export type Square = {
  color: Color;
  shape: Shape;
};

export type Tile = [Square, Square, Square, Square];

export type Scores = Record<PlayerColor, number | undefined>;

export type GameState = {
  id: string;
  lastBreakingChange: string;
  played: Square[];
  deck: Tile[];
  overlay: Tile | undefined;
  draggedOverlayIndex: number | undefined;
  overlayTopLeft: number | undefined;
  isFirstPlayerTurn: boolean;
  firstScorer: PlayerColor | undefined;
  scores: Scores;
  isVsBot: boolean;
};

export type DisplayState =
  "game" | "rules" | "home" | "heart" | "installOverview" | "pwaInstall";

export const OPPOSITE_COLOR: Record<PlayerColor, PlayerColor> = {
  blue: "red",
  red: "blue",
};

export const FIRST_COLOR: PlayerColor = "blue";

export const BOT_COLOR = OPPOSITE_COLOR[FIRST_COLOR];
