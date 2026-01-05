import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data is considered fresh for 30 seconds
      staleTime: 30 * 1000,

      // Garbage collection time (keep unused data for 5 minutes)
      gcTime: 5 * 60 * 1000,

      // Retry failed requests twice
      retry: 2,

      // Don't refetch on window focus (tablets stay open)
      refetchOnWindowFocus: false,

      // Offline-first mode for tablets
      networkMode: 'offlineFirst',

      // Refetch on reconnect
      refetchOnReconnect: true,
    },
    mutations: {
      // Retry mutations once
      retry: 1,

      // Offline-first for mutations too
      networkMode: 'offlineFirst',
    },
  },
});

// Export query keys factory for type-safe keys
export const queryKeys = {
  // Production
  production: {
    all: ['production'] as const,
    cards: (filters?: Record<string, unknown>) =>
      [...queryKeys.production.all, 'cards', filters] as const,
    card: (id: string) => [...queryKeys.production.all, 'card', id] as const,
    steps: () => [...queryKeys.production.all, 'steps'] as const,
    stats: () => [...queryKeys.production.all, 'stats'] as const,
  },

  // Orders
  orders: {
    all: ['orders'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.orders.all, 'list', filters] as const,
    detail: (id: string) => [...queryKeys.orders.all, 'detail', id] as const,
  },

  // Departments
  departments: {
    all: ['departments'] as const,
    list: () => [...queryKeys.departments.all, 'list'] as const,
    detail: (id: string) => [...queryKeys.departments.all, 'detail', id] as const,
  },

  // Dashboard
  dashboard: {
    all: ['dashboard'] as const,
    stats: () => [...queryKeys.dashboard.all, 'stats'] as const,
    activity: () => [...queryKeys.dashboard.all, 'activity'] as const,
  },

  // Users
  users: {
    all: ['users'] as const,
    me: () => [...queryKeys.users.all, 'me'] as const,
    list: () => [...queryKeys.users.all, 'list'] as const,
  },
} as const;
