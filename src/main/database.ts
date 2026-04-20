import initSqlJs, { Database as SqlJsDatabase } from 'sql.js'
import { app } from 'electron'
import { join } from 'path'
import { readFileSync, writeFileSync, existsSync } from 'fs'

let db: SqlJsDatabase

const SCHEMA = `
CREATE TABLE IF NOT EXISTS tasks (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  text       TEXT NOT NULL,
  date       TEXT NOT NULL,
  time       TEXT NOT NULL DEFAULT '',
  priority   TEXT NOT NULL DEFAULT 'med',
  done       INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS notes (
  id      INTEGER PRIMARY KEY CHECK (id = 1),
  content TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS settings (
  id                    INTEGER PRIMARY KEY CHECK (id = 1),
  layout                TEXT NOT NULL DEFAULT 'focus',
  accent                TEXT NOT NULL DEFAULT '#5B7CF6',
  show_quick_note       INTEGER NOT NULL DEFAULT 1,
  font_size             REAL NOT NULL DEFAULT 13,
  notifications_enabled INTEGER NOT NULL DEFAULT 1
);

INSERT OR IGNORE INTO notes (id, content) VALUES (1, '');
INSERT OR IGNORE INTO settings (id, layout, accent, show_quick_note, font_size, notifications_enabled)
  VALUES (1, 'focus', '#5B7CF6', 1, 13, 1);
`

function getDbPath(): string {
  return join(app.getPath('userData'), 'tray-todo.db')
}

function save(): void {
  const data = db.export()
  writeFileSync(getDbPath(), Buffer.from(data))
}

export async function initDatabase(): Promise<void> {
  const SQL = await initSqlJs()
  const dbPath = getDbPath()

  if (existsSync(dbPath)) {
    const fileBuffer = readFileSync(dbPath)
    db = new SQL.Database(fileBuffer)
  } else {
    db = new SQL.Database()
  }

  db.run(SCHEMA)
  // Migration: add notifications_enabled if missing (existing databases)
  try {
    db.run('ALTER TABLE settings ADD COLUMN notifications_enabled INTEGER NOT NULL DEFAULT 1')
  } catch {
    // Column already exists
  }
  save()
}

// --- Tasks ---

export interface TaskRow {
  id: number
  text: string
  date: string
  time: string
  priority: string
  done: number
}

export function listTasks(): TaskRow[] {
  const stmt = db.prepare('SELECT id, text, date, time, priority, done FROM tasks ORDER BY date, time')
  const results: TaskRow[] = []
  while (stmt.step()) {
    results.push(stmt.getAsObject() as unknown as TaskRow)
  }
  stmt.free()
  return results
}

export function createTask(task: Omit<TaskRow, 'id'>): TaskRow {
  db.run(
    'INSERT INTO tasks (text, date, time, priority, done) VALUES (?, ?, ?, ?, ?)',
    [task.text, task.date, task.time, task.priority, task.done]
  )
  const id = db.exec('SELECT last_insert_rowid() as id')[0].values[0][0] as number
  save()
  return { id, ...task }
}

export function updateTask(id: number, fields: Partial<Omit<TaskRow, 'id'>>): TaskRow | null {
  const sets: string[] = []
  const values: (string | number)[] = []

  if (fields.text !== undefined) { sets.push('text = ?'); values.push(fields.text) }
  if (fields.date !== undefined) { sets.push('date = ?'); values.push(fields.date) }
  if (fields.time !== undefined) { sets.push('time = ?'); values.push(fields.time) }
  if (fields.priority !== undefined) { sets.push('priority = ?'); values.push(fields.priority) }
  if (fields.done !== undefined) { sets.push('done = ?'); values.push(fields.done) }

  if (sets.length === 0) return null

  sets.push("updated_at = datetime('now')")
  values.push(id)

  db.run(`UPDATE tasks SET ${sets.join(', ')} WHERE id = ?`, values)
  save()

  const stmt = db.prepare('SELECT id, text, date, time, priority, done FROM tasks WHERE id = ?')
  stmt.bind([id])
  let result: TaskRow | null = null
  if (stmt.step()) {
    result = stmt.getAsObject() as unknown as TaskRow
  }
  stmt.free()
  return result
}

export function deleteTask(id: number): void {
  db.run('DELETE FROM tasks WHERE id = ?', [id])
  save()
}

// --- Notes ---

export function getNote(): string {
  const result = db.exec('SELECT content FROM notes WHERE id = 1')
  return result.length > 0 ? (result[0].values[0][0] as string) : ''
}

export function setNote(content: string): void {
  db.run('UPDATE notes SET content = ? WHERE id = 1', [content])
  save()
}

// --- Settings ---

export interface SettingsRow {
  layout: string
  accent: string
  show_quick_note: number
  font_size: number
  notifications_enabled: number
}

export function getSettings(): SettingsRow {
  const result = db.exec('SELECT layout, accent, show_quick_note, font_size, notifications_enabled FROM settings WHERE id = 1')
  if (result.length === 0) {
    return { layout: 'focus', accent: '#5B7CF6', show_quick_note: 1, font_size: 13, notifications_enabled: 1 }
  }
  const row = result[0].values[0]
  return {
    layout: row[0] as string,
    accent: row[1] as string,
    show_quick_note: row[2] as number,
    font_size: row[3] as number,
    notifications_enabled: row[4] as number
  }
}

export function updateSettings(fields: Partial<SettingsRow>): SettingsRow {
  const sets: string[] = []
  const values: (string | number)[] = []

  if (fields.layout !== undefined) { sets.push('layout = ?'); values.push(fields.layout) }
  if (fields.accent !== undefined) { sets.push('accent = ?'); values.push(fields.accent) }
  if (fields.show_quick_note !== undefined) { sets.push('show_quick_note = ?'); values.push(fields.show_quick_note) }
  if (fields.font_size !== undefined) { sets.push('font_size = ?'); values.push(fields.font_size) }
  if (fields.notifications_enabled !== undefined) { sets.push('notifications_enabled = ?'); values.push(fields.notifications_enabled) }

  if (sets.length > 0) {
    db.run(`UPDATE settings SET ${sets.join(', ')} WHERE id = 1`, values)
    save()
  }

  return getSettings()
}
