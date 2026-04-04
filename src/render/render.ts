import { type Config, useColor } from '../core/config';

const colorCache = new Map<number, string>();

export function drawASCII(
  ctx: CanvasRenderingContext2D, 
  result: { charIndices: Uint8Array, colors: Uint32Array },
  metrics: any,
  config: Config
) {
  const { cols, rows, screenW, charWidth } = metrics;
  const { charIndices, colors } = result;
  const offsetX = (screenW - (cols * charWidth)) / 2;
  let y = 0;

  if (!useColor) {
    ctx.fillStyle = config.textColor;
    for (let row = 0; row < rows; row++) {
      let line = "";
      for (let col = 0; col < cols; col++) {
        line += config.chars[charIndices[row * cols + col]];
      }
      ctx.fillText(line, offsetX, y);
      y += config.fontSize;
    }
  } else {
    for (let row = 0; row < rows; row++) {
      let x = offsetX;
      let currentColor = -1;
      let bufferStr = "";

      for (let col = 0; col < cols; col++) {
        const i = row * cols + col;
        const char = config.chars[charIndices[i]];
        const color = colors[i];

        if (color !== currentColor && bufferStr.length > 0) {
          ctx.fillStyle = colorCache.get(currentColor)!;
          ctx.fillText(bufferStr, x - bufferStr.length * charWidth, y);
          bufferStr = "";
        }

        if (!colorCache.has(color)) {
          colorCache.set(color, `rgb(${(color >> 16) & 255},${(color >> 8) & 255},${color & 255})`);
        }

        currentColor = color;
        bufferStr += char;
        x += charWidth;
      }

      if (bufferStr.length > 0) {
        ctx.fillStyle = colorCache.get(currentColor)!;
        ctx.fillText(bufferStr, x - bufferStr.length * charWidth, y);
      }
      y += config.fontSize;
    }
  }
}