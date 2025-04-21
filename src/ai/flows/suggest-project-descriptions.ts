// Use server directive is required for all Genkit flows.
'use server';

/**
 * @fileOverview This file contains the Genkit flow for suggesting improved project descriptions using AI.
 *
 * It takes a list of project descriptions as input and returns a list of AI-suggested improvements for each project description.
 *
 * - suggestProjectDescriptions - The main function to trigger the project description improvement flow.
 * - SuggestProjectDescriptionsInput - The input type for the suggestProjectDescriptions function.
 * - SuggestProjectDescriptionsOutput - The output type for the suggestProjectDescriptions function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const SuggestProjectDescriptionsInputSchema = z.object({
  projectDescriptions: z
    .array(z.string())
    .describe('A list of project descriptions to improve.'),
});
export type SuggestProjectDescriptionsInput = z.infer<
  typeof SuggestProjectDescriptionsInputSchema
>;

const SuggestProjectDescriptionsOutputSchema = z.object({
  improvedProjectDescriptions: z
    .array(z.string())
    .describe('A list of AI-suggested improvements for each project description.'),
});
export type SuggestProjectDescriptionsOutput = z.infer<
  typeof SuggestProjectDescriptionsOutputSchema
>;

export async function suggestProjectDescriptions(
  input: SuggestProjectDescriptionsInput
): Promise<SuggestProjectDescriptionsOutput> {
  return suggestProjectDescriptionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestProjectDescriptionsPrompt',
  input: {
    schema: z.object({
      projectDescriptions: z
        .array(z.string())
        .describe('A list of project descriptions to improve.'),
    }),
  },
  output: {
    schema: z.object({
      improvedProjectDescriptions: z
        .array(z.string())
        .describe('A list of AI-suggested improvements for each project description.'),
    }),
  },
  prompt: `You are an AI assistant specialized in improving project descriptions for portfolios.

  Given the following project descriptions, suggest improvements to make them more effective at showcasing accomplishments and skills.

  Project Descriptions:
  {{#each projectDescriptions}}
  - {{{this}}}
  {{/each}}

  Please provide a list of improved project descriptions, one for each original description.
  `,
});

const suggestProjectDescriptionsFlow = ai.defineFlow<
  typeof SuggestProjectDescriptionsInputSchema,
  typeof SuggestProjectDescriptionsOutputSchema
>({
  name: 'suggestProjectDescriptionsFlow',
  inputSchema: SuggestProjectDescriptionsInputSchema,
  outputSchema: SuggestProjectDescriptionsOutputSchema,
},
async input => {
  const {output} = await prompt(input);
  return output!;
});
