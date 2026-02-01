import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.trim().length === 0) {
      return Response.json(
        { error: 'Search query is required' },
        { status: 400 }
      );
    }

    if (query.length > 500) {
      return Response.json(
        { error: 'Search query is too long' },
        { status: 400 }
      );
    }

    const results = await db.searchCommands(query);

    return Response.json(results);
  } catch (error) {
    console.error('[v0] Error in history search route:', error);
    return Response.json(
      { error: 'Failed to search command history' },
      { status: 500 }
    );
  }
}
