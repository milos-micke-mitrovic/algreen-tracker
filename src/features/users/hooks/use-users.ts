import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/lib/query-client';
import { showToast } from '@/lib/toast';
import { usersApi } from '../services/users-api';
import type { UserFilters, CreateUserRequest, UpdateUserRequest } from '../types/user.types';

/**
 * Hook to fetch users with optional filters
 */
export function useUsers(filters?: UserFilters) {
  return useQuery({
    queryKey: [...queryKeys.users.list(), filters],
    queryFn: () => usersApi.getUsers(filters),
  });
}

/**
 * Hook to fetch a single user
 */
export function useUser(userId: string | null) {
  return useQuery({
    queryKey: [...queryKeys.users.all, 'detail', userId],
    queryFn: () => (userId ? usersApi.getUser(userId) : Promise.reject('No user ID')),
    enabled: !!userId,
  });
}

/**
 * Hook to create a new user
 */
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserRequest) => usersApi.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      showToast.success('Korisnik kreiran');
    },
    onError: () => {
      showToast.error('Greška pri kreiranju korisnika');
    },
  });
}

/**
 * Hook to update a user
 */
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: UpdateUserRequest }) =>
      usersApi.updateUser(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      showToast.success('Korisnik ažuriran');
    },
    onError: () => {
      showToast.error('Greška pri ažuriranju korisnika');
    },
  });
}

/**
 * Hook to delete a user
 */
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => usersApi.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      showToast.success('Korisnik obrisan');
    },
    onError: () => {
      showToast.error('Greška pri brisanju korisnika');
    },
  });
}

/**
 * Hook to activate/deactivate a user
 */
export function useToggleUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, activate }: { userId: string; activate: boolean }) =>
      activate ? usersApi.activateUser(userId) : usersApi.deactivateUser(userId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      showToast.success(variables.activate ? 'Korisnik aktiviran' : 'Korisnik deaktiviran');
    },
    onError: () => {
      showToast.error('Greška pri promeni statusa');
    },
  });
}

/**
 * Hook to reset user password
 */
export function useResetUserPassword() {
  return useMutation({
    mutationFn: (userId: string) => usersApi.resetUserPassword(userId),
    onSuccess: () => {
      showToast.success('Lozinka resetovana');
    },
    onError: () => {
      showToast.error('Greška pri resetovanju lozinke');
    },
  });
}
