import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    if (limit < 1 || limit > 1000) {
      return Response.json(
        { error: 'Limit must be between 1 and 1000' },
        { status: 400 }
      );
    }

    const history = await db.getCommandHistory(limit);

    return Response.json(history);
  } catch (error) {
    console.error('[v0] Error in history route:', error);
    return Response.json(
      { error: 'Failed to fetch command history' },
      { status: 500 }
    );
  }
}
