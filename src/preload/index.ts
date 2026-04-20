import { contextBridge, ipcRenderer } from 'electron'

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
}

const api = {
  tasks: {
    list: (): Promise<Task[]> => ipcRenderer.invoke('tasks:list'),
    create: (task: Omit<Task, 'id'>): Promise<Task> => ipcRenderer.invoke('tasks:create', task),
    update: (task: Partial<Task> & { id: number }): Promise<Task> => ipcRenderer.invoke('tasks:update', task),
    delete: (id: number): Promise<void> => ipcRenderer.invoke('tasks:delete', { id })
  },
  note: {
    get: (): Promise<string> => ipcRenderer.invoke('note:get'),
    set: (content: string): Promise<void> => ipcRenderer.invoke('note:set', { content })
  },
  settings: {
    get: (): Promise<Settings> => ipcRenderer.invoke('settings:get'),
    update: (settings: Partial<Settings>): Promise<Settings> => ipcRenderer.invoke('settings:update', settings)
  },
  window: {
    hide: (): Promise<void> => ipcRenderer.invoke('window:hide')
  }
}

contextBridge.exposeInMainWorld('api', api)
