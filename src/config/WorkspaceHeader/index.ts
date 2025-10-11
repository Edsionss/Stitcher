interface DeviceModeStyle {
  width?: string
  height?: string
  left?: string
  [key: string]: string
}

interface DeviceMode {
  label: string
  icon: string
  style: DeviceModeStyle
}

interface DeviceModes {
  PC: DeviceMode
  Phone: DeviceMode
  Pad: DeviceMode
}

export default {
  SYSTEM_ICON: 'icon/svg/Stitcher.svg',
  SYSTEM_NAME: 'Stitcher',
  SYSTEM_VERSION_NUMBER: '0.0.1',
  SYSTEM_VERSION_LABEL: 'Beta',
  SYSTEM_DEVICE_MODES: {
    PC: {
      label: 'PC',
      icon: 'icon/svg/computer.svg',
      style: {
        //暂不做特定要求
        width: 'calc((100% - 752px) - 60px)',
        left: 'calc(350px + 30px)',
        height: 'calc(100% - 40px)'
      }
    },
    Phone: {
      label: 'Phone',
      icon: 'icon/svg/phone.svg',
      style: {
        //iphone12 pro  的分辨率
        width: '390px',
        height: '844px',
        left: 'calc(350px + ((100% - 752px) - 390px) / 2)'
      }
    },
    Pad: {
      label: 'Pad',
      icon: 'icon/svg/pad.svg',
      style: {
        //ipad mini的分辨率768 * 1024
        width: '768px',
        height: '1024px',
        left: 'calc(350px + ((100% - 752px) - 768px) / 2)'
      }
    }
  } as DeviceModes,
  SYSTEM_CONFIG: {},
  SYSTEM_DEFAULT_DEVICE_MODE: 'Phone',
  SYSTEM_FUNCTIONS: {}
}