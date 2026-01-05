/**
 * Haptic feedback utilities for tablet interactions
 * Uses the Vibration API when available
 */

type HapticPattern = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';

const patterns: Record<HapticPattern, number | number[]> = {
  light: 10,
  medium: 25,
  heavy: 50,
  success: [10, 50, 10],
  warning: [25, 50, 25],
  error: [50, 100, 50, 100, 50],
};

/**
 * Check if haptic feedback is supported
 */
export function isHapticsSupported(): boolean {
  return 'vibrate' in navigator;
}

/**
 * Trigger haptic feedback
 */
export function haptic(pattern: HapticPattern = 'medium'): void {
  if (!isHapticsSupported()) return;

  try {
    navigator.vibrate(patterns[pattern]);
  } catch {
    // Silently fail if vibration is not allowed
  }
}

/**
 * Haptic feedback presets for common actions
 */
export const haptics = {
  /** Light tap feedback */
  tap: () => haptic('light'),

  /** Medium feedback for selections */
  select: () => haptic('medium'),

  /** Heavy feedback for important actions */
  impact: () => haptic('heavy'),

  /** Success pattern (double tap) */
  success: () => haptic('success'),

  /** Warning pattern */
  warning: () => haptic('warning'),

  /** Error pattern (triple tap) */
  error: () => haptic('error'),
};
