'use client';

import { Gameboard } from '@/components/game/Gameboard';
import { levels } from '@/lib/levels';
import { notFound, useRouter, useParams } from 'next/navigation';
import { useCallback, useState, useMemo } from 'react';

export default function GamePage() {
  const router = useRouter();
  const params = useParams();
  const levelId = parseInt(params.level as string, 10);

  const [currentLevelId, setCurrentLevelId] = useState(levelId);

  const level = useMemo(() => levels.find(l => l.id === currentLevelId), [currentLevelId]);

  const handleLevelComplete = useCallback(() => {
    const nextLevelId = currentLevelId + 1;
    const nextLevelExists = levels.some(l => l.id === nextLevelId);
    if (nextLevelExists) {
      setCurrentLevelId(nextLevelId);
      router.push(`/game/${nextLevelId}`);
    } else {
      router.push('/'); // Or a "You Win!" page
    }
  }, [currentLevelId, router]);
  
  const handleRestart = useCallback(() => {
    // This function is just to satisfy the prop,
    // the restart logic is handled inside Gameboard.
  }, []);

  if (isNaN(levelId) || !level) {
    return notFound();
  }

  return (
    <main className="w-screen h-screen">
      <Gameboard 
        key={level.id}
        initialLevel={level} 
        onLevelComplete={handleLevelComplete}
        onRestart={handleRestart}
      />
    </main>
  );
}
