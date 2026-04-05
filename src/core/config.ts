export interface Config {
  chars: string;
  fontSize: number;
  contrast: number;
  brightness: number;
  textColor: string;
  bgColor: string;
  useColor: boolean; // 👈 aqui
}

export const config: Config = {
  chars: " .:-;+*?%S#@",
  fontSize: 9,
  contrast: 1,
  brightness: 1,
  textColor: "#00ff88",
  bgColor: "#000000",
  useColor: false
};