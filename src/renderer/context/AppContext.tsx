import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react'
import { Task, Settings } from '../lib/types'

interface AppState {
  tasks: Task[]
  note: string
  settings: Settings
  loading: boolean
}

interface AppActions {
  addTask(task: Omit<Task, 'id'>): Promise<void>
  updateTask(task: Partial<Task> & { id: number }): Promise<void>
  deleteTask(id: number): Promise<void>
  toggleTask(id: number): Promise<void>
  setNote(content: string): Promise<void>
  updateSettings(settings: Partial<Settings>): Promise<void>
}

const AppContext = createContext<(AppState & AppActions) | null>(null)

const DEFAULT_SETTINGS: Settings = {
  layout: 'focus',
  accent: '#5B7CF6',
  showQuickNote: true,
  fontSize: 13,
  notificationsEnabled: true
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [note, setNoteState] = useState('')
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [t, n, s] = await Promise.all([
        window.api.tasks.list(),
        window.api.note.get(),
        window.api.settings.get()
      ])
      // Convert done from number (SQLite) to boolean
      setTasks(t.map(task => ({ ...task, done: Boolean(task.done) })))
      setNoteState(n)
      setSettings(s)
      setLoading(false)
    }
    load()
  }, [])

  const addTask = useCallback(async (task: Omit<Task, 'id'>) => {
    const created = await window.api.tasks.create(task)
    setTasks(ts => [...ts, { ...created, done: Boolean(created.done) }])
  }, [])

  const updateTask = useCallback(async (task: Partial<Task> & { id: number }) => {
    const updated = await window.api.tasks.update(task)
    setTasks(ts => ts.map(t => t.id === updated.id ? { ...updated, done: Boolean(updated.done) } : t))
  }, [])

  const deleteTask = useCallback(async (id: number) => {
    await window.api.tasks.delete(id)
    setTasks(ts => ts.filter(t => t.id !== id))
  }, [])

  const toggleTask = useCallback(async (id: number) => {
    const task = tasks.find(t => t.id === id)
    if (!task) return
    const updated = await window.api.tasks.update({ id, done: !task.done })
    setTasks(ts => ts.map(t => t.id === id ? { ...updated, done: Boolean(updated.done) } : t))
  }, [tasks])

  const setNote = useCallback(async (content: string) => {
    setNoteState(content)
    await window.api.note.set(content)
  }, [])

  const updateSettings = useCallback(async (partial: Partial<Settings>) => {
    const updated = await window.api.settings.update(partial)
    setSettings(updated)
  }, [])

  return (
    <AppContext.Provider value={{
      tasks, note, settings, loading,
      addTask, updateTask, deleteTask, toggleTask, setNote, updateSettings
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
