import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/lib/query-client';
import { showToast } from '@/lib/toast';
import { ordersApi } from '../services/orders-api';
import type { OrderFilters, CreateOrderRequest, UpdateOrderRequest } from '../types/order.types';

/**
 * Hook to fetch orders with optional filters
 */
export function useOrders(filters?: OrderFilters) {
  return useQuery({
    queryKey: queryKeys.orders.list(filters as Record<string, unknown> | undefined),
    queryFn: () => ordersApi.getOrders(filters),
  });
}

/**
 * Hook to fetch a single order with its production cards
 */
export function useOrder(orderId: string | null) {
  return useQuery({
    queryKey: queryKeys.orders.detail(orderId ?? ''),
    queryFn: () => (orderId ? ordersApi.getOrder(orderId) : Promise.reject('No order ID')),
    enabled: !!orderId,
  });
}

/**
 * Hook to create a new order
 */
export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOrderRequest) => ordersApi.createOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
      showToast.success('Nalog kreiran');
    },
    onError: () => {
      showToast.error('Greška pri kreiranju naloga');
    },
  });
}

/**
 * Hook to update an order
 */
export function useUpdateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, data }: { orderId: string; data: UpdateOrderRequest }) =>
      ordersApi.updateOrder(orderId, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.detail(variables.orderId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
      showToast.success('Nalog ažuriran');
    },
    onError: () => {
      showToast.error('Greška pri ažuriranju naloga');
    },
  });
}

/**
 * Hook to delete an order
 */
export function useDeleteOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => ordersApi.deleteOrder(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
      showToast.success('Nalog obrisan');
    },
    onError: () => {
      showToast.error('Greška pri brisanju naloga');
    },
  });
}

/**
 * Hook to start production for an order
 */
export function useStartProduction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => ordersApi.startProduction(orderId),
    onSuccess: (_data, orderId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.detail(orderId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.production.cards() });
      showToast.success('Proizvodnja pokrenuta');
    },
    onError: () => {
      showToast.error('Greška pri pokretanju proizvodnje');
    },
  });
}

/**
 * Hook to cancel an order
 */
export function useCancelOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, reason }: { orderId: string; reason?: string }) =>
      ordersApi.cancelOrder(orderId, reason),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.detail(variables.orderId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
      showToast.warning('Nalog otkazan');
    },
    onError: () => {
      showToast.error('Greška pri otkazivanju naloga');
    },
  });
}
