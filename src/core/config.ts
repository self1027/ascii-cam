export interface Config {
  chars: string;
  fontSize: number;
  contrast: number;
  brightness: number;
  textColor: string;
  bgColor: string;
}

export const config: Config = {
  chars: " .:-;+*?%S#@",
  fontSize: 9,
  contrast: 1,
  brightness: 1,
  textColor: "#00ff88",
  bgColor: "#000000"
};

export let useColor = false;
export const setUseColor = (val: boolean) => useColor = val;