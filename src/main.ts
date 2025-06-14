import { app, BrowserWindow, Tray, Menu, screen, nativeImage } from 'electron';
import * as path from 'path';
import { UiohookKey, uIOhook } from 'uiohook-napi';

let tray: Tray | null = null;
let overlayWindow: BrowserWindow | null = null;
let hideTimeout: NodeJS.Timeout | null = null;
let capsLockState = false;

// Settings
let overlayDuration = 500; // milliseconds
let overlayOpacity = 0.8; // 0.0 to 1.0
let overlayFont = 'Arial'; // font family

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
  overlayWindow.webContents.send('update-style', { opacity: overlayOpacity, font: overlayFont });
  overlayWindow.showInactive(); // Use showInactive to not steal focus

  hideTimeout = setTimeout(() => {
    if (overlayWindow) {
      overlayWindow.hide();
    }
  }, overlayDuration);
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
          checked: overlayDuration === 250,
          click: () => { overlayDuration = 250; updateTrayMenu(); }
        },
        {
          label: '0.5 seconds',
          type: 'radio',
          checked: overlayDuration === 500,
          click: () => { overlayDuration = 500; updateTrayMenu(); }
        },
        {
          label: '1 second',
          type: 'radio',
          checked: overlayDuration === 1000,
          click: () => { overlayDuration = 1000; updateTrayMenu(); }
        },
        {
          label: '2 seconds',
          type: 'radio',
          checked: overlayDuration === 2000,
          click: () => { overlayDuration = 2000; updateTrayMenu(); }
        }
      ]
    },
    {
      label: 'Opacity',
      submenu: [
        {
          label: '25%',
          type: 'radio',
          checked: overlayOpacity === 0.25,
          click: () => { overlayOpacity = 0.25; updateTrayMenu(); }
        },
        {
          label: '50%',
          type: 'radio',
          checked: overlayOpacity === 0.5,
          click: () => { overlayOpacity = 0.5; updateTrayMenu(); }
        },
        {
          label: '75%',
          type: 'radio',
          checked: overlayOpacity === 0.75,
          click: () => { overlayOpacity = 0.75; updateTrayMenu(); }
        },
        {
          label: '80%',
          type: 'radio',
          checked: overlayOpacity === 0.8,
          click: () => { overlayOpacity = 0.8; updateTrayMenu(); }
        },
        {
          label: '90%',
          type: 'radio',
          checked: overlayOpacity === 0.9,
          click: () => { overlayOpacity = 0.9; updateTrayMenu(); }
        },
        {
          label: '100%',
          type: 'radio',
          checked: overlayOpacity === 1.0,
          click: () => { overlayOpacity = 1.0; updateTrayMenu(); }
        }
      ]
    },
    {
      label: 'Font',
      submenu: [
        {
          label: 'Arial',
          type: 'radio',
          checked: overlayFont === 'Arial',
          click: () => { overlayFont = 'Arial'; updateTrayMenu(); }
        },
        {
          label: 'Helvetica',
          type: 'radio',
          checked: overlayFont === 'Helvetica',
          click: () => { overlayFont = 'Helvetica'; updateTrayMenu(); }
        },
        {
          label: 'Times New Roman',
          type: 'radio',
          checked: overlayFont === 'Times New Roman',
          click: () => { overlayFont = 'Times New Roman'; updateTrayMenu(); }
        },
        {
          label: 'Courier New',
          type: 'radio',
          checked: overlayFont === 'Courier New',
          click: () => { overlayFont = 'Courier New'; updateTrayMenu(); }
        },
        {
          label: 'Roboto',
          type: 'radio',
          checked: overlayFont === 'Roboto',
          click: () => { overlayFont = 'Roboto'; updateTrayMenu(); }
        },
        {
          label: 'San Francisco',
          type: 'radio',
          checked: overlayFont === '-apple-system',
          click: () => { overlayFont = '-apple-system'; updateTrayMenu(); }
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
    switch (e.keycode) {
      case UiohookKey.Shift:
        showOverlay('SHIFT L');
        break;
      case UiohookKey.ShiftRight:
        showOverlay('SHIFT R');
        break;
      case UiohookKey.Ctrl:
        showOverlay('CTRL L');
        break;
      case UiohookKey.CtrlRight:
        showOverlay('CTRL R');
        break;
      case UiohookKey.Alt:
        showOverlay('ALT L');
        break;
      case UiohookKey.AltRight:
        showOverlay('ALT R');
        break;
      case UiohookKey.Meta:
        const isMac = process.platform === 'darwin';
        showOverlay(isMac ? 'CMD L' : 'WIN L');
        break;
      case UiohookKey.MetaRight:
        const isMacRight = process.platform === 'darwin';
        showOverlay(isMacRight ? 'CMD R' : 'WIN R');
        break;
      case UiohookKey.CapsLock:
        capsLockState = !capsLockState;
        showOverlay(capsLockState ? 'CAPS ON' : 'CAPS OFF');
        break;
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