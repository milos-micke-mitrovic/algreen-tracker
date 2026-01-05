import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Factory,
  Users,
  Settings,
  Menu,
  X,
  LogOut,
  ChevronDown,
  Bell,
  User,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth-store';
import { useUIStore } from '@/stores/ui-store';
import { usePermission } from '@/hooks/use-permission';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Toaster } from '@/components/ui/sonner';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  permission?: string;
  adminOnly?: boolean;
  end?: boolean; // For exact match on NavLink
}

const navItems: NavItem[] = [
  {
    label: 'Pregled',
    href: '/dashboard',
    icon: <LayoutDashboard className="h-5 w-5" />,
    permission: 'dashboard:view',
    end: true, // Exact match so it's not active on /dashboard/production etc.
  },
  {
    label: 'Proizvodnja',
    href: '/dashboard/production',
    icon: <Factory className="h-5 w-5" />,
    permission: 'production:view',
  },
  {
    label: 'Nalozi',
    href: '/dashboard/orders',
    icon: <Package className="h-5 w-5" />,
    permission: 'orders:view',
  },
  {
    label: 'Korisnici',
    href: '/dashboard/users',
    icon: <Users className="h-5 w-5" />,
    permission: 'users:view',
  },
  {
    label: 'Podešavanja',
    href: '/dashboard/settings',
    icon: <Settings className="h-5 w-5" />,
    adminOnly: true,
  },
];

/**
 * Dashboard layout with sidebar navigation
 */
export function DashboardLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'hidden border-r bg-card transition-all duration-300 lg:flex lg:flex-col',
          sidebarOpen ? 'lg:w-64' : 'lg:w-16'
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center border-b px-4">
          <div className="flex items-center gap-3">
            {sidebarOpen ? (
              <img src="/logo.png" alt="Algreen" className="h-8" />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                A
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-2">
          {navItems.map((item) => (
            <NavItem
              key={item.href}
              item={item}
              collapsed={!sidebarOpen}
            />
          ))}
        </nav>

        {/* Collapse button */}
        <div className="border-t p-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="w-full justify-start"
          >
            <Menu className="h-5 w-5" />
            {sidebarOpen && <span className="ml-2">Smanji</span>}
          </Button>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-modal-backdrop bg-black/50 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-modal w-64 transform border-r bg-card transition-transform duration-300 lg:hidden',
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b px-4">
          <img src="/logo.png" alt="Algreen" className="h-8" />
          <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-2">
          {navItems.map((item) => (
            <NavItem
              key={item.href}
              item={item}
              collapsed={false}
              onClick={() => setMobileMenuOpen(false)}
            />
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b bg-card px-4">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>

            {/* User menu */}
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
                  <span className="hidden sm:inline">
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

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>

      <Toaster position="top-right" />
    </div>
  );
}

/**
 * Navigation item component
 */
function NavItem({
  item,
  collapsed,
  onClick,
}: {
  item: NavItem;
  collapsed: boolean;
  onClick?: () => void;
}) {
  const hasPermission = usePermission(item.permission as never);
  const user = useAuthStore((s) => s.user);

  // Check permission
  if (item.permission && !hasPermission) {
    return null;
  }

  // Check admin-only
  if (item.adminOnly && user?.role !== 'admin') {
    return null;
  }

  return (
    <NavLink
      to={item.href}
      end={item.end}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
          'hover:bg-accent hover:text-accent-foreground',
          isActive
            ? 'bg-primary/10 text-primary'
            : 'text-muted-foreground',
          collapsed && 'justify-center px-2'
        )
      }
    >
      {item.icon}
      {!collapsed && <span>{item.label}</span>}
    </NavLink>
  );
}
