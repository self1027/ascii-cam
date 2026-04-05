import { config } from '../core/config';
import { updateColorModeUI } from './colorMode';

export function bindControls(dom: any, camera: any) {
  const c = dom.controls;

  c.charInput.oninput = () => config.chars = c.charInput.value;
  c.textColorInput.oninput = () => config.textColor = c.textColorInput.value;
  c.bgColorInput.oninput = () => config.bgColor = c.bgColorInput.value;

  c.fontRange.oninput = () => {
    config.fontSize = parseInt(c.fontRange.value);
    c.fontVal.textContent = c.fontRange.value;
  };

  c.contrastRange.oninput = () => {
    config.contrast = parseFloat(c.contrastRange.value);
    c.contrastVal.textContent = c.contrastRange.value;
  };

  c.brightRange.oninput = () => {
    config.brightness = parseFloat(c.brightRange.value);
    c.brightVal.textContent = c.brightRange.value;
  };

  c.colorBtn.onclick = () => {
    config.useColor = !config.useColor;
    updateColorModeUI(config.useColor, c);
    };

  c.toggleBtn.onclick = async () => {
    if (camera.stream) {
      camera.stop();
      c.toggleBtn.textContent = "START CAMERA";
    } else {
      const success = await camera.start();
      if (success) c.toggleBtn.textContent = "STOP CAMERA";
    }
  };
}

export function syncGUI(dom: any) {
  const c = dom.controls;

  c.charInput.value = config.chars;
  c.fontRange.value = config.fontSize.toString();
  c.contrastRange.value = config.contrast.toString();
  c.brightRange.value = config.brightness.toString();
  c.textColorInput.value = config.textColor;
  c.bgColorInput.value = config.bgColor;

  c.fontVal.textContent = config.fontSize.toString();
  c.contrastVal.textContent = config.contrast.toString();
  c.brightVal.textContent = config.brightness.toString();

  updateColorModeUI(config.useColor, c);
}