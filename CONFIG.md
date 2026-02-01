# Terminal Copilot - Configuration Guide

## Environment Variables

Terminal Copilot uses the Vercel AI Gateway by default, which means no explicit API key setup is required for OpenAI. However, here are all configurable options:

### Required (Optional - Uses Defaults)
None required! The app works out of the box.

### Optional
```env
# API Gateway Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000

# For production deployment to Vercel
# The Vercel AI Gateway is automatically configured
# No additional setup needed
```

## Vercel Deployment Setup

### 1. Connect to Vercel
```bash
vercel link
```

### 2. Deploy
```bash
vercel deploy --prod
```

The app will automatically use Vercel's AI Gateway with OpenAI integration.

## Local Development Setup

### 1. Prerequisites
- Node.js 18+ 
- npm or yarn

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```

Server runs at `http://localhost:3000`

### 4. Build for Production
```bash
npm run build
npm start
```

## Feature Configuration

### AI Model Selection

To change the AI model, edit `/lib/ai.ts`:

```typescript
// Current model
model: 'openai/gpt-4-turbo'

// Change to:
model: 'openai/gpt-4'           // Standard GPT-4
model: 'openai/gpt-4o'          // GPT-4o Optimized
model: 'anthropic/claude-opus'  // Claude (if enabled)
```

### Database Configuration

#### In-Memory (Current)
- Commands stored in memory only
- Clears on server restart
- Good for development/testing

#### SQLite (Production)
To enable SQLite persistence:

1. Install dependency:
```bash
npm install better-sqlite3
```

2. Create database file:
```bash
sqlite3 terminal-copilot.db < scripts/init-db.sql
```

3. Update `/lib/db.ts` to use SQLite instead of in-memory store

#### PostgreSQL/Neon (Advanced)
See comments in `/lib/db.ts` for PostgreSQL adapter pattern.

### History Limits

Edit `/lib/db.ts`:

```typescript
// Change memory limit
if (commandHistory.length > 500) {  // Was 1000
  commandHistory = commandHistory.slice(0, 500);
}

// Change API result limit
GET /api/history?limit=100  // Maximum 1000
```

### Terminal Appearance

Edit `/components/terminal.tsx` to customize:

```typescript
// Theme colors
const theme = {
  background: '#0a0e27',    // Dark background
  foreground: '#e0e0e0',    // Text color
  cursor: '#4169e1',        // Cursor color
  selection: 'rgba(65, 105, 225, 0.3)',
};

// Font settings
fontFamily: 'Courier New, monospace',
fontSize: 14,
lineHeight: 1.5,
```

### AI Suggestion Settings

Edit `/lib/ai.ts`:

```typescript
// System prompt (controls AI behavior)
const systemPrompt = `You are an expert terminal assistant...`;

// Confidence threshold (0-1)
confidence: 0.85  // Only show suggestions above 85% confidence

// Command analysis depth (in prompt)
// Modify userPrompt to ask for more/less detail
```

### Risk Assessment Configuration

Edit `/lib/command.ts`:

```typescript
// Add dangerous commands
const DANGEROUS_COMMANDS = [
  'rm -rf',
  'mkfs',
  'dd if=',
  'your-command-here',  // Add new dangerous patterns
];

// Add safe commands
const SAFE_COMMAND_PATTERNS = [
  /^ls/,
  /^your-pattern/,  // Add new safe patterns
];
```

## Performance Tuning

### API Response Caching
To cache AI suggestions, add to `/app/api/ai/suggestions/route.ts`:

```typescript
export async function POST(request: Request) {
  // ...
  const response = Response.json(formattedSuggestion);
  
  // Add caching header
  response.headers.set('Cache-Control', 'max-age=3600');
  
  return response;
}
```

### Component Optimization
Terminal component uses React hooks without memoization. To optimize:

```typescript
// In page.tsx
const handleCommandInput = useCallback(async (command: string) => {
  // Already using useCallback
}, []);

// Use React.memo for components
export const TerminalComponent = React.memo(TerminalComponent);
```

### Database Indexing (SQLite)
Already configured in `/scripts/init-db.sql`:

```sql
CREATE INDEX idx_command_blocks_command ON command_blocks(command);
CREATE INDEX idx_command_blocks_timestamp ON command_blocks(timestamp);
```

## Security Configuration

### CORS Setup
For production, configure CORS in `middleware.ts`:

```typescript
export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  response.headers.set(
    'Access-Control-Allow-Origin',
    process.env.ALLOWED_ORIGINS || 'https://yourdomain.com'
  );
  
  return response;
}
```

### API Rate Limiting
To add rate limiting, install:

```bash
npm install @vercel/kv
```

Then add to API routes:

```typescript
import { Ratelimit } from '@vercel/kv';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 h'),
});

export async function POST(request: Request) {
  const { success } = await ratelimit.limit('api');
  if (!success) {
    return Response.json({ error: 'Rate limited' }, { status: 429 });
  }
  // ... rest of handler
}
```

### Input Validation
Already implemented in API routes. To add stricter validation:

```typescript
import { z } from 'zod';

const commandSchema = z.object({
  command: z.string().min(1).max(1000),
  context: z.string().max(500).optional(),
});

// In route handler
const { command, context } = commandSchema.parse(await request.json());
```

## Monitoring & Logging

### Application Logging
Add Winston logger:

```bash
npm install winston
```

Configure in `/lib/logger.ts`:

```typescript
import winston from 'winston';

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
  ],
});
```

### Error Tracking
Add Sentry:

```bash
npm install @sentry/nextjs
```

Initialize in `app/layout.tsx`:

```typescript
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

## Deployment Checklist

- [ ] Environment variables configured
- [ ] Database initialized (if using SQLite)
- [ ] API routes tested in production mode
- [ ] CORS configured for domain
- [ ] Rate limiting enabled
- [ ] Error tracking set up
- [ ] Monitoring configured
- [ ] Security headers set
- [ ] SSL/HTTPS enforced
- [ ] API keys rotated
- [ ] Backup strategy in place
