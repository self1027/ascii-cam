import type { Config } from '../core/config';

export function getLayoutMetrics(wrap: HTMLElement, ctx: CanvasRenderingContext2D, config: Config) {
  ctx.font = `${config.fontSize}px monospace`;
  
  const metrics = ctx.measureText("A");
  const charWidth = metrics.width || 8;
  const charHeight = config.fontSize;

  const screenW = wrap.clientWidth;
  const screenH = wrap.clientHeight;

  // Cálculo do Grid (Fallback para evitar divisão por zero)
  const cols = Math.floor(screenW / charWidth) || 1;
  const rows = Math.floor(screenH / charHeight) || 1;

  return {
    cols,
    rows,
    screenW,
    screenH,
    charWidth,
    charHeight
  };
}