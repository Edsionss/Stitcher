// 设备配置
export const DEVICE_CONFIG = {
  // 预设设备
  PRESETS: {
    DESKTOP_1920x1080: {
      id: 'desktop-1920x1080',
      type: 'desktop' as const,
      name: '桌面设备',
      width: 1920,
      height: 1080,
      pixelRatio: 1,
      icon: 'desktop',
      orientation: 'landscape' as const,
      isDefault: true,
    },
    TABLET_IPAD: {
      id: 'tablet-ipad',
      type: 'tablet' as const,
      name: 'iPad',
      width: 768,
      height: 1024,
      pixelRatio: 2,
      icon: 'tablet',
      orientation: 'portrait' as const,
    },
    MOBILE_IPHONE: {
      id: 'mobile-iphone',
      type: 'mobile' as const,
      name: 'iPhone',
      width: 375,
      height: 812,
      pixelRatio: 3,
      icon: 'smartphone',
      orientation: 'portrait' as const,
    },
  },

  // 响应式断点
  BREAKPOINTS: {
    sm: {
      name: 'sm',
      minWidth: 640,
      label: '小屏幕',
      icon: 'smartphone',
    },
    md: {
      name: 'md',
      minWidth: 768,
      label: '中屏幕',
      icon: 'tablet',
    },
    lg: {
      name: 'lg',
      minWidth: 1024,
      label: '大屏幕',
      icon: 'laptop',
    },
    xl: {
      name: 'xl',
      minWidth: 1280,
      label: '超大屏幕',
      icon: 'desktop',
    },
    '2xl': {
      name: '2xl',
      minWidth: 1536,
      label: '超大桌面',
      icon: 'monitor',
    },
  },

  // 画布缩放选项
  SCALE_OPTIONS: [
    { value: 0.25, label: '25%' },
    { value: 0.5, label: '50%' },
    { value: 0.75, label: '75%' },
    { value: 1, label: '100%' },
    { value: 1.25, label: '125%' },
    { value: 1.5, label: '150%' },
    { value: 2, label: '200%' },
  ],

  // 默认配置
  DEFAULTS: {
    currentDevice: 'desktop-1920x1080',
    showDeviceFrame: true,
    showDeviceInfo: true,
    autoRotate: false,
    fitToScreen: true,
    showGrid: true,
    showRulers: false,
    snapToDevice: false,
  },

  // 设备边框样式
  DEVICE_FRAMES: {
    enabled: true,
    style: {
      border: '2px solid #e0e0e0',
      borderRadius: '12px',
      background: '#f5f5f5',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    },
    mobile: {
      borderRadius: '24px',
      hasNotch: true,
    },
    tablet: {
      borderRadius: '16px',
      hasHomeButton: false,
    },
  },

  // 缩放模式
  SCALE_MODES: {
    fit: {
      name: 'fit',
      label: '适应屏幕',
      description: '自动调整缩放比例以适应屏幕',
    },
    fill: {
      name: 'fill',
      label: '填充屏幕',
      description: '充满整个视口',
    },
    actual: {
      name: 'actual',
      label: '实际尺寸',
      description: '1:1 实际尺寸显示',
    },
    custom: {
      name: 'custom',
      label: '自定义',
      description: '手动设置缩放比例',
    },
  },

  // 设备状态栏信息
  STATUS_BAR: {
    show: true,
    height: 24,
    backgroundColor: '#000000',
    textColor: '#ffffff',
    elements: ['time', 'battery', 'signal', 'wifi'],
  },

  // 安全区域
  SAFE_AREA: {
    enabled: true,
    color: '#ff0000',
    opacity: 0.3,
    label: '安全区域',
  },
};

// 设备工具函数
export const deviceUtils = {
  // 获取设备尺寸
  getDeviceSize: (deviceId: string): { width: number; height: number } | null => {
    const device = Object.values(DEVICE_CONFIG.PRESETS).find(d => d.id === deviceId);
    return device ? { width: device.width, height: device.height } : null;
  },

  // 获取当前断点
  getCurrentBreakpoint: (width: number): string => {
    const breakpoints = DEVICE_CONFIG.BREAKPOINTS;
    for (const [name, breakpoint] of Object.entries(breakpoints)) {
      if (width >= breakpoint.minWidth) {
        return name;
      }
    }
    return '2xl';
  },

  // 检查是否是移动设备
  isMobile: (deviceType: string): boolean => {
    return deviceType === 'mobile';
  },

  // 检查是否是平板设备
  isTablet: (deviceType: string): boolean => {
    return deviceType === 'tablet';
  },

  // 检查是否是桌面设备
  isDesktop: (deviceType: string): boolean => {
    return deviceType === 'desktop';
  },

  // 计算缩放比例
  calculateScale: (
    containerWidth: number,
    containerHeight: number,
    deviceWidth: number,
    deviceHeight: number,
    mode: 'fit' | 'fill' | 'actual' | 'custom' = 'fit',
    customScale = 1
  ): number => {
    switch (mode) {
      case 'fill':
        return Math.min(containerWidth / deviceWidth, containerHeight / deviceHeight);
      case 'actual':
        return 1;
      case 'custom':
        return customScale;
      case 'fit':
      default:
        return Math.min(containerWidth / deviceWidth, containerHeight / deviceHeight);
    }
  },

  // 格式化设备名称
  formatDeviceName: (width: number, height: number): string => {
    return `${width} × ${height}`;
  },

  // 获取设备方向
  getOrientation: (width: number, height: number): 'portrait' | 'landscape' => {
    return width > height ? 'landscape' : 'portrait';
  },
};
