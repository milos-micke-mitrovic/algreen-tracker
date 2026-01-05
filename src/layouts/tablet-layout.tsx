import { Outlet, useNavigate } from 'react-router-dom';
import { Wifi, WifiOff, RefreshCw, LogOut, ChevronDown, User } from 'lucide-react';

import { cn } from '@/lib/utils';
import { useConnectionStatus } from '@/hooks/use-offline';
import { useAuthStore } from '@/stores/auth-store';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Toaster } from '@/components/ui/sonner';

/**
 * Layout for tablet views (production floor)
 * Full-screen, minimal chrome, optimized for touch
 */
export function TabletLayout() {
  const { isOnline, connectionStatus, syncStatus, pendingActions } = useConnectionStatus();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Status bar - always visible */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b bg-card px-4">
        {/* Left: Logo/Brand */}
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Algreen" className="h-8" />
        </div>

        {/* Right: Status indicators and user menu */}
        <div className="flex items-center gap-3">
          {/* Sync status */}
          {pendingActions > 0 && (
            <div className="flex items-center gap-2 rounded-full bg-warning/10 px-3 py-1 text-warning">
              <RefreshCw className={cn('h-4 w-4', syncStatus === 'syncing' && 'animate-spin')} />
              <span className="text-sm font-medium">{pendingActions}</span>
            </div>
          )}

          {/* Connection status */}
          <div
            className={cn(
              'flex items-center gap-2 rounded-full px-3 py-1',
              isOnline ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
            )}
          >
            {isOnline ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
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

          {/* User menu - consistent with dashboard */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                  {user?.firstName && user?.lastName ? (
                    <>
                      {user.firstName[0]}
                      {user.lastName[0]}
                    </>
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                </div>
                <span>
                  {user?.firstName && user?.lastName
                    ? `${user.firstName} ${user.lastName}`
                    : 'Korisnik'}
                </span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Odjava
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main content - scrollable */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>

      {/* Toast notifications */}
      <Toaster position="top-center" />
    </div>
  );
}
