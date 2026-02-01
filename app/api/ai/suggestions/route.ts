import { generateAISuggestions, formatAISuggestion } from '@/lib/ai';
import { validateCommand } from '@/lib/command';

export async function POST(request: Request) {
  try {
    const { command, context } = await request.json();

    if (!command || typeof command !== 'string' || command.trim().length === 0) {
      return Response.json(
        { error: 'Command is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    if (command.length > 1000) {
      return Response.json(
        { error: 'Command is too long (max 1000 characters)' },
        { status: 400 }
      );
    }

    // Validate command before sending to AI
    const validation = validateCommand(command);

    // Generate AI suggestions using AI SDK 6
    const aiSuggestions = await generateAISuggestions(command, context);

    // Format the response with ID
    const formattedSuggestion = formatAISuggestion(aiSuggestions);

    return Response.json(formattedSuggestion);
  } catch (error) {
    console.error('[v0] Error in AI suggestions route:', error);
    return Response.json(
      { error: 'Failed to generate AI suggestions. Please try again.' },
      { status: 500 }
    );
  }
}
