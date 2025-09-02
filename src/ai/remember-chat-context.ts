'use server';

/**
 * @fileOverview An AI agent that remembers the chat context for Nyanszia.
 *
 * - rememberChatContext - A function that handles the chat context remembering process.
 * - RememberChatContextInput - The input type for the rememberChatContext function.
 * - RememberChatContextOutput - The return type for the rememberChatContext function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const RememberChatContextInputSchema = z.object({
  messageHistory: z.string().describe('The message history of the conversation.'),
  newMessage: z.string().describe('The latest message from the user.'),
});
export type RememberChatContextInput = z.infer<typeof RememberChatContextInputSchema>;

const RememberChatContextOutputSchema = z.object({
  updatedContext: z.string().describe('The updated context of the conversation.'),
});
export type RememberChatContextOutput = z.infer<typeof RememberChatContextOutputSchema>;

export async function rememberChatContext(input: RememberChatContextInput): Promise<RememberChatContextOutput> {
  return rememberChatContextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'rememberChatContextPrompt',
  input: {
    schema: z.object({
      messageHistory: z.string().describe('The message history of the conversation.'),
      newMessage: z.string().describe('The latest message from the user.'),
    }),
  },
  output: {
    schema: z.object({
      updatedContext: z.string().describe('The updated context of the conversation.'),
    }),
  },
  prompt: `You are Nyanszia, a tsundere-style AI companion.  Remember the previous chat history with the user to stay in character and give relevant responses.

Previous message history: {{{messageHistory}}}

New message from user: {{{newMessage}}}

Updated context: `,
});

const rememberChatContextFlow = ai.defineFlow<
  typeof RememberChatContextInputSchema,
  typeof RememberChatContextOutputSchema
>({
  name: 'rememberChatContextFlow',
  inputSchema: RememberChatContextInputSchema,
  outputSchema: RememberChatContextOutputSchema,
}, async input => {
  const {output} = await prompt(input);
  return output!;
});
