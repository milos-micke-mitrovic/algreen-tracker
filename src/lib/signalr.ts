import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
} from '@microsoft/signalr';

import { env } from '@/config/env';
import { useAuthStore } from '@/stores/auth-store';
import { useConnectionStore } from '@/stores/connection-store';

let connection: HubConnection | null = null;

/**
 * Initialize SignalR connection with authentication
 */
export async function initializeSignalR(): Promise<HubConnection> {
  const accessToken = useAuthStore.getState().accessToken;

  if (!accessToken) {
    throw new Error('No access token available for SignalR connection');
  }

  // If connection exists and is connected, return it
  if (connection && connection.state === HubConnectionState.Connected) {
    return connection;
  }

  // Build new connection
  const hubUrl = env.apiUrl.replace('/api', '/hubs/production');

  connection = new HubConnectionBuilder()
    .withUrl(hubUrl, {
      accessTokenFactory: () => accessToken,
    })
    .withAutomaticReconnect({
      nextRetryDelayInMilliseconds: (retryContext) => {
        // Exponential backoff: 0, 2s, 5s, 10s, 30s max
        const delays = [0, 2000, 5000, 10000, 30000];
        return delays[Math.min(retryContext.previousRetryCount, delays.length - 1)];
      },
    })
    .configureLogging(env.isDev ? LogLevel.Information : LogLevel.Warning)
    .build();

  // Setup connection state handlers
  setupConnectionHandlers(connection);

  // Start the connection
  useConnectionStore.getState().setConnectionStatus('connecting');

  try {
    await connection.start();
    useConnectionStore.getState().setConnection(connection);
    useConnectionStore.getState().setConnectionStatus('connected');
    console.log('SignalR connected');
    return connection;
  } catch (error) {
    useConnectionStore.getState().setConnectionStatus('disconnected');
    console.error('SignalR connection failed:', error);
    throw error;
  }
}

/**
 * Setup handlers for connection state changes
 */
function setupConnectionHandlers(conn: HubConnection): void {
  conn.onreconnecting((error) => {
    console.log('SignalR reconnecting...', error);
    useConnectionStore.getState().setConnectionStatus('reconnecting');
  });

  conn.onreconnected((connectionId) => {
    console.log('SignalR reconnected:', connectionId);
    useConnectionStore.getState().setConnectionStatus('connected');

    // Re-join department group if set
    const departmentId = useConnectionStore.getState().currentDepartmentId;
    if (departmentId) {
      joinDepartment(departmentId);
    }
  });

  conn.onclose((error) => {
    console.log('SignalR connection closed', error);
    useConnectionStore.getState().setConnectionStatus('disconnected');
    useConnectionStore.getState().setConnection(null);
  });
}

/**
 * Disconnect SignalR connection
 */
export async function disconnectSignalR(): Promise<void> {
  if (connection) {
    try {
      await connection.stop();
    } catch (error) {
      console.error('Error stopping SignalR connection:', error);
    }
    connection = null;
    useConnectionStore.getState().setConnection(null);
    useConnectionStore.getState().setConnectionStatus('disconnected');
  }
}

/**
 * Get current SignalR connection
 */
export function getSignalRConnection(): HubConnection | null {
  return connection;
}

/**
 * Join a department group for scoped events
 */
export async function joinDepartment(departmentId: string): Promise<void> {
  if (!connection || connection.state !== HubConnectionState.Connected) {
    console.warn('Cannot join department: SignalR not connected');
    return;
  }

  try {
    await connection.invoke('JoinDepartment', departmentId);
    useConnectionStore.getState().setCurrentDepartmentId(departmentId);
    console.log('Joined department:', departmentId);
  } catch (error) {
    console.error('Failed to join department:', error);
  }
}

/**
 * Leave a department group
 */
export async function leaveDepartment(departmentId: string): Promise<void> {
  if (!connection || connection.state !== HubConnectionState.Connected) {
    return;
  }

  try {
    await connection.invoke('LeaveDepartment', departmentId);
    useConnectionStore.getState().setCurrentDepartmentId(null);
    console.log('Left department:', departmentId);
  } catch (error) {
    console.error('Failed to leave department:', error);
  }
}

/**
 * Subscribe to a SignalR event
 */
export function subscribeToEvent<T>(
  eventName: string,
  handler: (data: T) => void
): () => void {
  if (!connection) {
    console.warn('Cannot subscribe: SignalR not initialized');
    return () => {};
  }

  connection.on(eventName, handler);

  // Return unsubscribe function
  return () => {
    connection?.off(eventName, handler);
  };
}

/**
 * Invoke a SignalR method
 */
export async function invokeMethod<T>(
  methodName: string,
  ...args: unknown[]
): Promise<T> {
  if (!connection || connection.state !== HubConnectionState.Connected) {
    throw new Error('SignalR not connected');
  }

  return connection.invoke<T>(methodName, ...args);
}
