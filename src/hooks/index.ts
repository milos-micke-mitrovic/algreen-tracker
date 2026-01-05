export { useDebounce } from './use-debounce';
export { useLocalStorage } from './use-local-storage';
export { useClickOutside } from './use-click-outside';
export {
  useMediaQuery,
  useIsMobile,
  useIsTablet,
  useIsDesktop,
} from './use-media-query';
export { useApi, useMutation } from './use-api';
export { useScrollDirection } from './use-scroll-direction';

// SignalR hooks
export { useSignalR, useDepartmentSubscription, useSignalRQueryInvalidation } from './use-signalr';
export { useSignalREvent, useSignalREvents, useSignalRInvoke } from './use-signalr-event';

// Offline hooks
export { useOnlineStatus, useConnectionStatus, useOfflineFirst } from './use-offline';
export { useSyncQueue, usePendingActions } from './use-sync-queue';

// Permission hooks
export {
  usePermission,
  usePermissions,
  useRole,
  useHasAnyRole,
  useAllPermissions,
} from './use-permission';
export type { Permission } from './use-permission';
