'use client';

import { useCallback, useEffect, useState } from 'react';
import { Level, Position, TileType } from '@/types/game';
import { useToast } from '@/hooks/use-toast';
import Confetti from 'react-dom-confetti';
import { Tile } from './Tile';
import { Button } from '../ui/button';
import { ArrowLeft, ArrowRight, ArrowUp, ArrowDown, RotateCw } from 'lucide-react';
import { HintButton } from './HintButton';
import { SettingsDialog } from './SettingsDialog';

interface GameboardProps {
  initialLevel: Level;
  onLevelComplete: () => void;
  onRestart: () => void;
}

export function Gameboard({ initialLevel, onLevelComplete, onRestart }: GameboardProps) {
  const [level, setLevel] = useState(initialLevel);
  const [playerPos, setPlayerPos] = useState<Position>(level.playerStart);
  const [isComplete, setIsComplete] = useState(false);
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const { toast } = useToast();

  const { width, height } = level.gridSize;

  const mirrorPlayerPos: Position = {
    x: width - 1 - playerPos.x,
    y: playerPos.y,
  };

  const isWalkable = useCallback((pos: Position, world: 'real' | 'mirror') => {
    if (pos.x < 0 || pos.x >= width || pos.y < 0 || pos.y >= height) {
      return false;
    }

    // The tile from the canonical level definition for the given position
    const realTileForPos = level.tiles[pos.y][pos.x];

    // The position in the *other* world's grid that corresponds to `pos`.
    // This is needed to check for the opposite tile type (e.g. Pit vs Empty)
    const correspondingMirrorPos = { x: width - 1 - pos.x, y: pos.y };
    const correspondingRealTile = level.tiles[correspondingMirrorPos.y][correspondingMirrorPos.x];


    if (world === 'real') {
        // In the real world, Walls are obstacles. Pits are also obstacles.
        // A tile is also unwalkable if the corresponding mirror tile is a pit.
        return realTileForPos !== TileType.Wall && realTileForPos !== TileType.Pit && correspondingRealTile !== TileType.Pit;
    } else { // world === 'mirror'
        // In the mirror world, Walls are obstacles. Pits in the *mirror* world are walkable.
        // A tile is unwalkable if the corresponding *real* tile is a pit.
        return realTileForPos !== TileType.Wall && realTileForPos !== TileType.Pit;
    }
  }, [width, height, level.tiles]);

  const handleMove = useCallback((dx: number, dy: number, moveName: string) => {
    if (isComplete) return;

    const newPlayerPos = { x: playerPos.x + dx, y: playerPos.y + dy };
    const newMirrorPlayerPos = { x: mirrorPlayerPos.x - dx, y: mirrorPlayerPos.y + dy };

    if (isWalkable(newPlayerPos, 'real') && isWalkable(newMirrorPlayerPos, 'mirror')) {
      setPlayerPos(newPlayerPos);
      setMoveHistory(prev => [...prev, moveName]);
    } else {
        toast({
            title: "Ouch!",
            description: "Movement blocked by an obstacle.",
            variant: "destructive"
        })
    }
  }, [playerPos, mirrorPlayerPos, isComplete, isWalkable, toast]);

  const handleRestart = useCallback(() => {
    setPlayerPos(level.playerStart);
    setIsComplete(false);
    setMoveHistory([]);
    onRestart();
  }, [level.playerStart, onRestart]);

  useEffect(() => {
    const goalReached = playerPos.x === level.goal.x && playerPos.y === level.goal.y;
    const mirrorGoalPos = { x: width - 1 - level.goal.x, y: level.goal.y };
    const mirrorGoalReached = mirrorPlayerPos.x === mirrorGoalPos.x && mirrorPlayerPos.y === mirrorGoalPos.y;

    if (goalReached && mirrorGoalReached && !isComplete) {
      setIsComplete(true);
      toast({
        title: 'Level Complete!',
        description: `You solved "${level.name}" in ${moveHistory.length + 1} moves.`,
      });
      setTimeout(onLevelComplete, 2000);
    }
  }, [playerPos, mirrorPlayerPos, level, isComplete, onLevelComplete, toast, moveHistory.length, width]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          handleMove(0, -1, 'Up');
          break;
        case 'ArrowDown':
        case 's':
          handleMove(0, 1, 'Down');
          break;
        case 'ArrowLeft':
        case 'a':
          handleMove(-1, 0, 'Left');
          break;
        case 'ArrowRight':
        case 'd':
          handleMove(1, 0, 'Right');
          break;
        case 'r':
          handleRestart();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleMove, handleRestart]);

  const getLevelDescriptionForAI = () => {
    let desc = `Grid is ${width}x${height}. Player starts at (${level.playerStart.x}, ${level.playerStart.y}). Goal is at (${level.goal.x}, ${level.goal.y}).\n`;
    desc += "Real world layout:\n";
    level.tiles.forEach((row, y) => {
      row.forEach((tile, x) => {
        if (tile === TileType.Wall) desc += `Wall at (${x},${y}). `;
        if (tile === TileType.Pit) desc += `Pit at (${x},${y}). `;
      });
    });
    return desc;
  }
  
  const getPlayerProgressForAI = () => {
    return `Player is currently at (${playerPos.x}, ${playerPos.y}). Moves made: ${moveHistory.join(', ') || 'None'}.`;
  }

  const renderGrid = (world: 'real' | 'mirror') => {
    const grid = [];
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let tileType = level.tiles[y][x];

        const isPlayer = (world === 'real' && x === playerPos.x && y === playerPos.y) ||
                         (world === 'mirror' && x === mirrorPlayerPos.x && y === mirrorPlayerPos.y);
        const isGoal = (world === 'real' && x === level.goal.x && y === level.goal.y) ||
                       (world === 'mirror' && x === width - 1 - level.goal.x && y === level.goal.y);

        if (isPlayer) {
          tileType = TileType.Player;
        } else if (isGoal) {
          tileType = TileType.Goal;
        }
        
        let finalType = tileType;
        const mirrorX = width - 1 - x;
        const correspondingTileInOtherWorld = level.tiles[y][mirrorX];
        
        if (world === 'mirror' && tileType === TileType.Empty && correspondingTileInOtherWorld === TileType.Pit) {
           finalType = TileType.Empty; // This should be a walkable path in the mirror world
        } else if (world === 'mirror' && tileType === TileType.Pit) {
           finalType = TileType.Empty; // Pits in real grid are empty in mirror
        } else if (world === 'real' && tileType === TileType.Empty && correspondingTileInOtherWorld === TileType.Pit) {
           finalType = TileType.Pit; // This is a pit in the real world
        }

        grid.push(<Tile key={`${world}-${x}-${y}`} type={finalType} world={world} />);
      }
    }
    return grid;
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 gap-4 bg-background">
       <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <Confetti active={isComplete} config={{
            angle: 90,
            spread: 360,
            startVelocity: 40,
            elementCount: 70,
            dragFriction: 0.12,
            duration: 3000,
            stagger: 3,
            width: "10px",
            height: "10px",
            perspective: "500px",
            colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"]
        }} />
      </div>

      <header className="w-full flex justify-between items-center px-4 md:px-8 py-2">
        <h1 className="text-xl md:text-2xl font-bold font-headline text-foreground">
          Level {level.id}: <span className="text-primary">{level.name}</span>
        </h1>
        <div className="text-lg text-muted-foreground">Moves: {moveHistory.length}</div>
      </header>

      <div className="w-full flex-grow flex flex-col md:flex-row gap-4 items-center justify-center">
        {/* Real World */}
        <div className="w-full md:w-1/2 max-w-2xl aspect-auto p-4 bg-secondary/50 rounded-lg shadow-lg">
          <h2 className="text-center font-bold mb-2 text-foreground/80">Real World</h2>
          <div
            className="grid gap-1"
            style={{ gridTemplateColumns: `repeat(${width}, 1fr)` }}
          >
            {renderGrid('real')}
          </div>
        </div>

        {/* Mirror World */}
        <div className="w-full md:w-1/2 max-w-2xl aspect-auto p-4 bg-secondary/50 rounded-lg shadow-lg">
           <h2 className="text-center font-bold mb-2 text-foreground/80">Mirror World</h2>
          <div
            className="grid gap-1"
            style={{ gridTemplateColumns: `repeat(${width}, 1fr)` }}
          >
            {renderGrid('mirror')}
          </div>
        </div>
      </div>
      
      <footer className="w-full flex flex-col md:flex-row justify-center items-center gap-4 py-2">
        <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={() => handleMove(-1, 0, 'Left')}><ArrowLeft /></Button>
            <div className="flex flex-col gap-2">
                <Button variant="outline" size="icon" onClick={() => handleMove(0, -1, 'Up')}><ArrowUp /></Button>
                <Button variant="outline" size="icon" onClick={() => handleMove(0, 1, 'Down')}><ArrowDown /></Button>
            </div>
            <Button variant="outline" size="icon" onClick={() => handleMove(1, 0, 'Right')}><ArrowRight /></Button>
        </div>
        <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={handleRestart}>
                <RotateCw />
                <span className="sr-only">Restart Level</span>
            </Button>
            <HintButton levelDescription={getLevelDescriptionForAI()} playerProgress={getPlayerProgressForAI()} />
            <SettingsDialog />
        </div>
      </footer>
    </div>
  );
}
