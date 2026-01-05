import { post } from '@/services/api';
import { useAuthStore } from '@/stores/auth-store';
import { useTenantStore } from '@/stores/tenant-store';
import { initializeSignalR, disconnectSignalR } from '@/lib/signalr';
import type { LoginRequest, LoginResponse, RefreshTokenResponse } from '@/types/api';
import type { AuthUser } from '@/types/domain';
import { delay } from '@/lib/mock-data';

// Toggle for using mock data (set to false when API is ready)
const USE_MOCK = true;

// Mock credentials - any of these users can login
const MOCK_CREDENTIALS: Record<string, { password: string; user: AuthUser }> = {
  'admin@algreen.rs': {
    password: 'admin123',
    user: {
      id: 'user-1',
      tenantId: 'tenant-1',
      email: 'admin@algreen.rs',
      firstName: 'Marko',
      lastName: 'Petrović',
      role: 'admin',
      departmentId: null,
      permissions: ['*'], // Admin has all permissions
    },
  },
  'manager@algreen.rs': {
    password: 'manager123',
    user: {
      id: 'user-2',
      tenantId: 'tenant-1',
      email: 'manager@algreen.rs',
      firstName: 'Jelena',
      lastName: 'Nikolić',
      role: 'manager',
      departmentId: null,
      permissions: ['dashboard:view', 'production:view', 'orders:view', 'users:view', 'settings:view'],
    },
  },
  'petar.ilic@algreen.rs': {
    password: 'radnik123',
    user: {
      id: 'user-5',
      tenantId: 'tenant-1',
      email: 'petar.ilic@algreen.rs',
      firstName: 'Petar',
      lastName: 'Ilić',
      role: 'worker',
      departmentId: 'dept-1', // Sečenje
      permissions: ['production:read', 'production:write'],
    },
  },
  'nikola.markovic@algreen.rs': {
    password: 'radnik123',
    user: {
      id: 'user-7',
      tenantId: 'tenant-1',
      email: 'nikola.markovic@algreen.rs',
      firstName: 'Nikola',
      lastName: 'Marković',
      role: 'worker',
      departmentId: 'dept-3', // Montaža
      permissions: ['production:read', 'production:write'],
    },
  },
};

// Mock tenant
const MOCK_TENANT = {
  id: 'tenant-1',
  name: 'Algreen d.o.o.',
  slug: 'algreen',
  plan: 'pro' as const,
  isActive: true,
  settings: {
    maxUsers: 50,
    maxOrdersPerMonth: 1000,
    features: ['production', 'orders', 'reports'],
  },
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

/**
 * Auth API service
 */
export const authApi = {
  /**
   * Login with email and password
   */
  async login(data: LoginRequest): Promise<LoginResponse> {
    if (USE_MOCK) {
      await delay(500); // Simulate network delay

      const credential = MOCK_CREDENTIALS[data.email.toLowerCase()];

      if (!credential || credential.password !== data.password) {
        throw new Error('Pogrešan email ili lozinka');
      }

      const response: LoginResponse = {
        accessToken: 'mock-access-token-' + Date.now(),
        refreshToken: 'mock-refresh-token-' + Date.now(),
        expiresIn: 3600, // 1 hour
        user: credential.user,
        tenant: MOCK_TENANT,
      };

      // Store tokens
      useAuthStore.getState().setTokens(response.accessToken, response.refreshToken);

      // Store user
      useAuthStore.getState().setUser(response.user);

      // Store tenant info
      useTenantStore.getState().setTenant(response.tenant);

      return response;
    }

    const response = await post<LoginResponse>('/auth/login', data);

    // Store tokens
    useAuthStore.getState().setTokens(response.accessToken, response.refreshToken);

    // Store user
    useAuthStore.getState().setUser(response.user);

    // Store tenant info
    useTenantStore.getState().setTenant(response.tenant);

    // Initialize SignalR connection
    try {
      await initializeSignalR();
    } catch (error) {
      console.warn('Failed to initialize SignalR:', error);
    }

    return response;
  },

  /**
   * Logout and clear session
   */
  async logout(): Promise<void> {
    if (USE_MOCK) {
      await delay(200);
      useAuthStore.getState().logout();
      useTenantStore.getState().clearTenant();
      return;
    }

    try {
      // Disconnect SignalR
      await disconnectSignalR();

      // Call logout endpoint (invalidate refresh token on server)
      const refreshToken = useAuthStore.getState().refreshToken;
      if (refreshToken) {
        await post('/auth/logout', { refreshToken });
      }
    } catch (error) {
      console.warn('Logout API call failed:', error);
    } finally {
      // Always clear local state
      useAuthStore.getState().logout();
      useTenantStore.getState().clearTenant();
    }
  },

  /**
   * Refresh access token
   */
  async refreshToken(): Promise<RefreshTokenResponse> {
    if (USE_MOCK) {
      await delay(200);
      const currentToken = useAuthStore.getState().refreshToken;
      if (!currentToken) {
        throw new Error('No refresh token available');
      }

      const response: RefreshTokenResponse = {
        accessToken: 'mock-access-token-' + Date.now(),
        refreshToken: 'mock-refresh-token-' + Date.now(),
        expiresIn: 3600, // 1 hour
      };

      useAuthStore.getState().setTokens(response.accessToken, response.refreshToken);
      return response;
    }

    const refreshToken = useAuthStore.getState().refreshToken;

    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await post<RefreshTokenResponse>('/auth/refresh', {
      refreshToken,
    });

    // Update tokens
    useAuthStore.getState().setTokens(response.accessToken, response.refreshToken);

    return response;
  },

  /**
   * Check if current session is valid
   */
  async validateSession(): Promise<boolean> {
    if (USE_MOCK) {
      const { accessToken, user } = useAuthStore.getState();
      return !!(accessToken && user);
    }

    try {
      const { accessToken, refreshToken } = useAuthStore.getState();

      if (!accessToken || !refreshToken) {
        return false;
      }

      // Try to refresh if token might be expired
      // This is a simple check - in production you'd decode JWT to check exp
      await authApi.refreshToken();
      return true;
    } catch {
      // Clear invalid session
      useAuthStore.getState().logout();
      useTenantStore.getState().clearTenant();
      return false;
    }
  },

  /**
   * Change password
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    if (USE_MOCK) {
      await delay(500);
      // In mock mode, just pretend it worked
      return;
    }

    await post('/auth/change-password', {
      currentPassword,
      newPassword,
    });
  },

  /**
   * Request password reset email
   */
  async requestPasswordReset(email: string): Promise<void> {
    if (USE_MOCK) {
      await delay(500);
      // In mock mode, just pretend it worked
      return;
    }

    await post('/auth/forgot-password', { email });
  },

  /**
   * Reset password with token
   */
  async resetPassword(token: string, newPassword: string): Promise<void> {
    if (USE_MOCK) {
      await delay(500);
      // In mock mode, just pretend it worked
      return;
    }

    await post('/auth/reset-password', {
      token,
      newPassword,
    });
  },

  /**
   * Get available mock credentials (for development UI)
   */
  getMockCredentials(): Array<{ email: string; password: string; role: string }> {
    return Object.entries(MOCK_CREDENTIALS).map(([email, { password, user }]) => ({
      email,
      password,
      role: user.role,
    }));
  },
};
