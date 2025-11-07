// 设备类型
export type DeviceType = 'desktop' | 'tablet' | 'mobile' | 'custom';

// 设备配置
export interface Device {
  id: string;
  type: DeviceType;
  name: string;
  width: number;
  height: number;
  pixelRatio: number;
  icon?: string;
  orientation: 'portrait' | 'landscape';
  isDefault?: boolean;
}

// 设备状态
export interface DeviceState {
  currentDevice: Device | null;
  devices: Device[];
  customDevices: Device[];
  showDeviceFrame: boolean;
  showDeviceInfo: boolean;
  autoRotate: boolean;
}

// 设备预设
export interface DevicePreset {
  id: string;
  name: string;
  type: DeviceType;
  width: number;
  height: number;
  description?: string;
}

// 响应式断点
export interface Breakpoint {
  name: string;
  minWidth: number;
  maxWidth?: number;
  label: string;
  icon?: string;
}

// 画布尺寸
export interface CanvasSize {
  width: number;
  height: number;
  scale: number; // 缩放比例
  viewWidth: number; // 视口宽度
  viewHeight: number; // 视口高度
}

// 设备模拟器状态
export interface DeviceSimulatorState {
  isSimulating: boolean;
  currentDevice: Device | null;
  orientation: 'portrait' | 'landscape';
  showBezels: boolean; // 显示设备边框
  showNotch: boolean; // 显示刘海
  showStatusBar: boolean; // 显示状态栏
}

// 设备方向
export type Orientation = 'portrait' | 'landscape';

// 缩放模式
export type ScaleMode = 'fit' | 'fill' | 'actual' | 'custom';

// 设备视图配置
export interface DeviceViewConfig {
  scale: number;
  showGrid: boolean;
  showRulers: boolean;
  snapToDevice: boolean;
  fitToScreen: boolean;
}

// 移动设备特殊配置
export interface MobileDeviceConfig {
  hasNotch: boolean;
  notchHeight?: number;
  homeIndicator: boolean;
  statusBarHeight: number;
  safeAreaInsets: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

// 平板设备特殊配置
export interface TabletDeviceConfig {
  hasHomeButton: boolean;
  aspectRatio: number;
}

// 桌面设备特殊配置
export interface DesktopDeviceConfig {
  showTaskbar: boolean;
  taskbarHeight: number;
  windowControls: boolean;
}

// 设备检测结果
export interface DeviceDetectionResult {
  device: Device | null;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  orientation: Orientation;
  viewportWidth: number;
  viewportHeight: number;
}
