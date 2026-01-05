import { useEffect, useCallback, useState } from 'react';

import { useConnectionStore } from '@/stores/connection-store';
import {
  executeOrQueue,
  processQueue,
  getPendingActions,
  clearQueue,
} from '@/lib/offline/sync-queue';
import type { QueuedAction } from '@/lib/offline/db';

/**
 * Hook to manage the offline sync queue
 * Automatically processes queue when coming back online
 */
export function useSyncQueue() {
  const isOnline = useConnectionStore((s) => s.isOnline);
  const syncStatus = useConnectionStore((s) => s.syncStatus);
  const pendingActions = useConnectionStore((s) => s.pendingActions);
  const [isProcessing, setIsProcessing] = useState(false);

  // Auto-process queue when coming back online
  useEffect(() => {
    if (isOnline && pendingActions > 0 && !isProcessing) {
      setIsProcessing(true);
      processQueue()
        .then(({ processed, failed }) => {
          console.log(`Sync complete: ${processed} processed, ${failed} failed`);
        })
        .catch((error) => {
          console.error('Sync failed:', error);
        })
        .finally(() => {
          setIsProcessing(false);
        });
    }
  }, [isOnline, pendingActions, isProcessing]);

  /**
   * Execute an action immediately if online, or queue for later
   */
  const execute = useCallback(
    async (type: string, payload: Record<string, unknown>): Promise<boolean> => {
      return executeOrQueue(type, payload);
    },
    []
  );

  /**
   * Manually trigger queue processing
   */
  const sync = useCallback(async () => {
    if (!isOnline) {
      throw new Error('Cannot sync while offline');
    }
    setIsProcessing(true);
    try {
      return await processQueue();
    } finally {
      setIsProcessing(false);
    }
  }, [isOnline]);

  /**
   * Clear all pending actions
   */
  const clear = useCallback(async () => {
    await clearQueue();
  }, []);

  return {
    execute,
    sync,
    clear,
    isProcessing,
    syncStatus,
    pendingActions,
    hasPending: pendingActions > 0,
  };
}

/**
 * Hook to get pending actions for display
 */
export function usePendingActions() {
  const [actions, setActions] = useState<QueuedAction[]>([]);
  const pendingCount = useConnectionStore((s) => s.pendingActions);

  useEffect(() => {
    getPendingActions().then(setActions);
  }, [pendingCount]);

  return actions;
}
