import { BrowserWindow, screen } from 'electron';
import * as path from 'path';
import { overlayConfig } from './config';

let overlayWindow: BrowserWindow | null = null;
let hideTimeout: NodeJS.Timeout | null = null;

export const createOverlayWindow = (): void => {
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

export const showOverlay = (key: string): void => {
  if (!overlayWindow) return;

  if (hideTimeout) {
    clearTimeout(hideTimeout);
  }

  overlayWindow.webContents.send('update-key', key);
  overlayWindow.webContents.send('update-style', {
    opacity: overlayConfig.opacity,
    font: overlayConfig.font
  });
  overlayWindow.showInactive();

  hideTimeout = setTimeout(() => {
    if (overlayWindow) {
      overlayWindow.hide();
    }
  }, overlayConfig.duration);
};
