import { app, BrowserWindow, Tray, Menu, screen, nativeImage } from 'electron';
import * as path from 'path';
import { UiohookKey, uIOhook } from 'uiohook-napi';

let tray: Tray | null = null;
let overlayWindow: BrowserWindow | null = null;
let hideTimeout: NodeJS.Timeout | null = null;
let capsLockState = false;

// Settings
interface OverlayConfig {
  duration: number;
  opacity: number;
  font: string;
}

const overlayConfig: OverlayConfig = {
  duration: 500,
  opacity: 0.8,
  font: 'Arial'
};

const KEY_MAP: Record<number, string | ((isMac: boolean) => string)> = {
  [UiohookKey.Shift]: 'SHIFT L',
  [UiohookKey.ShiftRight]: 'SHIFT R',
  [UiohookKey.Ctrl]: 'CTRL L',
  [UiohookKey.CtrlRight]: 'CTRL R',
  [UiohookKey.Alt]: 'ALT L',
  [UiohookKey.AltRight]: 'ALT R',
  [UiohookKey.Meta]: (isMac) => (isMac ? 'CMD L' : 'WIN L'),
  [UiohookKey.MetaRight]: (isMac) => (isMac ? 'CMD R' : 'WIN R')
};

const createOverlayWindow = (): void => {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  overlayWindow = new BrowserWindow({
    width: 250,
    height: 80,
    x: Math.floor(width / 2) - 125,
    y: Math.floor(height / 2) - 40,
    frame: false,
    alwaysOnTop: true,
    transparent: true,
    skipTaskbar: true,
    resizable: false,
    minimizable: false,
    maximizable: false,
    closable: false,
    focusable: false,
    show: false,
    type: 'panel',
    acceptFirstMouse: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  overlayWindow.loadFile(path.join(__dirname, '../overlay.html'));
  overlayWindow.setIgnoreMouseEvents(true);
};

const showOverlay = (key: string): void => {
  if (!overlayWindow) return;

  if (hideTimeout) {
    clearTimeout(hideTimeout);
  }

  overlayWindow.webContents.send('update-key', key);
  overlayWindow.webContents.send('update-style', {
    opacity: overlayConfig.opacity,
    font: overlayConfig.font
  });
  overlayWindow.showInactive(); // Use showInactive to not steal focus

  hideTimeout = setTimeout(() => {
    if (overlayWindow) {
      overlayWindow.hide();
    }
  }, overlayConfig.duration);
};

const updateTrayMenu = (): void => {
  if (!tray) return;
  
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Modifier Keys Overlay',
      enabled: false
    },
    {
      type: 'separator'
    },
    {
      label: 'Duration',
      submenu: [
        {
          label: '0.25 seconds',
          type: 'radio',
          checked: overlayConfig.duration === 250,
          click: () => { overlayConfig.duration = 250; updateTrayMenu(); }
        },
        {
          label: '0.5 seconds',
          type: 'radio',
          checked: overlayConfig.duration === 500,
          click: () => { overlayConfig.duration = 500; updateTrayMenu(); }
        },
        {
          label: '1 second',
          type: 'radio',
          checked: overlayConfig.duration === 1000,
          click: () => { overlayConfig.duration = 1000; updateTrayMenu(); }
        },
        {
          label: '2 seconds',
          type: 'radio',
          checked: overlayConfig.duration === 2000,
          click: () => { overlayConfig.duration = 2000; updateTrayMenu(); }
        }
      ]
    },
    {
      label: 'Opacity',
      submenu: [
        {
          label: '25%',
          type: 'radio',
          checked: overlayConfig.opacity === 0.25,
          click: () => { overlayConfig.opacity = 0.25; updateTrayMenu(); }
        },
        {
          label: '50%',
          type: 'radio',
          checked: overlayConfig.opacity === 0.5,
          click: () => { overlayConfig.opacity = 0.5; updateTrayMenu(); }
        },
        {
          label: '75%',
          type: 'radio',
          checked: overlayConfig.opacity === 0.75,
          click: () => { overlayConfig.opacity = 0.75; updateTrayMenu(); }
        },
        {
          label: '80%',
          type: 'radio',
          checked: overlayConfig.opacity === 0.8,
          click: () => { overlayConfig.opacity = 0.8; updateTrayMenu(); }
        },
        {
          label: '90%',
          type: 'radio',
          checked: overlayConfig.opacity === 0.9,
          click: () => { overlayConfig.opacity = 0.9; updateTrayMenu(); }
        },
        {
          label: '100%',
          type: 'radio',
          checked: overlayConfig.opacity === 1.0,
          click: () => { overlayConfig.opacity = 1.0; updateTrayMenu(); }
        }
      ]
    },
    {
      label: 'Font',
      submenu: [
        {
          label: 'Arial',
          type: 'radio',
          checked: overlayConfig.font === 'Arial',
          click: () => { overlayConfig.font = 'Arial'; updateTrayMenu(); }
        },
        {
          label: 'Helvetica',
          type: 'radio',
          checked: overlayConfig.font === 'Helvetica',
          click: () => { overlayConfig.font = 'Helvetica'; updateTrayMenu(); }
        },
        {
          label: 'Times New Roman',
          type: 'radio',
          checked: overlayConfig.font === 'Times New Roman',
          click: () => { overlayConfig.font = 'Times New Roman'; updateTrayMenu(); }
        },
        {
          label: 'Courier New',
          type: 'radio',
          checked: overlayConfig.font === 'Courier New',
          click: () => { overlayConfig.font = 'Courier New'; updateTrayMenu(); }
        },
        {
          label: 'Roboto',
          type: 'radio',
          checked: overlayConfig.font === 'Roboto',
          click: () => { overlayConfig.font = 'Roboto'; updateTrayMenu(); }
        },
        {
          label: 'San Francisco',
          type: 'radio',
          checked: overlayConfig.font === '-apple-system',
          click: () => { overlayConfig.font = '-apple-system'; updateTrayMenu(); }
        }
      ]
    },
    {
      type: 'separator'
    },
    {
      label: 'Quit',
      click: () => {
        app.quit();
      }
    }
  ]);

  tray.setContextMenu(contextMenu);
};

