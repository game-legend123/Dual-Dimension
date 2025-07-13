'use server';

import { getLevelHint, LevelHintInput } from '@/ai/flows/level-hint';
import { z } from 'zod';

const actionSchema = z.object({
  levelDescription: z.string(),
  playerProgress: z.string(),
});

export async function generateHintAction(input: LevelHintInput) {
  const parsedInput = actionSchema.safeParse(input);
  if (!parsedInput.success) {
    return { error: 'Invalid input.' };
  }

  try {
    const result = await getLevelHint(parsedInput.data);
    return { hint: result.hint };
  } catch (e) {
    console.error(e);
    return { error: 'Failed to generate hint. Please try again.' };
  }
}
