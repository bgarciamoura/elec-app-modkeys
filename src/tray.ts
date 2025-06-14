import { Tray, Menu, nativeImage, app } from 'electron';
import { overlayConfig, saveConfig, resetConfig } from './config';
import { startKeyListener, stopKeyListener } from './keyListener';
import { hideOverlay } from './overlayWindow';

let tray: Tray | null = null;

const updateTrayMenu = (): void => {
  if (!tray) return;

  const contextMenu = Menu.buildFromTemplate([
    { label: 'Modifier Keys Overlay', enabled: false },
    { type: 'separator' },
    {
      label: 'Duration',
      submenu: [
        { label: '0.25 seconds', type: 'radio', checked: overlayConfig.duration === 250, click: () => { overlayConfig.duration = 250; saveConfig(); updateTrayMenu(); } },
        { label: '0.5 seconds', type: 'radio', checked: overlayConfig.duration === 500, click: () => { overlayConfig.duration = 500; saveConfig(); updateTrayMenu(); } },
        { label: '1 second', type: 'radio', checked: overlayConfig.duration === 1000, click: () => { overlayConfig.duration = 1000; saveConfig(); updateTrayMenu(); } },
        { label: '2 seconds', type: 'radio', checked: overlayConfig.duration === 2000, click: () => { overlayConfig.duration = 2000; saveConfig(); updateTrayMenu(); } }
      ]
    },
    {
      label: 'Opacity',
      submenu: [
        { label: '25%', type: 'radio', checked: overlayConfig.opacity === 0.25, click: () => { overlayConfig.opacity = 0.25; saveConfig(); updateTrayMenu(); } },
        { label: '50%', type: 'radio', checked: overlayConfig.opacity === 0.5, click: () => { overlayConfig.opacity = 0.5; saveConfig(); updateTrayMenu(); } },
        { label: '75%', type: 'radio', checked: overlayConfig.opacity === 0.75, click: () => { overlayConfig.opacity = 0.75; saveConfig(); updateTrayMenu(); } },
        { label: '80%', type: 'radio', checked: overlayConfig.opacity === 0.8, click: () => { overlayConfig.opacity = 0.8; saveConfig(); updateTrayMenu(); } },
        { label: '90%', type: 'radio', checked: overlayConfig.opacity === 0.9, click: () => { overlayConfig.opacity = 0.9; saveConfig(); updateTrayMenu(); } },
        { label: '100%', type: 'radio', checked: overlayConfig.opacity === 1.0, click: () => { overlayConfig.opacity = 1.0; saveConfig(); updateTrayMenu(); } }
      ]
    },
    {
      label: 'Font',
      submenu: [
        { label: 'Arial', type: 'radio', checked: overlayConfig.font === 'Arial', click: () => { overlayConfig.font = 'Arial'; saveConfig(); updateTrayMenu(); } },
        { label: 'Helvetica', type: 'radio', checked: overlayConfig.font === 'Helvetica', click: () => { overlayConfig.font = 'Helvetica'; saveConfig(); updateTrayMenu(); } },
        { label: 'Times New Roman', type: 'radio', checked: overlayConfig.font === 'Times New Roman', click: () => { overlayConfig.font = 'Times New Roman'; saveConfig(); updateTrayMenu(); } },
        { label: 'Courier New', type: 'radio', checked: overlayConfig.font === 'Courier New', click: () => { overlayConfig.font = 'Courier New'; saveConfig(); updateTrayMenu(); } },
        { label: 'Roboto', type: 'radio', checked: overlayConfig.font === 'Roboto', click: () => { overlayConfig.font = 'Roboto'; saveConfig(); updateTrayMenu(); } },
        { label: 'San Francisco', type: 'radio', checked: overlayConfig.font === '-apple-system', click: () => { overlayConfig.font = '-apple-system'; saveConfig(); updateTrayMenu(); } }
      ]
    },
    {
      label: 'Size',
      submenu: [
        { label: 'Small', type: 'radio', checked: overlayConfig.width === 200 && overlayConfig.height === 60, click: () => { overlayConfig.width = 200; overlayConfig.height = 60; saveConfig(); updateTrayMenu(); } },
        { label: 'Medium', type: 'radio', checked: overlayConfig.width === 250 && overlayConfig.height === 80, click: () => { overlayConfig.width = 250; overlayConfig.height = 80; saveConfig(); updateTrayMenu(); } },
        { label: 'Large', type: 'radio', checked: overlayConfig.width === 300 && overlayConfig.height === 100, click: () => { overlayConfig.width = 300; overlayConfig.height = 100; saveConfig(); updateTrayMenu(); } }
      ]
    },
    {
      label: 'Position',
      submenu: [
        { label: 'Top Left', type: 'radio', checked: overlayConfig.position === 'top-left', click: () => { overlayConfig.position = 'top-left'; saveConfig(); updateTrayMenu(); } },
        { label: 'Top Right', type: 'radio', checked: overlayConfig.position === 'top-right', click: () => { overlayConfig.position = 'top-right'; saveConfig(); updateTrayMenu(); } },
        { label: 'Bottom Left', type: 'radio', checked: overlayConfig.position === 'bottom-left', click: () => { overlayConfig.position = 'bottom-left'; saveConfig(); updateTrayMenu(); } },
        { label: 'Bottom Right', type: 'radio', checked: overlayConfig.position === 'bottom-right', click: () => { overlayConfig.position = 'bottom-right'; saveConfig(); updateTrayMenu(); } },
        { label: 'Center', type: 'radio', checked: overlayConfig.position === 'center', click: () => { overlayConfig.position = 'center'; saveConfig(); updateTrayMenu(); } }
      ]
    },
    {
      label: 'Enabled',
      type: 'checkbox',
      checked: overlayConfig.enabled,
        click: (menuItem) => {
          overlayConfig.enabled = menuItem.checked;
          if (overlayConfig.enabled) {
            startKeyListener();
          } else {
            stopKeyListener();
            hideOverlay();
          }
          saveConfig();
          updateTrayMenu();
        }
    },
    { type: 'separator' },
    {
      label: 'Reset Settings',
      click: () => {
        resetConfig();
        if (overlayConfig.enabled) {
          startKeyListener();
        } else {
          stopKeyListener();
          hideOverlay();
        }
        updateTrayMenu();
      }
    },
    { type: 'separator' },
    { label: 'Quit', click: () => { app.quit(); } }
  ]);

  tray.setContextMenu(contextMenu);
};

export const createTray = (): void => {
  try {
    if (process.platform === 'darwin') {
      tray = new Tray(nativeImage.createFromNamedImage('NSStatusNone'));
    } else {
      const icon = nativeImage.createEmpty();
      icon.addRepresentation({
        scaleFactor: 1.0,
        width: 16,
        height: 16,
        buffer: Buffer.alloc(16 * 16 * 4, 128)
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
