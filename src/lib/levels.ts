import type { Level } from '@/types/game';
import { TileType } from '@/types/game';

// Helper to create an empty grid
const createEmptyGrid = (width: number, height: number): TileType[][] => {
  return Array.from({ length: height }, () => Array(width).fill(TileType.Empty));
};

export const levels: Level[] = [
  {
    id: 1,
    name: 'First Steps',
    difficulty: 'Easy',
    gridSize: { width: 10, height: 7 },
    playerStart: { x: 1, y: 3 },
    goal: { x: 8, y: 3 },
    tiles: createEmptyGrid(10, 7),
  },
  {
    id: 2,
    name: 'The Wall',
    difficulty: 'Easy',
    gridSize: { width: 10, height: 7 },
    playerStart: { x: 1, y: 3 },
    goal: { x: 8, y: 3 },
    tiles: (() => {
      const grid = createEmptyGrid(10, 7);
      for (let i = 0; i < 7; i++) {
        grid[i][5] = TileType.Wall;
      }
      grid[3][5] = TileType.Empty;
      return grid;
    })(),
  },
  {
    id: 3,
    name: 'Deceptive Depth',
    difficulty: 'Medium',
    gridSize: { width: 10, height: 7 },
    playerStart: { x: 1, y: 3 },
    goal: { x: 8, y: 3 },
    tiles: (() => {
      const grid = createEmptyGrid(10, 7);
      for (let i = 0; i < 7; i++) {
        grid[i][5] = TileType.Pit;
      }
      grid[3][5] = TileType.Empty;
      return grid;
    })(),
  },
  {
    id: 4,
    name: 'Timed Gates',
    difficulty: 'Hard',
    gridSize: { width: 12, height: 7 },
    playerStart: { x: 1, y: 3 },
    goal: { x: 10, y: 3 },
    tiles: (() => {
      const grid = createEmptyGrid(12, 7);
      for (let i = 1; i < 6; i++) {
        if (i !== 3) {
            grid[i][4] = TileType.Wall;
            grid[i][7] = TileType.Wall;
        }
      }
      return grid;
    })(),
  },
];
