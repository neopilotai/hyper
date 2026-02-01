-- Terminal Copilot Database Schema
-- This schema is for SQLite (better-sqlite3) production deployment

-- Command history table
CREATE TABLE IF NOT EXISTS command_blocks (
  id TEXT PRIMARY KEY,
  command TEXT NOT NULL,
  output TEXT,
  exit_code INTEGER,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- AI suggestions cache table
CREATE TABLE IF NOT EXISTS ai_suggestions (
  id TEXT PRIMARY KEY,
  command_block_id TEXT NOT NULL,
  understanding TEXT NOT NULL,
  analysis TEXT NOT NULL,
  risk_assessment TEXT NOT NULL,
  confidence REAL NOT NULL,
  suggestions JSON NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (command_block_id) REFERENCES command_blocks(id) ON DELETE CASCADE
);

-- Search index
CREATE INDEX IF NOT EXISTS idx_command_blocks_command ON command_blocks(command);
CREATE INDEX IF NOT EXISTS idx_command_blocks_timestamp ON command_blocks(timestamp);
CREATE INDEX IF NOT EXISTS idx_ai_suggestions_command_block_id ON ai_suggestions(command_block_id);
