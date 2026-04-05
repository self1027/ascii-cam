
import type { Config } from '../core/config';
import type { LayoutMetrics, ASCIIResult } from '../types';

const colorCache = new Map<number, string>();

export function drawASCII(
  ctx: CanvasRenderingContext2D,
  result: ASCIIResult,
  metrics: LayoutMetrics,
  config: Config,
  useColor: boolean
) {
  const { cols, rows, screenW, charWidth } = metrics;
  const { charIndices, colors } = result;

  const offsetX = (screenW - cols * charWidth) / 2;
  let y = 0;

  if (!useColor || !colors) {
    ctx.fillStyle = config.textColor;

    for (let row = 0; row < rows; row++) {
      let line = "";
      for (let col = 0; col < cols; col++) {
        line += config.chars[charIndices[row * cols + col]];
      }
      ctx.fillText(line, offsetX, y);
      y += config.fontSize;
    }
    return;
  }

  for (let row = 0; row < rows; row++) {
    let x = offsetX;
    let currentColor = -1;
    let buffer = "";

    for (let col = 0; col < cols; col++) {
      const i = row * cols + col;
      const char = config.chars[charIndices[i]];
      const color = colors[i];

      if (color !== currentColor && buffer.length) {
        ctx.fillStyle = colorCache.get(currentColor)!;
        ctx.fillText(buffer, x - buffer.length * charWidth, y);
        buffer = "";
      }

      if (!colorCache.has(color)) {
        colorCache.set(
          color,
          `rgb(${(color >> 16) & 255},${(color >> 8) & 255},${color & 255})`
        );
      }

      currentColor = color;
      buffer += char;
      x += charWidth;
    }

    if (buffer.length) {
      ctx.fillStyle = colorCache.get(currentColor)!;
      ctx.fillText(buffer, x - buffer.length * charWidth, y);
    }

    y += config.fontSize;
  }
}