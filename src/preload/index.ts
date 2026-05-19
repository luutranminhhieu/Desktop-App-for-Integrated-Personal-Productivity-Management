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
  note: {
    create: (payload) => ipcRenderer.invoke('note:create', payload),
    list: (options) => ipcRenderer.invoke('note:list', options),
    update: (noteId, updates, userId) => ipcRenderer.invoke('note:update', { noteId, updates, userId }),
    delete: (noteId, userId) => ipcRenderer.invoke('note:delete', { noteId, userId }),
    count: (userId) => ipcRenderer.invoke('note:count', { userId })
  },
  dashboard: {
    getStats: (userId) => ipcRenderer.invoke('dashboard:getStats', { userId })
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