const createTray = (): void => {
  try {
    // Try to create tray icon, skip if it fails
    if (process.platform === 'darwin') {
      tray = new Tray(nativeImage.createFromNamedImage('NSStatusNone'));
    } else {
      // For other platforms, create a simple icon
      const icon = nativeImage.createEmpty();
      icon.addRepresentation({
        scaleFactor: 1.0,
        width: 16,
        height: 16,
        buffer: Buffer.alloc(16 * 16 * 4, 128) // Gray 16x16 RGBA buffer
      });
      tray = new Tray(icon);
    }

    if (tray) {
      tray.setToolTip('Modifier Keys Overlay');
      updateTrayMenu();
    }
  } catch (error) {
    console.error('Failed to create tray:', error);
  }
};

const getCapsLockState = (): boolean => {
  try {
    // Try to get the actual caps lock state from the system
    // This is a simple toggle approach since we can't easily detect system state
    return capsLockState;
  } catch (error) {
    return capsLockState;
  }
};

const startKeyListener = (): void => {
  uIOhook.on('keydown', (e) => {
    if (e.keycode === UiohookKey.CapsLock) {
      capsLockState = !capsLockState;
      showOverlay(capsLockState ? 'CAPS ON' : 'CAPS OFF');
      return;
    }

    const handler = KEY_MAP[e.keycode];
    if (handler) {
      const text = typeof handler === 'function'
        ? handler(process.platform === 'darwin')
        : handler;
      showOverlay(text);
    }
  });

  uIOhook.start();
};

app.whenReady().then(() => {
  createOverlayWindow();
  createTray();
  startKeyListener();

  app.on('window-all-closed', () => {
    // Prevent app from quitting
  });
});

app.on('before-quit', () => {
  uIOhook.stop();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createOverlayWindow();
  }
});
