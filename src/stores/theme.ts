// 主题状态管理
import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import type { ThemeState, ThemePreset, ThemeConfig, ThemeMode } from '@/types/theme';

export const useThemeStore = defineStore('theme', () => {
  // ========== 状态 ==========
  const currentMode = ref<ThemeMode>('light');
  const currentPreset = ref<ThemePreset | null>(null);
  const presets = ref<ThemePreset[]>([]);
  const customPresets = ref<ThemePreset[]>([]);
  const systemPrefersDark = ref(false);
  const autoSave = ref(true);

  // 主题变量
  const themeVariables = ref<Record<string, string>>({});

  // 默认主题预设
  const defaultPresets: ThemePreset[] = [
    {
      id: 'light',
      name: 'light',
      label: '浅色主题',
      mode: 'light',
      isDefault: true,
      config: {
        name: 'light',
        label: '浅色主题',
        mode: 'light',
        variables: {
          '--color-primary': '#2b8cee',
          '--color-primary-foreground': '#ffffff',
          '--color-secondary': '#f6f7f8',
          '--color-secondary-foreground': '#1e293b',
          '--color-background': '#ffffff',
          '--color-foreground': '#1e293b',
          '--color-muted': '#f6f7f8',
          '--color-muted-foreground': '#64748b',
          '--color-accent': '#f6f7f8',
          '--color-accent-foreground': '#1e293b',
          '--color-destructive': '#ef4444',
          '--color-destructive-foreground': '#ffffff',
          '--color-border': '#e2e8f0',
          '--color-input': '#ffffff',
          '--color-ring': '#2b8cee',
          '--shadow-sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
          '--shadow': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
          '--shadow-md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
          '--shadow-lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
          '--shadow-xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
          '--radius-sm': '0.125rem',
          '--radius': '0.25rem',
          '--radius-md': '0.375rem',
          '--radius-lg': '0.5rem',
          '--radius-full': '9999px',
          '--font-family': 'Inter, system-ui, sans-serif',
          '--font-size-xs': '0.75rem',
          '--font-size-sm': '0.875rem',
          '--font-size-base': '1rem',
          '--font-size-lg': '1.125rem',
          '--font-size-xl': '1.25rem',
          '--font-size-2xl': '1.5rem',
          '--font-size-3xl': '1.875rem',
          '--spacing-1': '0.25rem',
          '--spacing-2': '0.5rem',
          '--spacing-3': '0.75rem',
          '--spacing-4': '1rem',
          '--spacing-6': '1.5rem',
          '--spacing-8': '2rem',
          '--spacing-12': '3rem',
          '--spacing-16': '4rem',
          '--spacing-20': '5rem',
          '--transition-fast': '150ms',
          '--transition-normal': '300ms',
          '--transition-slow': '500ms',
        },
      },
    },
    {
      id: 'dark',
      name: 'dark',
      label: '深色主题',
      mode: 'dark',
      isDefault: true,
      config: {
        name: 'dark',
        label: '深色主题',
        mode: 'dark',
        variables: {
          '--color-primary': '#2b8cee',
          '--color-primary-foreground': '#ffffff',
          '--color-secondary': '#1e293b',
          '--color-secondary-foreground': '#f1f5f9',
          '--color-background': '#0f172a',
          '--color-foreground': '#f1f5f9',
          '--color-muted': '#1e293b',
          '--color-muted-foreground': '#94a3b8',
          '--color-accent': '#1e293b',
          '--color-accent-foreground': '#f1f5f9',
          '--color-destructive': '#ef4444',
          '--color-destructive-foreground': '#ffffff',
          '--color-border': '#1e293b',
          '--color-input': '#1e293b',
          '--color-ring': '#2b8cee',
          '--shadow-sm': '0 1px 2px 0 rgb(0 0 0 / 0.3)',
          '--shadow': '0 1px 3px 0 rgb(0 0 0 / 0.3), 0 1px 2px -1px rgb(0 0 0 / 0.3)',
          '--shadow-md': '0 4px 6px -1px rgb(0 0 0 / 0.3), 0 2px 4px -2px rgb(0 0 0 / 0.3)',
          '--shadow-lg': '0 10px 15px -3px rgb(0 0 0 / 0.3), 0 4px 6px -4px rgb(0 0 0 / 0.3)',
          '--shadow-xl': '0 20px 25px -5px rgb(0 0 0 / 0.3), 0 8px 10px -6px rgb(0 0 0 / 0.3)',
          '--radius-sm': '0.125rem',
          '--radius': '0.25rem',
          '--radius-md': '0.375rem',
          '--radius-lg': '0.5rem',
          '--radius-full': '9999px',
          '--font-family': 'Inter, system-ui, sans-serif',
          '--font-size-xs': '0.75rem',
          '--font-size-sm': '0.875rem',
          '--font-size-base': '1rem',
          '--font-size-lg': '1.125rem',
          '--font-size-xl': '1.25rem',
          '--font-size-2xl': '1.5rem',
          '--font-size-3xl': '1.875rem',
          '--spacing-1': '0.25rem',
          '--spacing-2': '0.5rem',
          '--spacing-3': '0.75rem',
          '--spacing-4': '1rem',
          '--spacing-6': '1.5rem',
          '--spacing-8': '2rem',
          '--spacing-12': '3rem',
          '--spacing-16': '4rem',
          '--spacing-20': '5rem',
          '--transition-fast': '150ms',
          '--transition-normal': '300ms',
          '--transition-slow': '500ms',
        },
      },
    },
  ];

  // ========== 计算属性 ==========
  const allPresets = computed(() => [...presets.value, ...customPresets.value]);

  const currentTheme = computed(() => currentPreset.value);

  const isDark = computed(() => {
    if (currentMode.value === 'dark') return true;
    if (currentMode.value === 'auto') return systemPrefersDark.value;
    return false;
  });

  const availablePresets = computed(() => {
    return allPresets.value.filter(p => p.mode === currentMode.value);
  });

  // ========== 初始化 ==========
  const initTheme = () => {
    presets.value = defaultPresets;
    loadSavedTheme();
    detectSystemTheme();
  };

  // ========== 主题切换 ==========
  const setTheme = (presetId: string) => {
    const preset = allPresets.value.find(p => p.id === presetId);
    if (preset) {
      currentPreset.value = preset;
      currentMode.value = preset.mode;
      applyTheme(preset.config.variables);
      saveTheme(preset.id);
    }
  };

  const setMode = (mode: ThemeMode) => {
    currentMode.value = mode;

    // 自动选择对应模式的主题
    const matchingPreset = allPresets.value.find(p => p.mode === mode);
    if (matchingPreset) {
      setTheme(matchingPreset.id);
    }
  };

  const toggleTheme = () => {
    const newMode = isDark.value ? 'light' : 'dark';
    setMode(newMode);
  };

  // ========== 主题应用 ==========
  const applyTheme = (variables: Record<string, string>) => {
    themeVariables.value = variables;
    const root = document.documentElement;

    // 应用CSS变量
    Object.entries(variables).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    // 设置data属性用于Tailwind dark mode
    if (isDark.value) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // 通知所有组件库更新主题
    document.dispatchEvent(new CustomEvent('theme-change', {
      detail: { mode: currentMode.value, variables }
    }));
  };

  // ========== 主题创建 ==========
  const createCustomTheme = (config: Omit<ThemeConfig, 'name' | 'label'> & { name: string; label: string }) => {
    const preset: ThemePreset = {
      id: `custom-${Date.now()}`,
      name: config.name,
      label: config.label,
      mode: config.mode,
      isCustom: true,
      config,
    };

    customPresets.value.push(preset);
    return preset;
  };

  const deleteCustomTheme = (presetId: string) => {
    const index = customPresets.value.findIndex(p => p.id === presetId);
    if (index > -1) {
      customPresets.value.splice(index, 1);
    }
  };

  const updateCustomTheme = (presetId: string, updates: Partial<ThemeConfig>) => {
    const preset = customPresets.value.find(p => p.id === presetId);
    if (preset) {
      Object.assign(preset.config, updates);
    }
  };

  // ========== 主题生成 ==========
  const generateTheme = (primaryColor: string, mode: 'light' | 'dark' = 'light') => {
    // 简化的主题生成逻辑
    const basePreset = defaultPresets.find(p => p.id === mode);
    if (!basePreset) {
      console.error('Base preset not found for mode:', mode);
      return null;
    }

    const baseVariables = basePreset.config.variables;
    const newVariables = { ...baseVariables };

    // 更新主色
    newVariables['--color-primary'] = primaryColor;

    const name = `${mode}-${primaryColor.replace('#', '')}`;
    const label = `${mode === 'light' ? '浅色' : '深色'}主题 - ${primaryColor}`;

    const config: ThemeConfig = {
      name,
      label,
      mode,
      variables: newVariables,
    };

    return createCustomTheme(config);
  };

  // ========== 持久化 ==========
  const saveTheme = (presetId: string) => {
    if (autoSave.value) {
      localStorage.setItem('stitcher-theme', presetId);
      localStorage.setItem('stitcher-theme-mode', currentMode.value);
    }
  };

  const loadSavedTheme = () => {
    const savedPresetId = localStorage.getItem('stitcher-theme');
    const savedMode = localStorage.getItem('stitcher-theme-mode') as ThemeMode;

    if (savedMode) {
      currentMode.value = savedMode;
    }

    if (savedPresetId) {
      const preset = allPresets.value.find(p => p.id === savedPresetId);
      if (preset) {
        setTheme(savedPresetId);
      } else {
        // 如果保存的主题不存在，使用默认主题
        setTheme(currentMode.value === 'dark' ? 'dark' : 'light');
      }
    } else {
      // 没有保存的主题，使用默认主题
      setTheme(currentMode.value === 'dark' ? 'dark' : 'light');
    }
  };

  const detectSystemTheme = () => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    systemPrefersDark.value = mediaQuery.matches;

    // 监听系统主题变化
    mediaQuery.addEventListener('change', (e) => {
      systemPrefersDark.value = e.matches;
      if (currentMode.value === 'auto') {
        applyAutoTheme();
      }
    });
  };

  const applyAutoTheme = () => {
    if (currentMode.value === 'auto') {
      const targetMode = systemPrefersDark.value ? 'dark' : 'light';
      const matchingPreset = allPresets.value.find(p => p.id === targetMode);
      if (matchingPreset) {
        setTheme(matchingPreset.id);
      }
    }
  };

  // ========== 导入导出 ==========
  const exportTheme = (presetId: string) => {
    const preset = allPresets.value.find(p => p.id === presetId);
    if (!preset) return null;

    return {
      config: preset.config,
      metadata: {
        exportDate: Date.now(),
        version: '1.0.0',
        platform: 'stitcher',
      },
    };
  };

  const importTheme = (data: any) => {
    try {
      if (data.config && data.config.variables) {
        return createCustomTheme(data.config);
      }
    } catch (error) {
      console.error('Failed to import theme:', error);
      return null;
    }
  };

  // ========== 颜色工具 ==========
  const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result || !result[1] || !result[2] || !result[3]) {
      return null;
    }
    return {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    };
  };

  const rgbToHex = (r: number, g: number, b: number): string => {
    const red = r || 0;
    const green = g || 0;
    const blue = b || 0;
    return "#" + ((1 << 24) + (red << 16) + (green << 8) + blue).toString(16).slice(1);
  };

  const lighten = (hex: string, percent: number): string => {
    const rgb = hexToRgb(hex);
    if (!rgb) return hex;

    const { r, g, b } = rgb;
    const factor = 1 + (percent / 100);

    return rgbToHex(
      Math.min(255, Math.round(r * factor)),
      Math.min(255, Math.round(g * factor)),
      Math.min(255, Math.round(b * factor))
    );
  };

  const darken = (hex: string, percent: number): string => {
    return lighten(hex, -percent);
  };

  // ========== 监听 ==========
  // 监听模式变化，自动应用主题
  watch(currentMode, (newMode) => {
    if (newMode === 'auto') {
      applyAutoTheme();
    } else {
      const matchingPreset = allPresets.value.find(p => p.id === newMode);
      if (matchingPreset) {
        setTheme(matchingPreset.id);
      }
    }
  });

  // ========== 返回 ==========
  return {
    // 状态
    currentMode,
    currentPreset,
    presets,
    customPresets,
    systemPrefersDark,
    autoSave,
    themeVariables,

    // 计算属性
    currentTheme,
    isDark,
    availablePresets,
    allPresets,

    // 初始化
    initTheme,

    // 主题切换
    setTheme,
    setMode,
    toggleTheme,

    // 主题应用
    applyTheme,

    // 自定义主题
    createCustomTheme,
    deleteCustomTheme,
    updateCustomTheme,
    generateTheme,

    // 系统主题
    detectSystemTheme,
    applyAutoTheme,

    // 持久化
    saveTheme,
    loadSavedTheme,

    // 导入导出
    exportTheme,
    importTheme,

    // 颜色工具
    hexToRgb,
    rgbToHex,
    lighten,
    darken,
  };
});
