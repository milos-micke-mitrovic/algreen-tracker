import { Wifi, WifiOff, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';

import { cn } from '@/lib/utils';
import { useConnectionStore, type ConnectionStatus, type SyncStatus } from '@/stores/connection-store';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ConnectionStatusProps {
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const connectionLabels: Record<ConnectionStatus, string> = {
  connected: 'Povezan',
  connecting: 'Povezivanje...',
  reconnecting: 'Ponovno povezivanje...',
  disconnected: 'Nije povezan',
};

const syncLabels: Record<SyncStatus, string> = {
  synced: 'Sinhronizovano',
  syncing: 'Sinhronizacija...',
  pending: 'Ceka sinhronizaciju',
  error: 'Greska sinhronizacije',
};

const sizeClasses = {
  sm: 'h-3 w-3',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
};

/**
 * Connection status indicator component
 * Shows online/offline status and sync state
 */
export function ConnectionStatusIndicator({
  className,
  showLabel = false,
  size = 'md',
}: ConnectionStatusProps) {
  const { isOnline, connectionStatus, syncStatus } = useConnectionStore();

  const getStatusColor = () => {
    if (!isOnline) return 'text-destructive';
    if (connectionStatus === 'connected') {
      if (syncStatus === 'synced') return 'text-success';
      if (syncStatus === 'syncing') return 'text-warning';
      if (syncStatus === 'pending') return 'text-warning';
      if (syncStatus === 'error') return 'text-destructive';
    }
    if (connectionStatus === 'connecting' || connectionStatus === 'reconnecting') {
      return 'text-warning';
    }
    return 'text-muted-foreground';
  };

  const getIcon = () => {
    const iconClass = cn(sizeClasses[size], getStatusColor());

    if (!isOnline) {
      return <WifiOff className={iconClass} />;
    }

    if (syncStatus === 'syncing') {
      return <RefreshCw className={cn(iconClass, 'animate-spin')} />;
    }

    if (syncStatus === 'error') {
      return <AlertCircle className={iconClass} />;
    }

    if (connectionStatus === 'connected' && syncStatus === 'synced') {
      return <CheckCircle className={iconClass} />;
    }

    if (connectionStatus === 'connecting' || connectionStatus === 'reconnecting') {
      return <RefreshCw className={cn(iconClass, 'animate-spin')} />;
    }

    return <Wifi className={iconClass} />;
  };

  const getTooltipText = () => {
    const parts: string[] = [];

    if (!isOnline) {
      parts.push('Offline - radite bez konekcije');
    } else {
      parts.push(connectionLabels[connectionStatus]);
    }

    if (syncStatus !== 'synced') {
      parts.push(syncLabels[syncStatus]);
    }

    return parts.join(' | ');
  };

  const getLabel = () => {
    if (!isOnline) return 'Offline';
    if (syncStatus === 'syncing') return 'Sinhronizacija...';
    if (syncStatus === 'pending') return 'Ceka sync';
    if (connectionStatus === 'connecting') return 'Povezivanje...';
    if (connectionStatus === 'reconnecting') return 'Ponovno povezivanje...';
    return 'Online';
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              'flex items-center gap-2 cursor-default',
              className
            )}
          >
            {getIcon()}
            {showLabel && (
              <span className={cn('text-sm', getStatusColor())}>
                {getLabel()}
              </span>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{getTooltipText()}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

/**
 * Compact badge version for headers/status bars
 */
export function ConnectionStatusBadge({ className }: { className?: string }) {
  const { isOnline, syncStatus } = useConnectionStore();

  const getBadgeClass = () => {
    if (!isOnline) return 'bg-destructive/10 text-destructive border-destructive/20';
    if (syncStatus === 'error') return 'bg-destructive/10 text-destructive border-destructive/20';
    if (syncStatus === 'syncing' || syncStatus === 'pending') {
      return 'bg-warning/10 text-warning border-warning/20';
    }
    return 'bg-success/10 text-success border-success/20';
  };

  const getLabel = () => {
    if (!isOnline) return 'Offline';
    if (syncStatus === 'syncing') return 'Syncing...';
    if (syncStatus === 'pending') return 'Pending';
    if (syncStatus === 'error') return 'Sync Error';
    return 'Online';
  };

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium',
        getBadgeClass(),
        className
      )}
    >
      <ConnectionStatusIndicator size="sm" />
      <span>{getLabel()}</span>
    </div>
  );
}
