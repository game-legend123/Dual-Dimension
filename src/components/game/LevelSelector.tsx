import { levels } from '@/lib/levels';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Lock } from 'lucide-react';

const difficultyColors = {
  Easy: 'text-green-400',
  Medium: 'text-yellow-400',
  Hard: 'text-red-400',
};

export function LevelSelector() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold font-headline bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
          Dual Dimension
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Control two characters at once in mirrored worlds. Reach the goals simultaneously to restore balance to the universe.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {levels.map((level) => (
          <Link href={`/game/${level.id}`} key={level.id} passHref>
            <Card className="h-full flex flex-col hover:border-primary hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 transform hover:-translate-y-1">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardDescription>Level {level.id}</CardDescription>
                    <CardTitle>{level.name}</CardTitle>
                  </div>
                  <span className={`font-semibold ${difficultyColors[level.difficulty]}`}>
                    {level.difficulty}
                  </span>
                </div>
              </CardHeader>
              <div className="flex-grow" />
              <CardFooter>
                 <Button className="w-full">
                    Start Level <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </Link>
        ))}
         <Card className="h-full flex flex-col bg-secondary/50 border-dashed">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardDescription>Coming Soon</CardDescription>
                    <CardTitle>The Gauntlet</CardTitle>
                  </div>
                  <span className="font-semibold text-purple-400">
                    Expert
                  </span>
                </div>
              </CardHeader>
               <div className="flex-grow p-6 pt-0 text-muted-foreground flex items-center justify-center">
                    <Lock className="w-16 h-16"/>
                </div>
              <CardFooter>
                 <Button className="w-full" disabled>
                    Locked
                </Button>
              </CardFooter>
            </Card>
      </div>
    </div>
  );
}
