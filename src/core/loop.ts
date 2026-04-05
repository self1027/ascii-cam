import { config } from './config';
import { getLayoutMetrics } from '../render/layout';
import { drawASCII } from '../render/render';
import type { CameraService } from '../services/camera';
import type { WorkerService } from '../services/ascii.worker';

type RenderLoopDeps = {
  dom: {
    wrap: HTMLElement;
    canvas: HTMLCanvasElement;
    stats: {
      gridInfo: HTMLElement;
      charInfo: HTMLElement;
      fpsInfo: HTMLElement;
      msInfo: HTMLElement;
    };
  };
  ctx: CanvasRenderingContext2D;
  buffer: HTMLCanvasElement;
  bctx: CanvasRenderingContext2D;
  camera: CameraService;
  worker: WorkerService;
};

export function startRenderLoop({
  dom,
  ctx,
  buffer,
  bctx,
  camera,
  worker
}: RenderLoopDeps) {
  let lastTime = performance.now();
  let frameCount = 0;

  function loop() {
    const startTime = performance.now();
    const metrics = getLayoutMetrics(dom.wrap, ctx, config);

    if (dom.canvas.width !== metrics.screenW || dom.canvas.height !== metrics.screenH) {
      dom.canvas.width = metrics.screenW;
      dom.canvas.height = metrics.screenH;
    }

    ctx.fillStyle = config.bgColor;
    ctx.fillRect(0, 0, dom.canvas.width, dom.canvas.height);

    if (camera.isReady) {
      if (buffer.width !== metrics.cols || buffer.height !== metrics.rows) {
        buffer.width = metrics.cols;
        buffer.height = metrics.rows;
      }

      bctx.save();
      bctx.scale(-1, 1);
      bctx.translate(-metrics.cols, 0);
      bctx.drawImage(camera.video, 0, 0, metrics.cols, metrics.rows);
      bctx.restore();

      if (!worker.isProcessing) {
        const imgData = bctx.getImageData(0, 0, metrics.cols, metrics.rows);
        worker.post(imgData, metrics.cols, metrics.rows, config, config.useColor);
      }

      ctx.textBaseline = "top";
      ctx.textAlign = "start";

      if (worker.lastResult) {
        drawASCII(ctx, worker.lastResult, metrics, config, config.useColor);
      }

      const endTime = performance.now();

      frameCount++;
      const now = performance.now();

      if (now >= lastTime + 1000) {
        dom.stats.fpsInfo.textContent = `${frameCount} fps`;
        frameCount = 0;
        lastTime = now;
      }

      dom.stats.gridInfo.textContent = `${metrics.cols}×${metrics.rows} grid`;
      dom.stats.charInfo.textContent = `${config.chars.length} variants`;
      dom.stats.msInfo.textContent = `${(endTime - startTime).toFixed(1)}ms`;

    } else {
      ctx.fillStyle = config.textColor;
      ctx.font = `14px monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const msg = camera.stream
        ? "CARREGANDO FLUXO DE VÍDEO..."
        : "CÂMERA DESATIVADA / BLOQUEADA";

      ctx.fillText(msg, dom.canvas.width / 2, dom.canvas.height / 2);

      dom.stats.gridInfo.textContent = "0×0 grid";
      dom.stats.charInfo.textContent = "0 variants";
      dom.stats.msInfo.textContent = "0.0ms";
      dom.stats.fpsInfo.textContent = "0 fps";
      frameCount = 0;
    }

    requestAnimationFrame(loop);
  }

  loop();
}