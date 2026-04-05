export type ASCIIResult = {
  charIndices: Uint8Array;
  colors: Uint32Array | null;
};

export type LayoutMetrics = {
  cols: number;
  rows: number;
  screenW: number;
  screenH: number;
  charWidth: number;
  charHeight: number;
};

export type WorkerPayload = {
  data: Uint8ClampedArray;
  cols: number;
  rows: number;
  chars: string;
  brightness: number;
  contrast: number;
  useColor: boolean;
};