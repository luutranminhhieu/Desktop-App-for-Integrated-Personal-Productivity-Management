import { contextBridge, ipcRenderer } from 'electron'

// Custom APIs for renderer
const api = {
  auth: {
    login: (email, password) => ipcRenderer.invoke('auth:login', { email, password }),
    register: (email, password, name) => ipcRenderer.invoke('auth:register', { email, password, name }),
    verifyToken: (token) => ipcRenderer.invoke('auth:verifyToken', { token }),
    googleSignIn: () => ipcRenderer.invoke('auth:googleSignIn'),
    requestPasswordReset: (email) => ipcRenderer.invoke('auth:requestPasswordReset', { email }),
    resendPasswordReset: (email) => ipcRenderer.invoke('auth:resendPasswordReset', { email })
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