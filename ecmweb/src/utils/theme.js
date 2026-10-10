function hexToRgb(hex) {
  const bigint = parseInt(hex.slice(1), 16);
  return [bigint >> 16 & 255, bigint >> 8 & 255, bigint & 255];
}
function rgbToHex(r, g, b) {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}
function adjustBrightness(hex, factor) {
  const rgb = hexToRgb(hex);
  const newRgb = rgb.map(
    (val) => Math.max(0, Math.min(255, Math.round(val + (255 - val) * factor)))
  );
  return rgbToHex(...newRgb);
}
function generateThemeColors(primary) {
  const colors = {
    primary
  };
  for (let i = 1; i <= 9; i++) {
    const factor = i * 0.1;
    colors[`primary-light-${i}`] = adjustBrightness(primary, factor);
  }
  colors["primary-dark-2"] = adjustBrightness(primary, -0.2);
  return colors;
}
function applyTheme(colors) {
  const el = document.documentElement;
  Object.entries(colors).forEach(([key, value]) => {
    el.style.setProperty(`--el-color-${key}`, value);
  });
}
function toggleDarkMode(isDark) {
  if (isDark) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}
function toggleSidebarColor(isBuleSidebar) {
  if (isBuleSidebar) {
    document.documentElement.classList.add("sidebar-color-blue");
  } else {
    document.documentElement.classList.remove("sidebar-color-blue");
  }
}
export {
  applyTheme,
  generateThemeColors,
  toggleDarkMode,
  toggleSidebarColor
};
