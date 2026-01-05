import { db, type QueuedAction } from './db';
import { useConnectionStore } from '@/stores/connection-store';
import { useAuthStore } from '@/stores/auth-store';
import { useTenantStore } from '@/stores/tenant-store';
import { post } from '@/services/api';

const MAX_RETRIES = 3;

type ActionExecutor = (payload: Record<string, unknown>) => Promise<void>;

/**
 * Map of action types to their API endpoints/executors
 */
const actionExecutors: Record<string, ActionExecutor> = {
  START_STEP: async (payload) => {
    await post(`/production/cards/${payload.cardId}/start`);
  },
  PAUSE_STEP: async (payload) => {
    await post(`/production/cards/${payload.cardId}/pause`, { notes: payload.notes });
  },
  COMPLETE_STEP: async (payload) => {
    await post(`/production/cards/${payload.cardId}/complete`, { notes: payload.notes });
  },
  REPORT_PROBLEM: async (payload) => {
    await post(`/production/cards/${payload.cardId}/problem`, {
      reason: payload.reason,
      notes: payload.notes,
    });
  },
};

/**
 * Add an action to the offline queue
 */
export async function enqueueAction(
  type: string,
  payload: Record<string, unknown>
): Promise<void> {
  const tenantId = useTenantStore.getState().getTenantId();
  const userId = useAuthStore.getState().user?.id;

  if (!tenantId || !userId) {
    throw new Error('Must be authenticated to queue actions');
  }

  await db.actionQueue.add({
    type,
    payload,
    createdAt: new Date(),
    retryCount: 0,
    tenantId,
    userId,
  });

  // Update pending count
  const count = await db.actionQueue.count();
  useConnectionStore.getState().setPendingActions(count);
}

/**
 * Execute an action immediately or queue it if offline
 */
export async function executeOrQueue(
  type: string,
  payload: Record<string, unknown>
): Promise<boolean> {
  const isOnline = useConnectionStore.getState().isOnline;

  if (isOnline) {
    try {
      const executor = actionExecutors[type];
      if (!executor) {
        throw new Error(`Unknown action type: ${type}`);
      }
      await executor(payload);
      return true; // Executed successfully
    } catch (error) {
      console.warn('Failed to execute action, queuing for later:', error);
      await enqueueAction(type, payload);
      return false; // Queued
    }
  } else {
    await enqueueAction(type, payload);
    return false; // Queued
  }
}

/**
 * Process the action queue (call when coming back online)
 */
export async function processQueue(): Promise<{
  processed: number;
  failed: number;
}> {
  useConnectionStore.getState().setSyncStatus('syncing');

  const actions = await db.actionQueue.orderBy('createdAt').toArray();
  let processed = 0;
  let failed = 0;

  for (const action of actions) {
    try {
      const executor = actionExecutors[action.type];
      if (!executor) {
        console.error(`Unknown action type: ${action.type}`);
        await handleFailedAction(action, 'Unknown action type');
        failed++;
        continue;
      }

      await executor(action.payload);

      // Success - remove from queue
      await db.actionQueue.delete(action.id!);
      processed++;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      if (action.retryCount >= MAX_RETRIES) {
        // Max retries reached - mark as failed
        await handleFailedAction(action, errorMessage);
        failed++;
      } else {
        // Increment retry count
        await db.actionQueue.update(action.id!, {
          retryCount: action.retryCount + 1,
          lastError: errorMessage,
        });
        // Stop processing to maintain order
        break;
      }
    }
  }

  // Update pending count
  const remainingCount = await db.actionQueue.count();
  useConnectionStore.getState().setPendingActions(remainingCount);

  if (remainingCount === 0) {
    useConnectionStore.getState().setSyncStatus('synced');
  } else if (failed > 0) {
    useConnectionStore.getState().setSyncStatus('error');
  } else {
    useConnectionStore.getState().setSyncStatus('pending');
  }

  return { processed, failed };
}

/**
 * Handle a permanently failed action
 */
async function handleFailedAction(action: QueuedAction, error: string): Promise<void> {
  console.error('Action permanently failed:', action, error);

  // Remove from queue
  await db.actionQueue.delete(action.id!);

  // Could store in a "failed actions" table for admin review
  // For now, just log it
}

/**
 * Clear all pending actions
 */
export async function clearQueue(): Promise<void> {
  await db.actionQueue.clear();
  useConnectionStore.getState().setPendingActions(0);
  useConnectionStore.getState().setSyncStatus('synced');
}

/**
 * Get all pending actions
 */
export async function getPendingActions(): Promise<QueuedAction[]> {
  return db.actionQueue.orderBy('createdAt').toArray();
}
