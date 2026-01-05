import { useEffect, useCallback, useRef } from 'react';

import { useConnectionStore } from '@/stores/connection-store';
import type { ProductionEventMap, ProductionEventName } from '@/types/events';

/**
 * Type-safe hook to subscribe to a specific SignalR event
 *
 * @example
 * useSignalREvent('ProductionStepCompleted', (event) => {
 *   console.log('Step completed:', event.cardId);
 *   // TypeScript knows the shape of event
 * });
 */
export function useSignalREvent<T extends ProductionEventName>(
  eventName: T,
  handler: (event: ProductionEventMap[T]) => void,
  enabled: boolean = true
) {
  const connection = useConnectionStore((s) => s.connection);
  const handlerRef = useRef(handler);

  // Keep handler ref updated
  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!connection || !enabled) return;

    const eventHandler = (data: ProductionEventMap[T]) => {
      handlerRef.current(data);
    };

    connection.on(eventName, eventHandler);

    return () => {
      connection.off(eventName, eventHandler);
    };
  }, [connection, eventName, enabled]);
}

/**
 * Hook to subscribe to multiple SignalR events at once
 *
 * @example
 * useSignalREvents({
 *   ProductionStepCompleted: (event) => console.log('Completed:', event.cardId),
 *   ProductionBlocked: (event) => console.log('Blocked:', event.reason),
 * });
 */
export function useSignalREvents(
  handlers: Partial<{
    [K in ProductionEventName]: (event: ProductionEventMap[K]) => void;
  }>,
  enabled: boolean = true
) {
  const connection = useConnectionStore((s) => s.connection);
  const handlersRef = useRef(handlers);

  // Keep handlers ref updated
  useEffect(() => {
    handlersRef.current = handlers;
  }, [handlers]);

  useEffect(() => {
    if (!connection || !enabled) return;

    const subscriptions: Array<{ event: string; handler: (data: unknown) => void }> = [];

    // Subscribe to each event
    Object.entries(handlersRef.current).forEach(([eventName, handler]) => {
      if (handler !== undefined) {
        const wrappedHandler = (data: unknown) => {
          const currentHandler = handlersRef.current[eventName as ProductionEventName];
          if (currentHandler !== undefined) {
            currentHandler(data as never);
          }
        };

        connection.on(eventName, wrappedHandler);
        subscriptions.push({ event: eventName, handler: wrappedHandler });
      }
    });

    return () => {
      // Unsubscribe from all events
      subscriptions.forEach(({ event, handler }) => {
        connection.off(event, handler);
      });
    };
  }, [connection, enabled]);
}

/**
 * Hook that returns a function to manually invoke SignalR methods
 *
 * @example
 * const invoke = useSignalRInvoke();
 * await invoke('SendMessage', { text: 'Hello' });
 */
export function useSignalRInvoke() {
  const connection = useConnectionStore((s) => s.connection);

  const invoke = useCallback(
    async <T = void>(methodName: string, ...args: unknown[]): Promise<T> => {
      if (!connection) {
        throw new Error('SignalR not connected');
      }
      return connection.invoke<T>(methodName, ...args);
    },
    [connection]
  );

  return invoke;
}
