import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { Tenant, TenantPlan } from '@/types';

interface TenantState {
  // State
  tenant: Tenant | null;
  isLoaded: boolean;

  // Actions
  setTenant: (tenant: Tenant) => void;
  clearTenant: () => void;

  // Selectors
  getTenantId: () => string | null;
  getPlan: () => TenantPlan | null;
  hasFeature: (feature: string) => boolean;
}

export const useTenantStore = create<TenantState>()(
  persist(
    (set, get) => ({
      // Initial state
      tenant: null,
      isLoaded: false,

      // Actions
      setTenant: (tenant) =>
        set({
          tenant,
          isLoaded: true,
        }),

      clearTenant: () =>
        set({
          tenant: null,
          isLoaded: false,
        }),

      // Selectors
      getTenantId: () => {
        const { tenant } = get();
        return tenant?.id ?? null;
      },

      getPlan: () => {
        const { tenant } = get();
        return tenant?.plan ?? null;
      },

      hasFeature: (feature) => {
        const { tenant } = get();
        if (!tenant) return false;
        return tenant.settings.features.includes(feature);
      },
    }),
    {
      name: 'tenant-storage',
      partialize: (state) => ({
        tenant: state.tenant,
      }),
    }
  )
);
