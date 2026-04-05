/// <reference lib="webworker" />

import type { WorkerPayload } from "./types";

const contrastLUT = new Uint8Array(256);
let lastContrast = -1;

function buildLUT(contrast: number) {
  if (contrast === lastContrast) return;

  for (let i = 0; i < 256; i++) {
    let v = i / 255;
    v = Math.pow(v, contrast);
    contrastLUT[i] = (v * 255) | 0;
  }

  lastContrast = contrast;
}

self.onmessage = (e: MessageEvent<WorkerPayload>) => {
  const {
    data,
    cols,
    rows,
    chars,
    brightness,
    contrast,
    useColor
  } = e.data;

  const pixels = data;
  const totalPixels = cols * rows;

  buildLUT(contrast);

  const charIndices = new Uint8Array(totalPixels);
  const colors = useColor ? new Uint32Array(totalPixels) : null;

  const charLenMinusOne = chars.length - 1;

  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    const idx = i >> 2;

    // Luminosidade Rec. 709
    let v = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 255;

    v *= brightness;

    // clamp 0–1
    if (v < 0) v = 0;
    else if (v > 1) v = 1;

    const clamped = (v * 255) | 0;
    const finalV = contrastLUT[clamped] / 255;

    let charIdx = (finalV * charLenMinusOne) | 0;

    if (charIdx < 0) charIdx = 0;
    else if (charIdx > charLenMinusOne) charIdx = charLenMinusOne;

    charIndices[idx] = charIdx;

    if (useColor && colors) {
      colors[idx] = (r << 16) | (g << 8) | b;
    }
  }

  const ctx = self as DedicatedWorkerGlobalScope;

  if (useColor && colors) {
    ctx.postMessage(
      { charIndices, colors },
      [charIndices.buffer, colors.buffer]
    );
  } else {
    ctx.postMessage(
      { charIndices, colors: null },
      [charIndices.buffer]
    );
  }
};