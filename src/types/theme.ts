// 主题类型
export type ThemeMode = 'light' | 'dark' | 'auto';

// 主题变量
export interface ThemeVariables {
  // 颜色
  '--color-primary': string;
  '--color-primary-foreground': string;
  '--color-secondary': string;
  '--color-secondary-foreground': string;
  '--color-background': string;
  '--color-foreground': string;
  '--color-muted': string;
  '--color-muted-foreground': string;
  '--color-accent': string;
  '--color-accent-foreground': string;
  '--color-destructive': string;
  '--color-destructive-foreground': string;
  '--color-border': string;
  '--color-input': string;
  '--color-ring': string;

  // 阴影
  '--shadow-sm': string;
  '--shadow': string;
  '--shadow-md': string;
  '--shadow-lg': string;
  '--shadow-xl': string;

  // 边框半径
  '--radius-sm': string;
  '--radius': string;
  '--radius-md': string;
  '--radius-lg': string;
  '--radius-full': string;

  // 字体
  '--font-family': string;
  '--font-size-xs': string;
  '--font-size-sm': string;
  '--font-size-base': string;
  '--font-size-lg': string;
  '--font-size-xl': string;
  '--font-size-2xl': string;
  '--font-size-3xl': string;

  // 间距
  '--spacing-1': string;
  '--spacing-2': string;
  '--spacing-3': string;
  '--spacing-4': string;
  '--spacing-6': string;
  '--spacing-8': string;
  '--spacing-12': string;
  '--spacing-16': string;
  '--spacing-20': string;

  // 动画
  '--transition-fast': string;
  '--transition-normal': string;
  '--transition-slow': string;
}

// 主题配置
export interface ThemeConfig {
  name: string;
  label: string;
  mode: ThemeMode;
  variables: ThemeVariables;
  extends?: string; // 继承的主题名称
  description?: string;
  author?: string;
  version?: string;
}

// 主题预设
export interface ThemePreset {
  id: string;
  name: string;
  label: string;
  mode: ThemeMode;
  isDefault?: boolean;
  isCustom?: boolean;
  config: ThemeConfig;
}

// 主题状态
export interface ThemeState {
  currentMode: ThemeMode;
  currentPreset: ThemePreset | null;
  presets: ThemePreset[];
  customPresets: ThemePreset[];
  systemPrefersDark: boolean;
  autoSave: boolean;
}

// 主题切换选项
export interface ThemeSwitchOptions {
  persist?: boolean;
  duration?: number;
  transition?: string;
}

// 颜色工具类型
export interface ColorPalette {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  950: string;
}

// 渐变色
export interface GradientConfig {
  type: 'linear' | 'radial' | 'conic';
  angle?: number;
  stops: Array<{
    color: string;
    position: number; // 0-100
  }>;
}

// 主题生成选项
export interface ThemeGenerationOptions {
  primaryColor: string;
  mode: 'light' | 'dark';
  radius: 'none' | 'sm' | 'md' | 'lg' | 'full';
  fontFamily: string;
  customColors?: Record<string, string>;
}

// 组件库主题适配
export interface LibraryThemeAdapter {
  library: 'shadcn' | 'element' | 'antd';
  applyTheme: (variables: ThemeVariables) => void;
  removeTheme: () => void;
}

// 主题导入导出
export interface ThemeExportData {
  config: ThemeConfig;
  metadata: {
    exportDate: number;
    version: string;
    platform: string;
  };
}
