import './styles/main.css';

import { dom } from './dom';
import { CameraService } from './services/camera';
import { WorkerService } from './services/ascii.worker';
import { bindControls, syncGUI } from './ui/controls';
import { startRenderLoop } from './core/loop';

const ctx = dom.canvas.getContext('2d', { alpha: false })!;
const buffer = document.createElement('canvas');
const bctx = buffer.getContext('2d', { willReadFrequently: true })!;

const camera = new CameraService();
const worker = new WorkerService();

bindControls(dom, camera);
syncGUI(dom);

startRenderLoop({
  dom,
  ctx,
  buffer,
  bctx,
  camera,
  worker
});

camera.start().then(s => {
  if (s) dom.controls.toggleBtn.textContent = "STOP CAMERA";
});