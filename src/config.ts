export interface OverlayConfig {
  duration: number;
  opacity: number;
  font: string;
  enabled: boolean;
}

export const overlayConfig: OverlayConfig = {
  duration: 500,
  opacity: 0.8,
  font: 'Arial',
  enabled: true
};
