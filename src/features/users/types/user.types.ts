import type { User, UserRole } from '@/types/domain';

/**
 * User with department info
 */
export interface UserWithDepartment extends User {
  department?: {
    id: string;
    name: string;
  };
}

/**
 * Filters for user queries
 */
export interface UserFilters {
  role?: UserRole;
  departmentId?: string;
  isActive?: boolean;
  search?: string;
}

/**
 * Create user request
 */
export interface CreateUserRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  departmentId?: string;
}

/**
 * Update user request
 */
export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  role?: UserRole;
  departmentId?: string | null;
  isActive?: boolean;
}
