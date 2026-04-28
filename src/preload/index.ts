import { contextBridge, ipcRenderer } from 'electron'

// Custom APIs for renderer
const api = {
  auth: {
    login: (email, password) => ipcRenderer.invoke('auth:login', { email, password }),
    register: (email, password, name) => ipcRenderer.invoke('auth:register', { email, password, name }),
    verifyToken: (token) => ipcRenderer.invoke('auth:verifyToken', { token })
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