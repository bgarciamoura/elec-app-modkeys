import { app, BrowserWindow } from 'electron';
import { createOverlayWindow } from './overlayWindow';
import { createTray } from './tray';
import { startKeyListener, stopKeyListener } from './keyListener';

app.whenReady().then(() => {
  createOverlayWindow();
  createTray();
  startKeyListener();

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
