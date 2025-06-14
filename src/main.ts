import { app, BrowserWindow } from 'electron';
import { createOverlayWindow } from './overlayWindow';
import { createTray } from './tray';
import { startKeyListener, stopKeyListener } from './keyListener';
import { overlayConfig } from './config';

app.whenReady().then(() => {
  createOverlayWindow();
  createTray();
  if (overlayConfig.enabled) {
    startKeyListener();
  }

  app.on('window-all-closed', () => {
    // Prevent app from quitting when all windows are closed
  });
});

app.on('before-quit', () => {
  stopKeyListener();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createOverlayWindow();
  }
});
