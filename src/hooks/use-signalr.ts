import { useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { useConnectionStore } from '@/stores/connection-store';
import { useAuthStore } from '@/stores/auth-store';
import {
  initializeSignalR,
  disconnectSignalR,
  joinDepartment,
  leaveDepartment,
} from '@/lib/signalr';

/**
 * Hook to manage SignalR connection lifecycle
 * Automatically connects when authenticated and disconnects on logout
 */
export function useSignalR() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const accessToken = useAuthStore((s) => s.accessToken);
  const connectionStatus = useConnectionStore((s) => s.connectionStatus);
  const isOnline = useConnectionStore((s) => s.isOnline);

  // Connect when authenticated
  useEffect(() => {
    if (isAuthenticated && accessToken && isOnline) {
      initializeSignalR().catch((error) => {
        console.error('Failed to initialize SignalR:', error);
      });
    }

    return () => {
      // Cleanup on unmount
    };
  }, [isAuthenticated, accessToken, isOnline]);

  // Disconnect on logout
  useEffect(() => {
    if (!isAuthenticated) {
      disconnectSignalR();
    }
  }, [isAuthenticated]);

  const connect = useCallback(async () => {
    if (!isAuthenticated || !accessToken) {
      throw new Error('Must be authenticated to connect');
    }
    return initializeSignalR();
  }, [isAuthenticated, accessToken]);

  const disconnect = useCallback(() => {
    return disconnectSignalR();
  }, []);

  return {
    connectionStatus,
    isConnected: connectionStatus === 'connected',
    isOnline,
    connect,
    disconnect,
  };
}

/**
 * Hook to join/leave a department for scoped events
 * Used by tablet views to receive only their department's events
 */
export function useDepartmentSubscription(departmentId: string | null) {
  const connectionStatus = useConnectionStore((s) => s.connectionStatus);
  const currentDepartmentId = useConnectionStore((s) => s.currentDepartmentId);

  useEffect(() => {
    if (connectionStatus !== 'connected' || !departmentId) {
      return;
    }

    // Join new department
    joinDepartment(departmentId);

    return () => {
      // Leave department on cleanup
      if (departmentId) {
        leaveDepartment(departmentId);
      }
    };
  }, [connectionStatus, departmentId]);

  return {
    isJoined: currentDepartmentId === departmentId,
    currentDepartmentId,
  };
}

/**
 * Hook to invalidate queries when SignalR events are received
 * This connects real-time events to TanStack Query cache
 */
export function useSignalRQueryInvalidation() {
  const queryClient = useQueryClient();
  const connection = useConnectionStore((s) => s.connection);

  useEffect(() => {
    if (!connection) return;

    // Production card events
    const handleProductionCardCreated = () => {
      queryClient.invalidateQueries({ queryKey: ['production', 'cards'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    };

    const handleProductionStepCompleted = () => {
      queryClient.invalidateQueries({ queryKey: ['production', 'cards'] });
      queryClient.invalidateQueries({ queryKey: ['production', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    };

    const handleProductionBlocked = () => {
      queryClient.invalidateQueries({ queryKey: ['production', 'cards'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    };

    const handleOrderCreated = () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['production', 'cards'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    };

    const handleOrderCompleted = () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    };

    // Subscribe to events
    connection.on('ProductionCardCreated', handleProductionCardCreated);
    connection.on('ProductionStepStarted', handleProductionStepCompleted);
    connection.on('ProductionStepCompleted', handleProductionStepCompleted);
    connection.on('ProductionStepPaused', handleProductionStepCompleted);
    connection.on('ProductionBlocked', handleProductionBlocked);
    connection.on('OrderCreated', handleOrderCreated);
    connection.on('OrderCompleted', handleOrderCompleted);

    return () => {
      connection.off('ProductionCardCreated', handleProductionCardCreated);
      connection.off('ProductionStepStarted', handleProductionStepCompleted);
      connection.off('ProductionStepCompleted', handleProductionStepCompleted);
      connection.off('ProductionStepPaused', handleProductionStepCompleted);
      connection.off('ProductionBlocked', handleProductionBlocked);
      connection.off('OrderCreated', handleOrderCreated);
      connection.off('OrderCompleted', handleOrderCompleted);
    };
  }, [connection, queryClient]);
}
