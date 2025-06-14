import { UiohookKey, uIOhook } from 'uiohook-napi';
import { showOverlay } from './overlayWindow';

let capsLockState = false;
let listening = false;

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

export const startKeyListener = (): void => {
  if (listening) return;

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
  listening = true;
};

export const stopKeyListener = (): void => {
  if (!listening) return;
  uIOhook.stop();
  uIOhook.removeAllListeners('keydown');
  listening = false;
};
