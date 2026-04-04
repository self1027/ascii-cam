/// <reference lib="webworker" />

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

self.onmessage = (e: MessageEvent) => {
  const { data, cols, rows, chars, brightness, contrast } = e.data;
  
  const pixels = data; 
  const totalPixels = cols * rows;

  buildLUT(contrast);

  const charIndices = new Uint8Array(totalPixels);
  const colors = new Uint32Array(totalPixels);

  const charLenMinusOne = chars.length - 1;

  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    const idx = i >> 2;

    // Luminosidade Rec. 709
    let v = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 255;
    
    v *= brightness;
    
    const clampedV = v < 0 ? 0 : v > 1 ? 255 : (v * 255) | 0;

    const finalV = contrastLUT[clampedV] / 255;

    let charIdx = (finalV * charLenMinusOne) | 0;
    charIndices[idx] = charIdx < 0 ? 0 : charIdx > charLenMinusOne ? charLenMinusOne : charIdx;
    
    // Empacotamento 0xRRGGBB
    colors[idx] = (r << 16) | (g << 8) | b;
  }

  // Transferable Objects (Zero-Copy)
  (self as unknown as DedicatedWorkerGlobalScope).postMessage({
    charIndices,
    colors
  }, [charIndices.buffer, colors.buffer]);
};