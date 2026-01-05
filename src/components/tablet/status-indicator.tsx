import { Wifi, WifiOff, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';

import { cn } from '@/lib/utils';
import { useConnectionStatus } from '@/hooks/use-offline';

/**
 * Connection status indicator for tablets
 */
export function ConnectionStatusIndicator() {
  const { isOnline, connectionStatus } = useConnectionStatus();

  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-full px-3 py-1.5',
        isOnline ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
      )}
    >
      {isOnline ? <Wifi className="h-5 w-5" /> : <WifiOff className="h-5 w-5" />}
      <span className="text-sm font-medium">
        {connectionStatus === 'connected'
          ? 'Povezano'
          : connectionStatus === 'connecting'
            ? 'Povezivanje...'
            : connectionStatus === 'reconnecting'
              ? 'Ponovno povezivanje...'
              : 'Nije povezano'}
      </span>
    </div>
  );
}

/**
 * Sync status indicator showing pending actions
 */
export function SyncStatusIndicator() {
  const { syncStatus, pendingActions, isOnline } = useConnectionStatus();

  if (pendingActions === 0 && syncStatus === 'synced') {
    return (
      <div className="flex items-center gap-2 rounded-full bg-success/10 px-3 py-1.5 text-success">
        <CheckCircle className="h-5 w-5" />
        <span className="text-sm font-medium">Sinhronizovano</span>
      </div>
    );
  }

  if (syncStatus === 'error') {
    return (
      <div className="flex items-center gap-2 rounded-full bg-destructive/10 px-3 py-1.5 text-destructive">
        <AlertCircle className="h-5 w-5" />
        <span className="text-sm font-medium">Greška pri sinhronizaciji</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 rounded-full bg-warning/10 px-3 py-1.5 text-warning">
      <RefreshCw
        className={cn(
          'h-5 w-5',
          syncStatus === 'syncing' && 'animate-spin'
        )}
      />
      <span className="text-sm font-medium">
        {syncStatus === 'syncing'
          ? 'Sinhronizacija...'
          : `${pendingActions} na čekanju`}
      </span>
      {!isOnline && <span className="text-xs">(offline)</span>}
    </div>
  );
}

/**
 * Combined status bar for tablet header
 */
export function TabletStatusBar() {
  return (
    <div className="flex items-center gap-3">
      <SyncStatusIndicator />
      <ConnectionStatusIndicator />
    </div>
  );
}
