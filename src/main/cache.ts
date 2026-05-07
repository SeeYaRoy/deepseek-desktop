import Database from 'better-sqlite3'
import { app } from 'electron'
import { join } from 'path'

let db: Database.Database | null = null

export interface ConversationMeta {
  id: string
  title: string
  updatedAt: number
  messageCount: number
}

function getDb(): Database.Database {
  if (!db) {
    const dbPath = join(app.getPath('userData'), 'conversations.db')
    db = new Database(dbPath)
    db.exec(`
      CREATE TABLE IF NOT EXISTS conversations (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        updated_at INTEGER NOT NULL,
        message_count INTEGER NOT NULL DEFAULT 0
      );
      CREATE INDEX IF NOT EXISTS idx_updated_at ON conversations(updated_at DESC);
    `)
  }
  return db
}

export function saveConversations(conversations: ConversationMeta[]): void {
  const database = getDb()
  const insert = database.prepare(`
    INSERT OR REPLACE INTO conversations (id, title, updated_at, message_count)
    VALUES (@id, @title, @updatedAt, @messageCount)
  `)

  const transaction = database.transaction((items: ConversationMeta[]) => {
    for (const item of items) {
      insert.run(item)
    }
  })

  transaction(conversations)
}

export function getConversations(): ConversationMeta[] {
  const database = getDb()
  const rows = database.prepare('SELECT * FROM conversations ORDER BY updated_at DESC').all()
  return (rows as Array<{ id: string; title: string; updated_at: number; message_count: number }>).map(
    (r) => ({
      id: r.id,
      title: r.title,
      updatedAt: r.updated_at,
      messageCount: r.message_count
    })
  )
}

export function clearCache(): void {
  const database = getDb()
  database.exec('DELETE FROM conversations')
}

export function closeCache(): void {
  if (db) {
    db.close()
    db = null
  }
}
