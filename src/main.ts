import './styles/main.css';
import { config, useColor, setUseColor } from './core/config';
import { CameraService } from './services/camera';
import { WorkerService } from './services/worker';
import { getLayoutMetrics } from './render/layout';
import { drawASCII } from './render/render';

const camera = new CameraService();
const worker = new WorkerService();

const wrap = document.getElementById('canvas-wrap')!;
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d', { alpha: false })!;
const buffer = document.createElement('canvas');
const bctx = buffer.getContext('2d', { willReadFrequently: true })!;

const charInput = document.getElementById('chars-input') as HTMLInputElement;
const fontRange = document.getElementById('font-range') as HTMLInputElement;
const contrastRange = document.getElementById('contrast-range') as HTMLInputElement;
const brightRange = document.getElementById('bright-range') as HTMLInputElement;
const textColorInput = document.getElementById('text-color') as HTMLInputElement;
const bgColorInput = document.getElementById('bg-color') as HTMLInputElement;

const fontVal = document.getElementById('font-val')!;
const contrastVal = document.getElementById('contrast-val')!;
const brightVal = document.getElementById('bright-val')!;
const groupTextColor = document.getElementById('group-text-color')!;
const groupBgColor = document.getElementById('group-bg-color')!;

const gridInfo = document.getElementById('grid-info')!;
const charInfo = document.getElementById('char-info')!;
const fpsInfo = document.getElementById('fps-info')!;
const msInfo = document.getElementById('ms-info')!;
const btn = document.getElementById('toggle') as HTMLButtonElement;
const colorBtn = document.getElementById('color-toggle') as HTMLButtonElement;

let lastTime = performance.now();
let frameCount = 0;

function updateColorModeUI() {
  colorBtn.textContent = `COLOR: ${useColor ? "ON" : "OFF"}`;
  colorBtn.classList.toggle('active', useColor);

  if (useColor) {
    groupTextColor.classList.add('disabled');
    groupBgColor.classList.add('disabled');
  } else {
    groupTextColor.classList.remove('disabled');
    groupBgColor.classList.remove('disabled');
  }
}

function renderLoop() {
  const startTime = performance.now();
  const metrics = getLayoutMetrics(wrap, ctx, config);

  if (canvas.width !== metrics.screenW || canvas.height !== metrics.screenH) {
    canvas.width = metrics.screenW;
    canvas.height = metrics.screenH;
  }

  ctx.fillStyle = config.bgColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

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
      worker.post(imgData, metrics.cols, metrics.rows, config, useColor);
    }

    ctx.textBaseline = "top";
    ctx.textAlign = "start";
    if (worker.lastResult) {
      drawASCII(ctx, worker.lastResult, metrics, config);
    }

    const endTime = performance.now();
    gridInfo.textContent = `${metrics.cols}×${metrics.rows} grid`;
    charInfo.textContent = `${config.chars.length} variants`;
    msInfo.textContent = `${(endTime - startTime).toFixed(1)}ms`;

    frameCount++;
    const now = performance.now();
    if (now >= lastTime + 1000) {
      fpsInfo.textContent = `${frameCount} fps`;
      frameCount = 0;
      lastTime = now;
    }
  } else {
    ctx.fillStyle = config.textColor;
    ctx.font = `14px monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    
    const statusMsg = camera.stream 
      ? "CARREGANDO FLUXO DE VÍDEO..." 
      : "CÂMERA DESATIVADA / BLOQUEADA";
      
    ctx.fillText(statusMsg, canvas.width / 2, canvas.height / 2);
    
    ctx.textAlign = "start";
    ctx.textBaseline = "top";

    gridInfo.textContent = "0×0 grid";
    charInfo.textContent = "0 variants";
    msInfo.textContent = "0.0ms";
    fpsInfo.textContent = "0 fps";
    frameCount = 0;
  }

  requestAnimationFrame(renderLoop);
}

charInput.oninput = () => config.chars = charInput.value;
textColorInput.oninput = () => config.textColor = textColorInput.value;
bgColorInput.oninput = () => config.bgColor = bgColorInput.value;

fontRange.oninput = () => {
  config.fontSize = parseInt(fontRange.value);
  fontVal.textContent = fontRange.value;
};

contrastRange.oninput = () => {
  config.contrast = parseFloat(contrastRange.value);
  contrastVal.textContent = contrastRange.value;
};

brightRange.oninput = () => {
  config.brightness = parseFloat(brightRange.value);
  brightVal.textContent = brightRange.value;
};

colorBtn.onclick = () => {
  setUseColor(!useColor);
  updateColorModeUI();
};

btn.onclick = async () => {
  if (camera.stream) {
    camera.stop();
    btn.textContent = "START CAMERA";
  } else {
    const success = await camera.start();
    if (success) btn.textContent = "STOP CAMERA";
  }
};

charInput.oninput = () => config.chars = charInput.value;
textColorInput.oninput = () => config.textColor = textColorInput.value;
bgColorInput.oninput = () => config.bgColor = bgColorInput.value;

fontRange.oninput = () => {
  config.fontSize = parseInt(fontRange.value);
  fontVal.textContent = fontRange.value;
};

contrastRange.oninput = () => {
  config.contrast = parseFloat(contrastRange.value);
  contrastVal.textContent = contrastRange.value;
};

brightRange.oninput = () => {
  config.brightness = parseFloat(brightRange.value);
  brightVal.textContent = brightRange.value;
};

colorBtn.onclick = () => {
  setUseColor(!useColor);
  updateColorModeUI();
};

btn.onclick = async () => {
  if (camera.stream) {
    camera.stop();
    btn.textContent = "START CAMERA";
  } else {
    const success = await camera.start();
    if (success) btn.textContent = "STOP CAMERA";
  }
};

function syncGUI() {
  charInput.value = config.chars;
  fontRange.value = config.fontSize.toString();
  contrastRange.value = config.contrast.toString();
  brightRange.value = config.brightness.toString();
  textColorInput.value = config.textColor;
  bgColorInput.value = config.bgColor;

  fontVal.textContent = config.fontSize.toString();
  contrastVal.textContent = config.contrast.toString();
  brightVal.textContent = config.brightness.toString();
  charInfo.textContent = `${config.chars.length} variants`;

  updateColorModeUI();
}

syncGUI();
updateColorModeUI();
renderLoop();
camera.start().then(s => { if(s) btn.textContent = "STOP CAMERA"; });