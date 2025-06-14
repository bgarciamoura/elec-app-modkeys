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

export const overlayConfig: OverlayConfig = {
  duration: 500,
  opacity: 0.8,
  font: 'Arial',
  width: 250,
  height: 80,
  position: 'center',
  enabled: true
};
