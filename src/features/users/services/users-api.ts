import { get, post, put, del } from '@/services/api';
import type { User } from '@/types/domain';
import type {
  UserFilters,
  UserWithDepartment,
  CreateUserRequest,
  UpdateUserRequest,
} from '../types/user.types';
import { mockUsers, mockDepartments, delay } from '@/lib/mock-data';

// Toggle for using mock data (set to false when API is ready)
const USE_MOCK = true;

// In-memory mock state for mutations
let mockUserList = [...mockUsers];
let nextUserId = 100;

/**
 * Users API service
 */
export const usersApi = {
  /**
   * Get all users with optional filters
   */
  async getUsers(filters?: UserFilters): Promise<UserWithDepartment[]> {
    if (USE_MOCK) {
      await delay(300);
      let users = [...mockUserList];

      if (filters?.role) {
        users = users.filter((u) => u.role === filters.role);
      }
      if (filters?.departmentId) {
        users = users.filter((u) => u.departmentId === filters.departmentId);
      }
      if (filters?.isActive !== undefined) {
        users = users.filter((u) => u.isActive === filters.isActive);
      }
      if (filters?.search) {
        const search = filters.search.toLowerCase();
        users = users.filter(
          (u) =>
            u.firstName.toLowerCase().includes(search) ||
            u.lastName.toLowerCase().includes(search) ||
            u.email.toLowerCase().includes(search)
        );
      }

      return users;
    }

    const params = new URLSearchParams();

    if (filters?.role) params.append('role', filters.role);
    if (filters?.departmentId) params.append('departmentId', filters.departmentId);
    if (filters?.isActive !== undefined) params.append('isActive', String(filters.isActive));
    if (filters?.search) params.append('search', filters.search);

    const queryString = params.toString();
    const url = queryString ? `/users?${queryString}` : '/users';

    return get<UserWithDepartment[]>(url);
  },

  /**
   * Get single user by ID
   */
  async getUser(userId: string): Promise<UserWithDepartment> {
    if (USE_MOCK) {
      await delay(200);
      const user = mockUserList.find((u) => u.id === userId);
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    }

    return get<UserWithDepartment>(`/users/${userId}`);
  },

  /**
   * Create new user
   */
  async createUser(data: CreateUserRequest): Promise<User> {
    if (USE_MOCK) {
      await delay(400);
      const department = data.departmentId
        ? mockDepartments.find((d) => d.id === data.departmentId)
        : undefined;

      const newUser: UserWithDepartment = {
        id: `user-${nextUserId++}`,
        tenantId: 'tenant-1',
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        departmentId: data.departmentId || null,
        department: department ? { id: department.id, name: department.name } : undefined,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      mockUserList.push(newUser);
      return newUser;
    }

    return post<User>('/users', data);
  },

  /**
   * Update user
   */
  async updateUser(userId: string, data: UpdateUserRequest): Promise<User> {
    if (USE_MOCK) {
      await delay(300);
      const index = mockUserList.findIndex((u) => u.id === userId);
      if (index === -1) {
        throw new Error('User not found');
      }

      const department = data.departmentId
        ? mockDepartments.find((d) => d.id === data.departmentId)
        : data.departmentId === null
          ? undefined
          : mockUserList[index].department;

      const updatedUser: UserWithDepartment = {
        ...mockUserList[index],
        ...data,
        department: department ? { id: department.id, name: department.name } : undefined,
        updatedAt: new Date().toISOString(),
      };

      mockUserList[index] = updatedUser;
      return updatedUser;
    }

    return put<User>(`/users/${userId}`, data);
  },

  /**
   * Delete user
   */
  async deleteUser(userId: string): Promise<void> {
    if (USE_MOCK) {
      await delay(300);
      mockUserList = mockUserList.filter((u) => u.id !== userId);
      return;
    }

    return del(`/users/${userId}`);
  },

  /**
   * Activate user
   */
  async activateUser(userId: string): Promise<User> {
    if (USE_MOCK) {
      await delay(300);
      const index = mockUserList.findIndex((u) => u.id === userId);
      if (index === -1) {
        throw new Error('User not found');
      }
      mockUserList[index] = { ...mockUserList[index], isActive: true };
      return mockUserList[index];
    }

    return post<User>(`/users/${userId}/activate`, {});
  },

  /**
   * Deactivate user
   */
  async deactivateUser(userId: string): Promise<User> {
    if (USE_MOCK) {
      await delay(300);
      const index = mockUserList.findIndex((u) => u.id === userId);
      if (index === -1) {
        throw new Error('User not found');
      }
      mockUserList[index] = { ...mockUserList[index], isActive: false };
      return mockUserList[index];
    }

    return post<User>(`/users/${userId}/deactivate`, {});
  },

  /**
   * Reset user password
   */
  async resetUserPassword(userId: string): Promise<{ temporaryPassword: string }> {
    if (USE_MOCK) {
      await delay(400);
      // Generate a fake temporary password
      return { temporaryPassword: 'TempPass123!' };
    }

    return post<{ temporaryPassword: string }>(`/users/${userId}/reset-password`, {});
  },
};
