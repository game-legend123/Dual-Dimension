import { cn } from '@/lib/utils';
import { TileType } from '@/types/game';
import { Flame, MoveUp, User, Vote } from 'lucide-react';

interface TileProps {
  type: TileType;
  world: 'real' | 'mirror';
}

const PlayerIcon = () => (
    <div className="w-full h-full rounded-md bg-primary flex items-center justify-center transition-all duration-300">
        <User className="w-1/2 h-1/2 text-primary-foreground" />
    </div>
);

const GoalIcon = () => (
    <div className="w-full h-full flex items-center justify-center">
        <Flame className="w-2/3 h-2/3 text-accent" />
    </div>
);

const WallBlock = () => (
    <div className="w-full h-full rounded-md bg-secondary transition-all duration-300" />
);

const PitBlock = () => (
    <div className="w-full h-full rounded-md bg-black transition-all duration-300" />
);


export function Tile({ type, world }: TileProps) {
  let content = null;
  switch (type) {
    case TileType.Player:
      content = <PlayerIcon />;
      break;
    case TileType.Goal:
      content = <GoalIcon />;
      break;
    case TileType.Wall:
      content = <WallBlock />;
      break;
    case TileType.Pit:
      // A pit in the real world is a wall in the mirror world, and vice-versa
      content = world === 'real' ? <PitBlock /> : <WallBlock />;
      break;
    default:
      content = null;
  }

  return (
    <div className="aspect-square w-full h-full flex items-center justify-center transition-all duration-200">
      {content}
    </div>
  );
}
