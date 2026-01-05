import { useMemo } from 'react';

import { useAuthStore } from '@/stores/auth-store';
import type { UserRole } from '@/types/domain';

/**
 * Permission types for the application
 */
export type Permission =
  // Production
  | 'production:view'
  | 'production:start'
  | 'production:pause'
  | 'production:complete'
  | 'production:report_problem'
  | 'production:view_all_departments'
  // Orders
  | 'orders:view'
  | 'orders:create'
  | 'orders:edit'
  | 'orders:delete'
  // Dashboard
  | 'dashboard:view'
  | 'dashboard:view_stats'
  // Users
  | 'users:view'
  | 'users:create'
  | 'users:edit'
  | 'users:delete'
  // Settings
  | 'settings:view'
  | 'settings:edit';

/**
 * Role to permissions mapping
 */
const rolePermissions: Record<UserRole, Permission[]> = {
  admin: [
    'production:view',
    'production:start',
    'production:pause',
    'production:complete',
    'production:report_problem',
    'production:view_all_departments',
    'orders:view',
    'orders:create',
    'orders:edit',
    'orders:delete',
    'dashboard:view',
    'dashboard:view_stats',
    'users:view',
    'users:create',
    'users:edit',
    'users:delete',
    'settings:view',
    'settings:edit',
  ],
  manager: [
    'production:view',
    'production:start',
    'production:pause',
    'production:complete',
    'production:report_problem',
    'production:view_all_departments',
    'orders:view',
    'orders:create',
    'orders:edit',
    'dashboard:view',
    'dashboard:view_stats',
    'users:view',
    'settings:view',
  ],
  supervisor: [
    'production:view',
    'production:start',
    'production:pause',
    'production:complete',
    'production:report_problem',
    'production:view_all_departments',
    'orders:view',
    'dashboard:view',
    'dashboard:view_stats',
  ],
  worker: [
    'production:view',
    'production:start',
    'production:pause',
    'production:complete',
    'production:report_problem',
  ],
};

/**
 * Hook to check if user has a specific permission
 */
export function usePermission(permission: Permission): boolean {
  const user = useAuthStore((s) => s.user);

  return useMemo(() => {
    if (!user) return false;

    // First check explicit permissions from JWT
    if (user.permissions.includes(permission)) {
      return true;
    }

    // Fall back to role-based permissions
    const permissions = rolePermissions[user.role] || [];
    return permissions.includes(permission);
  }, [user, permission]);
}

/**
 * Hook to check multiple permissions at once
 */
export function usePermissions(permissions: Permission[]): Record<Permission, boolean> {
  const user = useAuthStore((s) => s.user);

  return useMemo(() => {
    const result: Record<string, boolean> = {};

    for (const permission of permissions) {
      if (!user) {
        result[permission] = false;
        continue;
      }

      // Check explicit permissions from JWT
      if (user.permissions.includes(permission)) {
        result[permission] = true;
        continue;
      }

      // Fall back to role-based permissions
      const rolePerms = rolePermissions[user.role] || [];
      result[permission] = rolePerms.includes(permission);
    }

    return result as Record<Permission, boolean>;
  }, [user, permissions]);
}

/**
 * Hook to check if user has a specific role
 */
export function useRole(role: UserRole): boolean {
  const user = useAuthStore((s) => s.user);
  return user?.role === role;
}

/**
 * Hook to check if user has any of the specified roles
 */
export function useHasAnyRole(roles: UserRole[]): boolean {
  const user = useAuthStore((s) => s.user);
  return user ? roles.includes(user.role) : false;
}

/**
 * Hook to get all permissions for the current user
 */
export function useAllPermissions(): Permission[] {
  const user = useAuthStore((s) => s.user);

  return useMemo(() => {
    if (!user) return [];

    const rolePerms = rolePermissions[user.role] || [];
    const explicitPerms = user.permissions as Permission[];

    // Combine and dedupe
    return [...new Set([...rolePerms, ...explicitPerms])];
  }, [user]);
}
