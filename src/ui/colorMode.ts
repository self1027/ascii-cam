export function updateColorModeUI(useColor: boolean, elements: any) {
  const { colorBtn, groupTextColor, groupBgColor } = elements;

  colorBtn.textContent = `COLOR: ${useColor ? "ON" : "OFF"}`;
  colorBtn.classList.toggle('active', useColor);

  groupTextColor.classList.toggle('disabled', useColor);
  groupBgColor.classList.toggle('disabled', useColor);
}