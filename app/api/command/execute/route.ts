import { validateCommand } from '@/lib/command';
import { ExecutionResult } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const { command } = await request.json();

    if (!command || typeof command !== 'string') {
      return Response.json(
        { error: 'Command is required and must be a string' },
        { status: 400 }
      );
    }

    // Validate command safety
    const validation = validateCommand(command);

    if (validation.riskLevel === 'dangerous') {
      return Response.json(
        { error: 'This command is too dangerous to execute', riskLevel: validation.riskLevel },
        { status: 403 }
      );
    }

    // Placeholder for actual command execution
    // In a real implementation, this would execute the command in a sandboxed environment
    const result: ExecutionResult = {
      exitCode: 0,
      stdout: `Executed: ${command}`,
      stderr: '',
      duration: 100,
    };

    return Response.json({
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      command,
      output: result.stdout,
      exitCode: result.exitCode,
    });
  } catch (error) {
    console.error('[v0] Error in command execution route:', error);
    return Response.json(
      { error: 'Failed to execute command' },
      { status: 500 }
    );
  }
}
