import { app, BrowserWindow } from 'electron';
import { connectDB } from './db';
import { join, resolve } from 'path';
import { registerAuthIPC } from './ipc/auth.ipc';
import { registerCalendarIPC } from './ipc/calendar.ipc';
import { registerDashboardIPC } from './ipc/dashboard.ipc';
import { registerTodoIPC } from './ipc/todo.ipc';
import icon from '../../resources/icon.png?asset';

const DEEPLINK_SCHEME = process.env.APP_DEEPLINK_SCHEME || 'promos';

let mainWindow: BrowserWindow | null = null;
let pendingDeepLink: string | null = null;

function extractDeepLink(argv: string[]): string | null {
  const prefix = `${DEEPLINK_SCHEME}://`;
  const match = argv.find((arg) => arg.startsWith(prefix));
  return match || null;
}

function handleDeepLink(url: string): void {
  pendingDeepLink = url;
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('app:deeplink', url);
  }
}

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    icon: join(__dirname, '../../resources/icon.png'),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  });

  mainWindow.on('ready-to-show', () => {
    mainWindow?.show();
  });

  mainWindow.webContents.on('did-finish-load', () => {
    if (pendingDeepLink) {
      mainWindow?.webContents.send('app:deeplink', pendingDeepLink);
    }
  });

  // Load the remote URL for development or the local html file for production.
  if (!app.isPackaged && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }
}

const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
} else {
  app.on('second-instance', (_event, argv) => {
    const url = extractDeepLink(argv);
    if (url) {
      handleDeepLink(url);
    }

    if (mainWindow) {
      if (mainWindow.isMinimized()) {
        mainWindow.restore();
      }
      mainWindow.focus();
    }
  });
}

app.on('open-url', (event, url) => {
  event.preventDefault();
  handleDeepLink(url);
});

app.whenReady().then(async () => {
  if (process.defaultApp) {
    app.setAsDefaultProtocolClient(DEEPLINK_SCHEME, process.execPath, [resolve(process.argv[1])]);
  } else {
    app.setAsDefaultProtocolClient(DEEPLINK_SCHEME);
  }

  const initialDeepLink = extractDeepLink(process.argv);
  if (initialDeepLink) {
    handleDeepLink(initialDeepLink);
  }

  // Connect to MongoDB
  await connectDB();

  // Register IPC Handlers
  registerAuthIPC();
  registerTodoIPC();
  registerCalendarIPC();
  registerDashboardIPC();
  
  // Set app user model id for windows
  if (process.platform === 'win32') {
    app.setAppUserModelId('com.promos.app');
  }

  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
