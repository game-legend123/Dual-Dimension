'use client';

import { Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { useState, useTransition } from 'react';
import { generateHintAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '../ui/skeleton';

type HintButtonProps = {
  levelDescription: string;
  playerProgress: string;
};

export function HintButton({ levelDescription, playerProgress }: HintButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hint, setHint] = useState('');
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleGetHint = () => {
    startTransition(async () => {
      const result = await generateHintAction({
        levelDescription,
        playerProgress,
      });
      if (result.error) {
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive',
        });
      } else {
        setHint(result.hint || '');
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Lightbulb />
          <span className="sr-only">Get a hint</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Need a hand?</DialogTitle>
          <DialogDescription>
            Stuck on this puzzle? Get a contextual hint from our AI game master.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {isPending ? (
             <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
            </div>
          ) : hint ? (
            <p className="text-accent-foreground/90 italic">"{hint}"</p>
          ) : (
            <p className="text-muted-foreground">Click the button below to generate a hint.</p>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
          <Button onClick={handleGetHint} disabled={isPending || !!hint}>
            {isPending ? 'Generating...' : 'Get Hint'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
