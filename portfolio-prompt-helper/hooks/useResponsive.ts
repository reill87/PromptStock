import { useState, useEffect } from 'react';
import { Dimensions, ScaledSize } from 'react-native';

export type DeviceType = 'phone' | 'tablet';
export type Orientation = 'portrait' | 'landscape';

interface ResponsiveInfo {
  width: number;
  height: number;
  isTablet: boolean;
  isPhone: boolean;
  isLandscape: boolean;
  isPortrait: boolean;
  deviceType: DeviceType;
  orientation: Orientation;
}

const TABLET_BREAKPOINT = 768;

function getDeviceInfo(dimensions: ScaledSize): ResponsiveInfo {
  const { width, height } = dimensions;
  const isLandscape = width > height;
  const isTablet = Math.min(width, height) >= TABLET_BREAKPOINT;

  return {
    width,
    height,
    isTablet,
    isPhone: !isTablet,
    isLandscape,
    isPortrait: !isLandscape,
    deviceType: isTablet ? 'tablet' : 'phone',
    orientation: isLandscape ? 'landscape' : 'portrait',
  };
}

export function useResponsive(): ResponsiveInfo {
  const [deviceInfo, setDeviceInfo] = useState<ResponsiveInfo>(() =>
    getDeviceInfo(Dimensions.get('window'))
  );

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDeviceInfo(getDeviceInfo(window));
    });

    return () => subscription?.remove();
  }, []);

  return deviceInfo;
}

// Utility hook for responsive values
export function useResponsiveValue<T>(values: {
  phone?: T;
  tablet?: T;
  default: T;
}): T {
  const { isTablet } = useResponsive();

  if (isTablet && values.tablet !== undefined) {
    return values.tablet;
  }

  if (!isTablet && values.phone !== undefined) {
    return values.phone;
  }

  return values.default;
}

// Grid columns based on device type
export function useResponsiveColumns(config?: {
  phone?: number;
  tablet?: number;
  tabletLandscape?: number;
}): number {
  const { isTablet, isLandscape } = useResponsive();

  if (isTablet && isLandscape && config?.tabletLandscape) {
    return config.tabletLandscape;
  }

  if (isTablet && config?.tablet) {
    return config.tablet;
  }

  return config?.phone || 1;
}
