import type { Config } from '../core/config';
import type { ASCIIResult, WorkerPayload } from '../types';

export class WorkerService {
  private worker: Worker;
  isProcessing = false;
  lastResult: ASCIIResult | null = null;

  constructor() {
    this.worker = new Worker(
      new URL('../worker.ts', import.meta.url),
      { type: 'module' }
    );

    this.worker.onmessage = (e: MessageEvent<ASCIIResult>) => {
      this.lastResult = e.data;
      this.isProcessing = false;
    };
  }

  post(
    imgData: ImageData,
    cols: number,
    rows: number,
    config: Config,
    useColor: boolean
  ) {
    this.isProcessing = true;

    const payload: WorkerPayload = {
      data: imgData.data,
      cols,
      rows,
      chars: config.chars,
      brightness: config.brightness,
      contrast: config.contrast,
      useColor
    };

    this.worker.postMessage(payload, [imgData.data.buffer]);
  }

  terminate() {
    this.worker.terminate();
  }
}