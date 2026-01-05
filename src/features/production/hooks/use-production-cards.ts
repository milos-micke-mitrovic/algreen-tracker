import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/lib/query-client';
import { useSyncQueue } from '@/hooks/use-sync-queue';
import { showToast } from '@/lib/toast';
import { productionApi } from '../services/production-api';
import type { ProductionCardFilters, ProductionCard } from '@/types/domain';

/**
 * Hook to fetch production cards
 */
export function useProductionCards(filters?: ProductionCardFilters) {
  return useQuery({
    queryKey: queryKeys.production.cards(filters as Record<string, unknown>),
    queryFn: () => productionApi.getCards(filters),
  });
}

/**
 * Hook to fetch production cards for a specific department
 */
export function useDepartmentCards(departmentId: string | null) {
  return useQuery({
    queryKey: queryKeys.production.cards({ departmentId: departmentId ?? undefined }),
    queryFn: () =>
      departmentId ? productionApi.getCards({ departmentId }) : Promise.resolve([]),
    enabled: !!departmentId,
  });
}

/**
 * Hook to fetch a single production card
 */
export function useProductionCard(cardId: string | null) {
  return useQuery({
    queryKey: queryKeys.production.card(cardId ?? ''),
    queryFn: () => (cardId ? productionApi.getCard(cardId) : Promise.reject('No card ID')),
    enabled: !!cardId,
  });
}

/**
 * Hook to fetch production steps
 */
export function useProductionSteps() {
  return useQuery({
    queryKey: queryKeys.production.steps(),
    queryFn: () => productionApi.getSteps(),
    staleTime: 5 * 60 * 1000, // Steps rarely change, cache for 5 minutes
  });
}

/**
 * Hook to fetch departments
 */
export function useDepartments() {
  return useQuery({
    queryKey: queryKeys.departments.list(),
    queryFn: () => productionApi.getDepartments(),
    staleTime: 5 * 60 * 1000, // Departments rarely change
  });
}

/**
 * Hook to start a production step
 * Uses sync queue for offline support
 */
export function useStartStep() {
  const queryClient = useQueryClient();
  const { execute } = useSyncQueue();

  return useMutation({
    mutationFn: async (cardId: string) => {
      const synced = await execute('START_STEP', { cardId });
      if (synced) {
        return productionApi.startStep(cardId);
      }
      // Return optimistic data
      return null;
    },
    onMutate: async (cardId) => {
      // Cancel ongoing fetches
      await queryClient.cancelQueries({ queryKey: queryKeys.production.cards() });

      // Snapshot previous value
      const previousCards = queryClient.getQueryData<ProductionCard[]>(
        queryKeys.production.cards()
      );

      // Optimistic update
      if (previousCards) {
        queryClient.setQueryData<ProductionCard[]>(
          queryKeys.production.cards(),
          previousCards.map((card) =>
            card.id === cardId ? { ...card, status: 'in_progress' as const } : card
          )
        );
      }

      return { previousCards };
    },
    onError: (_err, _cardId, context) => {
      // Rollback on error
      if (context?.previousCards) {
        queryClient.setQueryData(queryKeys.production.cards(), context.previousCards);
      }
      showToast.error('Greška pri pokretanju koraka');
    },
    onSuccess: () => {
      showToast.success('Korak pokrenut');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.production.cards() });
    },
  });
}

/**
 * Hook to pause a production step
 */
export function usePauseStep() {
  const queryClient = useQueryClient();
  const { execute } = useSyncQueue();

  return useMutation({
    mutationFn: async ({ cardId, notes }: { cardId: string; notes?: string }) => {
      const synced = await execute('PAUSE_STEP', { cardId, notes });
      if (synced) {
        return productionApi.pauseStep(cardId, notes);
      }
      return null;
    },
    onMutate: async ({ cardId }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.production.cards() });

      const previousCards = queryClient.getQueryData<ProductionCard[]>(
        queryKeys.production.cards()
      );

      if (previousCards) {
        queryClient.setQueryData<ProductionCard[]>(
          queryKeys.production.cards(),
          previousCards.map((card) =>
            card.id === cardId ? { ...card, status: 'paused' as const } : card
          )
        );
      }

      return { previousCards };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousCards) {
        queryClient.setQueryData(queryKeys.production.cards(), context.previousCards);
      }
      showToast.error('Greška pri pauziranju koraka');
    },
    onSuccess: () => {
      showToast.success('Korak pauziran');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.production.cards() });
    },
  });
}

/**
 * Hook to complete a production step
 */
export function useCompleteStep() {
  const queryClient = useQueryClient();
  const { execute } = useSyncQueue();

  return useMutation({
    mutationFn: async ({ cardId, notes }: { cardId: string; notes?: string }) => {
      const synced = await execute('COMPLETE_STEP', { cardId, notes });
      if (synced) {
        return productionApi.completeStep(cardId, notes);
      }
      return null;
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: queryKeys.production.cards() });

      const previousCards = queryClient.getQueryData<ProductionCard[]>(
        queryKeys.production.cards()
      );

      // Note: We can't know the next step, so we just mark as 'completed' temporarily
      // The real status will come from the server or next sync

      return { previousCards };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousCards) {
        queryClient.setQueryData(queryKeys.production.cards(), context.previousCards);
      }
      showToast.error('Greška pri završavanju koraka');
    },
    onSuccess: (data) => {
      if (data?.isOrderComplete) {
        showToast.success('Nalog završen!');
      } else {
        showToast.success('Korak završen');
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.production.cards() });
    },
  });
}

/**
 * Hook to report a problem
 */
export function useReportProblem() {
  const queryClient = useQueryClient();
  const { execute } = useSyncQueue();

  return useMutation({
    mutationFn: async ({
      cardId,
      reason,
      notes,
    }: {
      cardId: string;
      reason: string;
      notes?: string;
    }) => {
      const synced = await execute('REPORT_PROBLEM', { cardId, reason, notes });
      if (synced) {
        return productionApi.reportProblem(cardId, reason, notes);
      }
      return null;
    },
    onMutate: async ({ cardId }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.production.cards() });

      const previousCards = queryClient.getQueryData<ProductionCard[]>(
        queryKeys.production.cards()
      );

      if (previousCards) {
        queryClient.setQueryData<ProductionCard[]>(
          queryKeys.production.cards(),
          previousCards.map((card) =>
            card.id === cardId ? { ...card, status: 'blocked' as const } : card
          )
        );
      }

      return { previousCards };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousCards) {
        queryClient.setQueryData(queryKeys.production.cards(), context.previousCards);
      }
      showToast.error('Greška pri prijavljivanju problema');
    },
    onSuccess: () => {
      showToast.warning('Problem prijavljen');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.production.cards() });
    },
  });
}
