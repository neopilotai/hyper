/**
 * AI Integration module for Terminal Copilot
 * Handles communication with OpenAI for command suggestions using AI SDK 6
 */

import { generateText, Output } from 'ai';
import { z } from 'zod';

// Schema for AI-generated suggestions (using AI SDK 6 Output.object pattern)
export const suggestionSchema = z.object({
  understanding: z.string().describe('Understanding of what the user is trying to do'),
  analysis: z.string().describe('Analysis of the command and its implications'),
  suggestions: z.array(
    z.object({
      command: z.string().describe('Suggested command'),
      explanation: z.string().describe('Why this command is suggested'),
      riskLevel: z.enum(['safe', 'warning', 'dangerous']).describe('Risk level of executing this command'),
      category: z.string().describe('Category of the command (e.g., file, system, network)'),
    })
  ).describe('Array of suggested commands'),
  riskAssessment: z.string().describe('Overall risk assessment of the original command'),
  confidence: z.number().min(0).max(1).describe('Confidence score of the suggestion'),
});

export type AISuggestionSchema = z.infer<typeof suggestionSchema>;

export async function generateAISuggestions(
  command: string,
  context?: string
): Promise<AISuggestionSchema> {
  try {
    const systemPrompt = `You are an expert terminal assistant that helps users write better commands. 
When given a terminal command, you should:
1. Understand what the user is trying to accomplish
2. Analyze the command for potential issues or improvements
3. Suggest better alternatives if needed
4. Assess the risk level of executing the command
5. Provide explanations for each suggestion

Always prioritize safety and clarity. When a command could be dangerous, clearly mark it and explain the risks.
Return your analysis in the specified JSON format.`;

    const userPrompt = `Analyze this terminal command and provide suggestions:

Command: ${command}
${context ? `Context: ${context}` : ''}

Provide structured suggestions with risk assessments and explanations.`;

    const result = await generateText({
      model: 'openai/gpt-4-turbo',
      system: systemPrompt,
      prompt: userPrompt,
      output: Output.object({ schema: suggestionSchema }),
    });

    // Extract the object from the result
    const suggestion = result.object as AISuggestionSchema;
    return suggestion;
  } catch (error) {
    console.error('[v0] Error generating AI suggestions:', error);
    throw new Error('Failed to generate AI suggestions');
  }
}

export function formatAISuggestion(suggestion: AISuggestionSchema) {
  return {
    id: Math.random().toString(36).substr(2, 9),
    ...suggestion,
  };
}
