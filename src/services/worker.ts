export class WorkerService {
  private worker: Worker;
  isProcessing = false;
  lastResult: { charIndices: Uint8Array, colors: Uint32Array } | null = null;

  constructor() {
    this.worker = new Worker(new URL('../worker.ts', import.meta.url), { type: 'module' });
    this.worker.onmessage = (e) => {
      this.lastResult = e.data;
      this.isProcessing = false;
    };
  }

  post(imgData: ImageData, cols: number, rows: number, config: any, useColor: boolean) {
    this.isProcessing = true;
    this.worker.postMessage({
      data: imgData.data,
      cols, rows,
      chars: config.chars,
      brightness: config.brightness,
      contrast: config.contrast,
      useColor
    }, [imgData.data.buffer]);
  }
}