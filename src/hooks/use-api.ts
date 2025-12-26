import { useCallback, useEffect, useRef, useState } from 'react';
import { AxiosError } from 'axios';

interface UseApiState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

interface UseApiOptions {
  immediate?: boolean; // Fetch immediately on mount (default: true)
}

function getErrorMessage(err: unknown): string {
  return err instanceof AxiosError
    ? err.response?.data?.message || err.message
    : 'An unexpected error occurred';
}

/**
 * Generic hook for API calls with loading and error states
 *
 * @example
 * // Fetch on mount
 * const { data, isLoading, error } = useApi(() => get<User[]>('/users'));
 *
 * @example
 * // Fetch manually
 * const { data, isLoading, execute } = useApi(() => get<User>(`/users/${id}`), { immediate: false });
 * // Later: execute();
 */
export function useApi<T>(
  fetchFn: () => Promise<T>,
  options: UseApiOptions = {}
): UseApiState<T> & { execute: () => Promise<void>; reset: () => void } {
  const { immediate = true } = options;
  const hasFetched = useRef(false);

  const [state, setState] = useState<UseApiState<T>>(() => ({
    data: null,
    isLoading: immediate,
    error: null,
  }));

  const execute = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const data = await fetchFn();
      setState({ data, isLoading: false, error: null });
    } catch (err) {
      setState((prev) => ({ ...prev, isLoading: false, error: getErrorMessage(err) }));
    }
  }, [fetchFn]);

  const reset = useCallback(() => {
    setState({ data: null, isLoading: false, error: null });
  }, []);

  useEffect(() => {
    if (immediate && !hasFetched.current) {
      hasFetched.current = true;
      fetchFn().then(
        (data) => {
          setState({ data, isLoading: false, error: null });
        },
        (err) => {
          setState((prev) => ({ ...prev, isLoading: false, error: getErrorMessage(err) }));
        }
      );
    }
  }, [immediate, fetchFn]);

  return { ...state, execute, reset };
}

/**
 * Hook for mutations (POST, PUT, DELETE) with loading and error states
 *
 * @example
 * const { mutate, isLoading, error } = useMutation((data: CreateUserDto) =>
 *   post<User>('/users', data)
 * );
 *
 * // Usage:
 * await mutate({ name: 'John', email: 'john@example.com' });
 */
export function useMutation<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>
): {
  mutate: (variables: TVariables) => Promise<TData | null>;
  data: TData | null;
  isLoading: boolean;
  error: string | null;
  reset: () => void;
} {
  const [state, setState] = useState<UseApiState<TData>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const mutate = useCallback(
    async (variables: TVariables): Promise<TData | null> => {
      setState({ data: null, isLoading: true, error: null });

      try {
        const data = await mutationFn(variables);
        setState({ data, isLoading: false, error: null });
        return data;
      } catch (err) {
        setState((prev) => ({ ...prev, isLoading: false, error: getErrorMessage(err) }));
        return null;
      }
    },
    [mutationFn]
  );

  const reset = useCallback(() => {
    setState({ data: null, isLoading: false, error: null });
  }, []);

  return { ...state, mutate, reset };
}
