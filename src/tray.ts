import { Tray, Menu, nativeImage, app } from 'electron';
import { overlayConfig } from './config';

let tray: Tray | null = null;

const updateTrayMenu = (): void => {
  if (!tray) return;

  const contextMenu = Menu.buildFromTemplate([
    { label: 'Modifier Keys Overlay', enabled: false },
    { type: 'separator' },
    {
      label: 'Duration',
      submenu: [
        { label: '0.25 seconds', type: 'radio', checked: overlayConfig.duration === 250, click: () => { overlayConfig.duration = 250; updateTrayMenu(); } },
        { label: '0.5 seconds', type: 'radio', checked: overlayConfig.duration === 500, click: () => { overlayConfig.duration = 500; updateTrayMenu(); } },
        { label: '1 second', type: 'radio', checked: overlayConfig.duration === 1000, click: () => { overlayConfig.duration = 1000; updateTrayMenu(); } },
        { label: '2 seconds', type: 'radio', checked: overlayConfig.duration === 2000, click: () => { overlayConfig.duration = 2000; updateTrayMenu(); } }
      ]
    },
    {
      label: 'Opacity',
      submenu: [
        { label: '25%', type: 'radio', checked: overlayConfig.opacity === 0.25, click: () => { overlayConfig.opacity = 0.25; updateTrayMenu(); } },
        { label: '50%', type: 'radio', checked: overlayConfig.opacity === 0.5, click: () => { overlayConfig.opacity = 0.5; updateTrayMenu(); } },
        { label: '75%', type: 'radio', checked: overlayConfig.opacity === 0.75, click: () => { overlayConfig.opacity = 0.75; updateTrayMenu(); } },
        { label: '80%', type: 'radio', checked: overlayConfig.opacity === 0.8, click: () => { overlayConfig.opacity = 0.8; updateTrayMenu(); } },
        { label: '90%', type: 'radio', checked: overlayConfig.opacity === 0.9, click: () => { overlayConfig.opacity = 0.9; updateTrayMenu(); } },
        { label: '100%', type: 'radio', checked: overlayConfig.opacity === 1.0, click: () => { overlayConfig.opacity = 1.0; updateTrayMenu(); } }
      ]
    },
    {
      label: 'Font',
      submenu: [
        { label: 'Arial', type: 'radio', checked: overlayConfig.font === 'Arial', click: () => { overlayConfig.font = 'Arial'; updateTrayMenu(); } },
        { label: 'Helvetica', type: 'radio', checked: overlayConfig.font === 'Helvetica', click: () => { overlayConfig.font = 'Helvetica'; updateTrayMenu(); } },
        { label: 'Times New Roman', type: 'radio', checked: overlayConfig.font === 'Times New Roman', click: () => { overlayConfig.font = 'Times New Roman'; updateTrayMenu(); } },
        { label: 'Courier New', type: 'radio', checked: overlayConfig.font === 'Courier New', click: () => { overlayConfig.font = 'Courier New'; updateTrayMenu(); } },
        { label: 'Roboto', type: 'radio', checked: overlayConfig.font === 'Roboto', click: () => { overlayConfig.font = 'Roboto'; updateTrayMenu(); } },
        { label: 'San Francisco', type: 'radio', checked: overlayConfig.font === '-apple-system', click: () => { overlayConfig.font = '-apple-system'; updateTrayMenu(); } }
      ]
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
