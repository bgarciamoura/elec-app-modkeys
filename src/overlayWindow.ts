import { BrowserWindow, screen } from 'electron';
import * as path from 'path';
import { overlayConfig } from './config';

let overlayWindow: BrowserWindow | null = null;
let hideTimeout: NodeJS.Timeout | null = null;

const calculatePosition = (displayWidth: number, displayHeight: number): { x: number; y: number } => {
  switch (overlayConfig.position) {
    case 'top-left':
      return { x: 0, y: 0 };
    case 'top-right':
      return { x: displayWidth - overlayConfig.width, y: 0 };
    case 'bottom-left':
      return { x: 0, y: displayHeight - overlayConfig.height };
    case 'bottom-right':
      return { x: displayWidth - overlayConfig.width, y: displayHeight - overlayConfig.height };
    case 'center':
    default:
      return {
        x: Math.floor(displayWidth / 2 - overlayConfig.width / 2),
        y: Math.floor(displayHeight / 2 - overlayConfig.height / 2)
      };
  }
};

export const createOverlayWindow = (): void => {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;
  const { x, y } = calculatePosition(width, height);

  overlayWindow = new BrowserWindow({
    width: overlayConfig.width,
    height: overlayConfig.height,
    x,
    y,
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

  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;
  const { x, y } = calculatePosition(width, height);

  overlayWindow.setSize(overlayConfig.width, overlayConfig.height);
  overlayWindow.setPosition(x, y);

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
