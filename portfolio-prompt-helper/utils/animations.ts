import { withTiming, withSpring, Easing } from 'react-native-reanimated';

// Animation presets
export const AnimationPresets = {
  // Fade animations
  fadeIn: (duration = 300) =>
    withTiming(1, {
      duration,
      easing: Easing.inOut(Easing.ease),
    }),

  fadeOut: (duration = 300) =>
    withTiming(0, {
      duration,
      easing: Easing.inOut(Easing.ease),
    }),

  // Scale animations
  scaleIn: (duration = 300) =>
    withSpring(1, {
      damping: 15,
      stiffness: 150,
    }),

  scaleOut: (duration = 300) =>
    withSpring(0, {
      damping: 15,
      stiffness: 150,
    }),

  // Slide animations
  slideInUp: (duration = 300) =>
    withTiming(0, {
      duration,
      easing: Easing.out(Easing.cubic),
    }),

  slideInDown: (duration = 300) =>
    withTiming(0, {
      duration,
      easing: Easing.out(Easing.cubic),
    }),

  // Bounce animation
  bounce: () =>
    withSpring(1, {
      damping: 8,
      stiffness: 100,
    }),

  // Smooth spring
  smoothSpring: () =>
    withSpring(1, {
      damping: 20,
      stiffness: 90,
    }),
};

// Animation durations
export const AnimationDuration = {
  fast: 150,
  normal: 300,
  slow: 500,
};

// Easing functions
export const AnimationEasing = {
  easeIn: Easing.in(Easing.ease),
  easeOut: Easing.out(Easing.ease),
  easeInOut: Easing.inOut(Easing.ease),
  linear: Easing.linear,
  bounce: Easing.bounce,
  elastic: Easing.elastic(1),
};
