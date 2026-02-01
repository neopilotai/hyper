# Terminal Copilot

An AI-powered terminal assistant that helps you write better commands with intelligent suggestions and command history tracking.

## Features

- **Interactive Terminal**: Web-based terminal interface with command input and history
- **AI Suggestions**: Get intelligent command suggestions powered by OpenAI GPT-4 Turbo
- **Command Analysis**: Understand what your commands do and their risk levels
- **History Management**: Track command history with search and replay capabilities
- **Risk Assessment**: Automatic safety checks to prevent dangerous command execution
- **Command Search**: Full-text search across command history
- **Responsive Design**: Works on desktop and tablet devices

## Getting Started

### Prerequisites

- Node.js 18+ (for development)
- Vercel account (for deployment)

### Installation

1. Clone or download this repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables in your `.env.local`:
   ```env
   # Vercel AI Gateway (required)
   # No explicit API key needed - uses Vercel's default gateway
   ```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building

```bash
npm run build
npm start
```

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── ai/
│   │   │   └── suggestions/route.ts    # AI suggestion generation
│   │   ├── command/
│   │   │   └── execute/route.ts        # Command execution
│   │   └── history/
│   │       ├── route.ts                # History retrieval
│   │       └── search/route.ts         # History search
│   ├── actions/
│   │   └── db-actions.ts               # Server actions for DB operations
│   ├── layout.tsx                      # Root layout
│   └── page.tsx                        # Main application page
├── components/
│   ├── terminal.tsx                    # Terminal UI component
│   ├── ai-suggestion-panel.tsx         # AI suggestions display
│   ├── command-history-enhanced.tsx    # Enhanced history with search
│   ├── command-history.tsx             # Basic history component
│   └── command-search.tsx              # Search functionality
├── lib/
│   ├── types.ts                        # TypeScript type definitions
│   ├── ai.ts                           # AI integration (Vercel AI SDK)
│   ├── command.ts                      # Command validation and parsing
│   ├── db.ts                           # Database operations
│   ├── store.ts                        # State management
│   └── api-client.ts                   # API utilities
└── scripts/
    └── init-db.sql                     # SQLite schema (production)
```

## How It Works

1. **Command Input**: Type commands in the terminal interface
2. **AI Analysis**: Commands are sent to OpenAI GPT-4 Turbo for analysis
3. **Suggestions**: Get structured suggestions with:
   - Understanding: What the command does
   - Analysis: Potential issues or improvements
   - Risk Assessment: Safety rating
   - Suggested Commands: Better alternatives if applicable
4. **History**: Commands are stored and searchable
5. **Replay**: Re-run previous commands or modifications

## Technology Stack

- **Frontend**: React 19, Next.js 16 with App Router
- **AI**: Vercel AI SDK 6 with OpenAI GPT-4 Turbo
- **Database**: In-memory store (upgradeable to SQLite with better-sqlite3)
- **Styling**: Tailwind CSS
- **Type Safety**: TypeScript
- **Icons**: Lucide React

## API Endpoints

### POST `/api/ai/suggestions`
Generate AI suggestions for a command.

**Request:**
```json
{
  "command": "rm -rf /",
  "context": "Optional context about what you're trying to do"
}
```

**Response:**
```json
{
  "id": "abc123",
  "understanding": "...",
  "analysis": "...",
  "suggestions": [...],
  "riskAssessment": "...",
  "confidence": 0.95
}
```

### POST `/api/command/execute`
Execute a command (with safety checks).

**Request:**
```json
{
  "command": "ls -la"
}
```

### GET `/api/history?limit=50`
Get command history.

### GET `/api/history/search?q=query`
Search command history.

## Configuration

### Environment Variables

- `NEXT_PUBLIC_API_URL`: Base URL for API calls (optional)

### Customization

Edit the following files to customize:

- **Colors**: Update Tailwind theme in `tailwind.config.ts`
- **Terminal Theme**: Modify terminal colors in `components/terminal.tsx`
- **AI Model**: Change model in `lib/ai.ts` (line with `openai/gpt-4-turbo`)
- **History Limit**: Adjust in `lib/db.ts`

## Safety Features

- **Command Validation**: Dangerous commands are identified and flagged
- **Risk Levels**: Commands are rated as safe, warning, or dangerous
- **Execution Prevention**: Dangerous commands cannot be executed
- **Confirmation**: Users must review suggestions before running commands

## Future Enhancements

- SQLite persistence with better-sqlite3
- Authentication and multi-user support
- Command output caching
- Advanced analytics and command patterns
- Shell integration (browser extension)
- Mobile app support
- Collaborative command sharing

## Troubleshooting

### AI suggestions not working
- Verify API key is set up in Vercel environment
- Check network tab in browser dev tools
- Ensure command length is under 1000 characters

### Terminal not responding
- Refresh the page
- Check browser console for errors
- Clear browser cache

### Search not finding results
- Ensure search query matches command exactly
- Search is case-insensitive
- Try shorter search terms

## License

MIT

## Support

For issues or questions, please open an issue in the repository.
