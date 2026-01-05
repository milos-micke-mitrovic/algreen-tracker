import { useEffect, useCallback } from 'react';

import { useConnectionStore } from '@/stores/connection-store';

/**
 * Hook to detect online/offline status
 * Automatically listens to browser events
 */
export function useOnlineStatus() {
  const isOnline = useConnectionStore((s) => s.isOnline);
  const setOnline = useConnectionStore((s) => s.setOnline);

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Set initial state
    setOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [setOnline]);

  return isOnline;
}

/**
 * Hook to get comprehensive connection status
 */
export function useConnectionStatus() {
  const isOnline = useConnectionStore((s) => s.isOnline);
  const connectionStatus = useConnectionStore((s) => s.connectionStatus);
  const syncStatus = useConnectionStore((s) => s.syncStatus);
  const pendingActions = useConnectionStore((s) => s.pendingActions);

  return {
    isOnline,
    connectionStatus,
    syncStatus,
    pendingActions,
    isFullyConnected: isOnline && connectionStatus === 'connected',
    hasPendingSync: pendingActions > 0,
  };
}

/**
 * Hook that provides a function to check if we should use cached data
 */
export function useOfflineFirst() {
  const isOnline = useConnectionStore((s) => s.isOnline);

  const shouldUseCache = useCallback(() => {
    return !isOnline;
  }, [isOnline]);

  return {
    isOnline,
    shouldUseCache,
  };
}
