function getEl<T extends HTMLElement>(id: string): T {
  const el = document.getElementById(id);
  if (!el) {
    throw new Error(`Missing element: ${id}`);
  }
  return el as T;
}

export const dom = {
  wrap: getEl<HTMLElement>('canvas-wrap'),
  canvas: getEl<HTMLCanvasElement>('canvas'),

  controls: {
    charInput: getEl<HTMLInputElement>('chars-input'),
    fontRange: getEl<HTMLInputElement>('font-range'),
    contrastRange: getEl<HTMLInputElement>('contrast-range'),
    brightRange: getEl<HTMLInputElement>('bright-range'),
    textColorInput: getEl<HTMLInputElement>('text-color'),
    bgColorInput: getEl<HTMLInputElement>('bg-color'),

    fontVal: getEl<HTMLElement>('font-val'),
    contrastVal: getEl<HTMLElement>('contrast-val'),
    brightVal: getEl<HTMLElement>('bright-val'),

    groupTextColor: getEl<HTMLElement>('group-text-color'),
    groupBgColor: getEl<HTMLElement>('group-bg-color'),

    toggleBtn: getEl<HTMLButtonElement>('toggle'),
    colorBtn: getEl<HTMLButtonElement>('color-toggle'),
  },

  stats: {
    gridInfo: getEl<HTMLElement>('grid-info'),
    charInfo: getEl<HTMLElement>('char-info'),
    fpsInfo: getEl<HTMLElement>('fps-info'),
    msInfo: getEl<HTMLElement>('ms-info'),
  }
};