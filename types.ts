
export interface PuzzlePieceType {
  id: number;
  imgUrl: string;
  correctPosition: number;
  currentPosition: number;
}

export enum GameState {
  SETUP,
  PLAYING,
  SOLVED,
}
