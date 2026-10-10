import defaultSettings from "@/settings";
import { SidebarColorEnum, ThemeEnum } from "@/enums/ThemeEnum";
import { generateThemeColors, applyTheme, toggleDarkMode, toggleSidebarColor } from "@/utils/theme";
const useSettingsStore = defineStore("setting", () => {
  const settingsVisible = ref(false);
  const tagsView = useStorage("tagsView", defaultSettings.tagsView);
  const sidebarLogo = useStorage("sidebarLogo", defaultSettings.sidebarLogo);
  const sidebarColorScheme = useStorage(
    "sidebarColorScheme",
    defaultSettings.sidebarColorScheme
  );
  const layout = useStorage("layout", defaultSettings.layout);
  const watermarkEnabled = useStorage(
    "watermarkEnabled",
    defaultSettings.watermarkEnabled
  );
  const themeColor = useStorage("themeColor", defaultSettings.themeColor);
  const theme = useStorage("theme", defaultSettings.theme);
  watch(
    [theme, themeColor],
    ([newTheme, newThemeColor]) => {
      toggleDarkMode(newTheme === ThemeEnum.DARK);
      const colors = generateThemeColors(newThemeColor);
      applyTheme(colors);
    },
    { immediate: true }
  );
  watch(
    [sidebarColorScheme],
    ([newSidebarColorScheme]) => {
      toggleSidebarColor(newSidebarColorScheme === SidebarColorEnum.CLASSIC_BLUE);
    },
    { immediate: true }
  );
  const settingsMap = {
    tagsView,
    sidebarLogo,
    sidebarColorScheme,
    layout,
    watermarkEnabled
  };
  function changeSetting({ key, value }) {
    const setting = settingsMap[key];
    if (setting) setting.value = value;
  }
  function changeTheme(val) {
    theme.value = val;
  }
  function changeSidebarColor(val) {
    sidebarColorScheme.value = val;
  }
  function changeThemeColor(color) {
    themeColor.value = color;
  }
  function changeLayout(val) {
    layout.value = val;
  }
  return {
    settingsVisible,
    tagsView,
    sidebarLogo,
    sidebarColorScheme,
    layout,
    themeColor,
    theme,
    watermarkEnabled,
    changeSetting,
    changeTheme,
    changeThemeColor,
    changeLayout,
    changeSidebarColor
  };
});
export {
  useSettingsStore
};
