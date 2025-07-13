// 'use server';
/**
 * @fileOverview Provides level hints to players who are stuck.
 *
 * - getLevelHint - A function that provides a hint for a specific level.
 * - LevelHintInput - The input type for the getLevelHint function.
 * - LevelHintOutput - The return type for the getLevelHint function.
 */

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const LevelHintInputSchema = z.object({
  levelDescription: z
    .string()
    .describe('A detailed description of the current level, including layout, obstacles, and player starting positions.'),
  playerProgress: z
    .string()
    .optional()
    .describe('A description of what the player has tried so far and what obstacles they are currently facing.'),
});
export type LevelHintInput = z.infer<typeof LevelHintInputSchema>;

const LevelHintOutputSchema = z.object({
  hint: z.string().describe('A contextual hint to help the player overcome the current level.'),
});
export type LevelHintOutput = z.infer<typeof LevelHintOutputSchema>;

export async function getLevelHint(input: LevelHintInput): Promise<LevelHintOutput> {
  return levelHintFlow(input);
}

const levelHintPrompt = ai.definePrompt({
  name: 'levelHintPrompt',
  input: {schema: LevelHintInputSchema},
  output: {schema: LevelHintOutputSchema},
  prompt: `You are an expert game designer, skilled at creating challenging but fair puzzles.

  A player is stuck on a level in the game "Dual Dimension".  The game involves controlling two characters simultaneously in mirrored dimensions. The goal is to get both characters to their respective endpoints at the same time.

  Provide a hint to help the player complete the level, taking into account their progress so far.

  Level Description: {{{levelDescription}}}
  Player Progress: {{{playerProgress}}}

  Focus on a single, specific suggestion rather than a broad overview.
  Be concise.
  Do not give away the solution entirely, but nudge the player in the right direction.
  Ensure that the hint is applicable to both characters in their respective dimensions.
`,
});

const levelHintFlow = ai.defineFlow(
  {
    name: 'levelHintFlow',
    inputSchema: LevelHintInputSchema,
    outputSchema: LevelHintOutputSchema,
  },
  async input => {
    const {output} = await levelHintPrompt(input);
    return output!;
  }
);
