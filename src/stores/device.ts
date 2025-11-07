// 设备状态管理
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Device, DeviceState, DeviceSimulatorState, Orientation } from '@/types/device';
import { DEVICE_CONFIG, deviceUtils } from '@/config/device.config';

export const useDeviceStore = defineStore('device', () => {
  // ========== 状态 ==========
  const currentDevice = ref<Device | null>(null);
  const devices = ref<Device[]>([]);
  const customDevices = ref<Device[]>([]);
  const showDeviceFrame = ref(true);
  const showDeviceInfo = ref(true);
  const autoRotate = ref(false);

  // 设备模拟器状态
  const simulatorState = ref<DeviceSimulatorState>({
    isSimulating: false,
    currentDevice: null,
    orientation: 'portrait',
    showBezels: true,
    showNotch: true,
    showStatusBar: true,
  });

  // 设备视图配置
  const viewConfig = ref({
    scale: 1,
    showGrid: true,
    showRulers: false,
    snapToDevice: false,
    fitToScreen: true,
  });

  // ========== 计算属性 ==========
  const allDevices = computed(() => [...devices.value, ...customDevices.value]);

  const currentDeviceId = computed(() => currentDevice.value?.id);

  const currentDeviceSize = computed(() => {
    if (!currentDevice.value) return { width: 0, height: 0 };
    return {
      width: currentDevice.value.width,
      height: currentDevice.value.height,
    };
  });

  const currentOrientation = computed((): Orientation => {
    if (!currentDevice.value) return 'portrait';
    return currentDevice.value.orientation;
  });

  const isPortrait = computed(() => currentOrientation.value === 'portrait');
  const isLandscape = computed(() => currentOrientation.value === 'landscape');

  const viewport = computed(() => {
    const { width, height } = currentDeviceSize.value;
    const { scale } = viewConfig.value;
    return {
      width: Math.round(width * scale),
      height: Math.round(height * scale),
      deviceWidth: width,
      deviceHeight: height,
      scale,
    };
  });

  // ========== 核心方法 ==========

  // 设备管理
  const initDevices = () => {
    devices.value = Object.values(DEVICE_CONFIG.PRESETS);
    if (devices.value.length > 0) {
      const defaultDevice = devices.value.find(d => d.isDefault) || devices.value[0];
      if (defaultDevice) {
        currentDevice.value = defaultDevice;
      }
    }
  };

  const initDevice = () => {
    initDevices();
  };

  const setCurrentDevice = (deviceId: string) => {
    const device = allDevices.value.find(d => d.id === deviceId);
    if (device) {
      currentDevice.value = device;
      simulatorState.value.currentDevice = device;
    }
  };

  const addCustomDevice = (device: Omit<Device, 'id'>) => {
    const newDevice: Device = {
      ...device,
      id: `custom-${Date.now()}`,
    };
    customDevices.value.push(newDevice);
    return newDevice;
  };

  const removeCustomDevice = (deviceId: string) => {
    const index = customDevices.value.findIndex(d => d.id === deviceId);
    if (index > -1) {
      customDevices.value.splice(index, 1);
    }
  };

  const updateCustomDevice = (deviceId: string, updates: Partial<Device>) => {
    const device = customDevices.value.find(d => d.id === deviceId);
    if (device) {
      Object.assign(device, updates);
    }
  };

  // 设备方向
  const setOrientation = (orientation: Orientation) => {
    if (currentDevice.value) {
      currentDevice.value.orientation = orientation;
      simulatorState.value.orientation = orientation;
    }
  };

  const toggleOrientation = () => {
    const newOrientation = isPortrait.value ? 'landscape' : 'portrait';
    setOrientation(newOrientation);
  };

  // 缩放管理
  const setScale = (scale: number) => {
    const minScale = 0.1;
    const maxScale = 5;
    viewConfig.value.scale = Math.min(Math.max(scale, minScale), maxScale);
  };

  const zoomIn = () => {
    const current = viewConfig.value.scale;
    const step = 0.25;
    setScale(current + step);
  };

  const zoomOut = () => {
    const current = viewConfig.value.scale;
    const step = 0.25;
    setScale(current - step);
  };

  const resetZoom = () => {
    viewConfig.value.scale = 1;
  };

  const fitToScreen = () => {
    // 计算适合屏幕的缩放比例
    // 这里可以根据容器大小动态计算
    setScale(0.8); // 默认值
  };

  // 设备模拟器
  const startSimulation = (deviceId?: string) => {
    simulatorState.value.isSimulating = true;
    if (deviceId) {
      const device = allDevices.value.find(d => d.id === deviceId);
      if (device) {
        simulatorState.value.currentDevice = device;
      }
    }
  };

  const stopSimulation = () => {
    simulatorState.value.isSimulating = false;
    simulatorState.value.currentDevice = null;
  };

  const toggleSimulation = () => {
    if (simulatorState.value.isSimulating) {
      stopSimulation();
    } else {
      startSimulation();
    }
  };

  // 视图控制
  const setViewConfig = (config: Partial<typeof viewConfig.value>) => {
    Object.assign(viewConfig.value, config);
  };

  const toggleDeviceFrame = () => {
    showDeviceFrame.value = !showDeviceFrame.value;
  };

  const toggleDeviceInfo = () => {
    showDeviceInfo.value = !showDeviceInfo.value;
  };

  const toggleAutoRotate = () => {
    autoRotate.value = !autoRotate.value;
  };

  // 设备预设
  const useDesktopPreset = () => {
    setCurrentDevice('desktop-1920x1080');
  };

  const useTabletPreset = () => {
    setCurrentDevice('tablet-ipad');
  };

  const useMobilePreset = () => {
    setCurrentDevice('mobile-iphone');
  };

  // 响应式断点
  const getCurrentBreakpoint = (width?: number) => {
    const viewportWidth = width || (currentDevice.value?.width || 0);
    return deviceUtils.getCurrentBreakpoint(viewportWidth);
  };

  const isBreakpointActive = (breakpointName: string) => {
    const currentBreakpoint = getCurrentBreakpoint();
    const breakpoints = DEVICE_CONFIG.BREAKPOINTS;
    const bp = breakpoints[breakpointName as keyof typeof breakpoints];
    const currentBp = breakpoints[currentBreakpoint as keyof typeof breakpoints];

    if (!bp || !currentBp) return false;

    return bp.minWidth >= currentBp.minWidth;
  };

  // 设备检测
  const detectDevice = (userAgent?: string) => {
    // 简化的设备检测逻辑
    const ua = userAgent || navigator.userAgent;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    const isTablet = /iPad|Android(?=.*\bTab\b)|Windows(?=.*\bTouch\b)/i.test(ua);

    let detectedType: 'desktop' | 'tablet' | 'mobile' = 'desktop';
    if (isMobile && !isTablet) {
      detectedType = 'mobile';
    } else if (isTablet) {
      detectedType = 'tablet';
    }

    const device = allDevices.value.find(d => d.type === detectedType);
    return {
      device,
      isMobile: detectedType === 'mobile',
      isTablet: detectedType === 'tablet',
      isDesktop: detectedType === 'desktop',
    };
  };

  // 导出设备信息
  const exportDeviceConfig = () => {
    return {
      currentDevice: currentDevice.value,
      devices: allDevices.value,
      customDevices: customDevices.value,
      simulatorState: simulatorState.value,
      viewConfig: viewConfig.value,
    };
  };

  const importDeviceConfig = (config: any) => {
    if (config.currentDevice) {
      currentDevice.value = config.currentDevice;
    }
    if (config.customDevices) {
      customDevices.value = config.customDevices;
    }
    if (config.simulatorState) {
      simulatorState.value = { ...simulatorState.value, ...config.simulatorState };
    }
    if (config.viewConfig) {
      viewConfig.value = { ...viewConfig.value, ...config.viewConfig };
    }
  };

  // ========== 返回 ==========
  return {
    // 状态
    currentDevice,
    devices,
    customDevices,
    showDeviceFrame,
    showDeviceInfo,
    autoRotate,
    simulatorState,
    viewConfig,

    // 计算属性
    allDevices,
    currentDeviceId,
    currentDeviceSize,
    currentOrientation,
    isPortrait,
    isLandscape,
    viewport,

    // 设备管理
    initDevices,
    initDevice,
    setCurrentDevice,
    addCustomDevice,
    removeCustomDevice,
    updateCustomDevice,

    // 方向控制
    setOrientation,
    toggleOrientation,

    // 缩放管理
    setScale,
    zoomIn,
    zoomOut,
    resetZoom,
    fitToScreen,

    // 模拟器
    startSimulation,
    stopSimulation,
    toggleSimulation,

    // 视图控制
    setViewConfig,
    toggleDeviceFrame,
    toggleDeviceInfo,
    toggleAutoRotate,

    // 预设
    useDesktopPreset,
    useTabletPreset,
    useMobilePreset,

    // 响应式
    getCurrentBreakpoint,
    isBreakpointActive,

    // 设备检测
    detectDevice,

    // 导入导出
    exportDeviceConfig,
    importDeviceConfig,
  };
});
