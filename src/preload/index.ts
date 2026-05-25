import { contextBridge, ipcRenderer } from 'electron'

// Custom APIs for renderer
const api = {
  auth: {
    login: (email, password) => ipcRenderer.invoke('auth:login', { email, password }),
    register: (email, password, name) => ipcRenderer.invoke('auth:register', { email, password, name }),
    verifyToken: (token) => ipcRenderer.invoke('auth:verifyToken', { token }),
    googleSignIn: () => ipcRenderer.invoke('auth:googleSignIn'),
    requestPasswordReset: (email) => ipcRenderer.invoke('auth:requestPasswordReset', { email }),
    resendPasswordReset: (email) => ipcRenderer.invoke('auth:resendPasswordReset', { email }),
    resetPassword: (token, newPassword) => ipcRenderer.invoke('auth:resetPassword', { token, newPassword })
  },
  todo: {
    create: (payload) => ipcRenderer.invoke('todo:create', payload),
    list: (options) => ipcRenderer.invoke('todo:list', options),
    update: (todoId, updates, userId) => ipcRenderer.invoke('todo:update', { todoId, updates, userId }),
    delete: (todoId, userId) => ipcRenderer.invoke('todo:delete', { todoId, userId }),
    stats: (userId) => ipcRenderer.invoke('todo:stats', { userId })
  },
  dashboard: {
    getStats: (userId, focusRange) => ipcRenderer.invoke('dashboard:getStats', { userId, focusRange })
  },
  calendar: {
    create: (payload) => ipcRenderer.invoke('calendar:create', payload),
    list: (userId, date) => ipcRenderer.invoke('calendar:list', { userId, date }),
    listRange: (userId, startDate, endDate) =>
      ipcRenderer.invoke('calendar:listRange', { userId, startDate, endDate }),
    update: (eventId, updates, userId) => ipcRenderer.invoke('calendar:update', { eventId, updates, userId }),
    delete: (eventId, userId) => ipcRenderer.invoke('calendar:delete', { eventId, userId })
  },
  pomodoro: {
    getState: () => ipcRenderer.invoke('pomodoro:getState'),
    getSettings: () => ipcRenderer.invoke('pomodoro:getSettings'),
    updateSettings: (settings) => ipcRenderer.invoke('pomodoro:updateSettings', { settings }),
    start: () => ipcRenderer.invoke('pomodoro:start'),
    pause: () => ipcRenderer.invoke('pomodoro:pause'),
    reset: () => ipcRenderer.invoke('pomodoro:reset'),
    skip: () => ipcRenderer.invoke('pomodoro:skip'),
    setMode: (mode) => ipcRenderer.invoke('pomodoro:setMode', { mode }),
    onTick: (callback) => {
      const listener = (_event: Electron.IpcRendererEvent, payload): void => callback(payload)
      ipcRenderer.on('pomodoro:tick', listener)
      return () => ipcRenderer.removeListener('pomodoro:tick', listener)
    },
    onSessionEnded: (callback) => {
      const listener = (_event: Electron.IpcRendererEvent, payload): void => callback(payload)
      ipcRenderer.on('pomodoro:sessionEnded', listener)
      return () => ipcRenderer.removeListener('pomodoro:sessionEnded', listener)
    }
  },
  app: {
    onDeepLink: (callback) => {
      const listener = (_event: Electron.IpcRendererEvent, url: string): void => callback(url)
      ipcRenderer.on('app:deeplink', listener)
      return () => ipcRenderer.removeListener('app:deeplink', listener)
    }
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.api = api
}