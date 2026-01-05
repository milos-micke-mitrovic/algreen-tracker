import type { HubConnection } from '@microsoft/signalr';
import { create } from 'zustand';

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'reconnecting';

export type SyncStatus = 'synced' | 'syncing' | 'pending' | 'error';

interface ConnectionState {
  // Online/Offline
  isOnline: boolean;
  setOnline: (online: boolean) => void;

  // SignalR Connection
  connection: HubConnection | null;
  connectionStatus: ConnectionStatus;
  setConnection: (connection: HubConnection | null) => void;
  setConnectionStatus: (status: ConnectionStatus) => void;

  // Sync Queue Status
  syncStatus: SyncStatus;
  pendingActions: number;
  setSyncStatus: (status: SyncStatus) => void;
  setPendingActions: (count: number) => void;

  // Current Department (for tablet)
  currentDepartmentId: string | null;
  setCurrentDepartmentId: (departmentId: string | null) => void;
}

export const useConnectionStore = create<ConnectionState>((set) => ({
  // Initial state
  isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
  connection: null,
  connectionStatus: 'disconnected',
  syncStatus: 'synced',
  pendingActions: 0,
  currentDepartmentId: null,

  // Actions
  setOnline: (online) => set({ isOnline: online }),

  setConnection: (connection) => set({ connection }),

  setConnectionStatus: (status) => set({ connectionStatus: status }),

  setSyncStatus: (status) => set({ syncStatus: status }),

  setPendingActions: (count) =>
    set({
      pendingActions: count,
      syncStatus: count > 0 ? 'pending' : 'synced',
    }),

  setCurrentDepartmentId: (departmentId) => set({ currentDepartmentId: departmentId }),
}));

// Initialize online/offline listeners
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    useConnectionStore.getState().setOnline(true);
  });

  window.addEventListener('offline', () => {
    useConnectionStore.getState().setOnline(false);
  });
}
