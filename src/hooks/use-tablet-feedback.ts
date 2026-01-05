import { useCallback } from 'react';

import { haptics } from '@/lib/haptics';
import { sounds } from '@/lib/sounds';

type FeedbackType = 'tap' | 'success' | 'error' | 'warning';

/**
 * Hook that combines haptic and sound feedback for tablet interactions
 */
export function useTabletFeedback() {
  const feedback = useCallback((type: FeedbackType) => {
    switch (type) {
      case 'tap':
        haptics.tap();
        sounds.tap();
        break;
      case 'success':
        haptics.success();
        sounds.success();
        break;
      case 'error':
        haptics.error();
        sounds.error();
        break;
      case 'warning':
        haptics.warning();
        sounds.warning();
        break;
    }
  }, []);

  return {
    feedback,
    tap: useCallback(() => feedback('tap'), [feedback]),
    success: useCallback(() => feedback('success'), [feedback]),
    error: useCallback(() => feedback('error'), [feedback]),
    warning: useCallback(() => feedback('warning'), [feedback]),
  };
}

/**
 * Hook for button press feedback with visual, haptic, and sound
 */
export function usePressAnimation() {
  const { tap } = useTabletFeedback();

  const handlePress = useCallback(
    (callback?: () => void) => {
      return () => {
        tap();
        callback?.();
      };
    },
    [tap]
  );

  return { handlePress };
}
