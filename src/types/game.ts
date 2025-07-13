export type Position = {
  x: number;
  y: number;
};

export enum TileType {
  Empty = 0,
  Wall = 1,
  Player = 2,
  Goal = 3,
  Pit = 4, // Pit in real world, Wall in mirror world
}

export type Level = {
  id: number;
  name: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  gridSize: { width: number; height: number };
  playerStart: Position;
  goal: Position;
  tiles: TileType[][];
};
