export interface Task {
  id: number
  text: string
  date: string
  time: string
  priority: 'high' | 'med' | 'low'
  done: boolean
}

export interface Settings {
  layout: 'compact' | 'calendar' | 'focus'
  accent: string
  showQuickNote: boolean
  fontSize: number
  notificationsEnabled: boolean
}

export interface ElectronAPI {
  tasks: {
    list(): Promise<Task[]>
    create(task: Omit<Task, 'id'>): Promise<Task>
    update(task: Partial<Task> & { id: number }): Promise<Task>
    delete(id: number): Promise<void>
  }
  note: {
    get(): Promise<string>
    set(content: string): Promise<void>
  }
  settings: {
    get(): Promise<Settings>
    update(settings: Partial<Settings>): Promise<Settings>
  }
  window: {
    hide(): Promise<void>
    resize(height: number): Promise<void>
    onShowSettings(cb: () => void): () => void
  }
}

declare global {
  interface Window {
    api: ElectronAPI
  }
}
