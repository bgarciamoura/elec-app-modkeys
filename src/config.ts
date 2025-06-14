export type OverlayPosition =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | 'center';

export interface OverlayConfig {
  duration: number;
  opacity: number;
  font: string;
  width: number;
  height: number;
  position: OverlayPosition;
  enabled: boolean;
}

export const defaultOverlayConfig: OverlayConfig = {
  duration: 500,
  opacity: 0.8,
  font: 'Arial',
  width: 250,
  height: 80,
  position: 'center',
  enabled: true
};

export const overlayConfig: OverlayConfig = { ...defaultOverlayConfig };

import { app } from 'electron';
import * as fs from 'fs';
import * as path from 'path';

let configPath: string | null = null;

const ensureConfigPath = () => {
  if (!configPath) {
    configPath = path.join(app.getPath('userData'), 'overlay-config.json');
  }
  return configPath;
};

export const loadConfig = (): void => {
  const file = ensureConfigPath();
  if (!fs.existsSync(file)) {
    return;
  }
  try {
    const data = fs.readFileSync(file, 'utf-8').trim();
    if (data) {
      const parsed = JSON.parse(data) as Partial<OverlayConfig>;
      Object.assign(overlayConfig, defaultOverlayConfig, parsed);
    }
  } catch (err) {
    console.error('Failed to load config:', err);
  }
};

export const saveConfig = (): void => {
  try {
    const file = ensureConfigPath();
    fs.writeFileSync(file, JSON.stringify(overlayConfig, null, 2));
  } catch (err) {
    console.error('Failed to save config:', err);
  }
};

export const resetConfig = (): void => {
  Object.assign(overlayConfig, defaultOverlayConfig);
  saveConfig();
};
