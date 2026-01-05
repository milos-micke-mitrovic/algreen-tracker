/**
 * Core domain entities for the Production Management System
 * These types mirror the backend domain model
 */

import type { BaseEntity } from './index';

// ============================================================================
// Tenant & Multi-tenancy
// ============================================================================

export type TenantPlan = 'basic' | 'pro' | 'enterprise';

export interface Tenant extends BaseEntity {
  name: string;
  slug: string;
  plan: TenantPlan;
  isActive: boolean;
  settings: TenantSettings;
}

export interface TenantSettings {
  maxUsers: number;
  maxOrdersPerMonth: number;
  features: string[];
}

// ============================================================================
// Users & Authentication
// ============================================================================

export type UserRole = 'admin' | 'manager' | 'supervisor' | 'worker';

export interface User extends BaseEntity {
  tenantId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  departmentId: string | null;
  isActive: boolean;
}

export interface AuthUser {
  id: string;
  tenantId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  departmentId: string | null;
  permissions: string[];
}

// ============================================================================
// Departments
// ============================================================================

export interface Department extends BaseEntity {
  tenantId: string;
  name: string;
  code: string;
  order: number;
  isActive: boolean;
}

// ============================================================================
// Production Steps (Configurable per tenant)
// ============================================================================

export interface ProductionStep extends BaseEntity {
  tenantId: string;
  name: string;
  code: string;
  order: number;
  departmentId: string;
  department?: Department;
  isActive: boolean;
  estimatedDuration: number; // in minutes
}

// ============================================================================
// Orders
// ============================================================================

export type OrderStatus = 'draft' | 'confirmed' | 'in_production' | 'completed' | 'cancelled';

export interface Order extends BaseEntity {
  tenantId: string;
  orderNumber: string;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  description: string;
  notes?: string;
  status: OrderStatus;
  priority: OrderPriority;
  deadline: string;
  completedAt?: string;
}

export type OrderPriority = 'low' | 'normal' | 'high' | 'urgent';

// ============================================================================
// Production Cards
// ============================================================================

export type ProductionCardStatus = 'new' | 'in_progress' | 'paused' | 'blocked' | 'completed';

export interface ProductionCard extends BaseEntity {
  tenantId: string;
  orderId: string;
  order?: Order;
  currentStepId: string;
  currentStep?: ProductionStep;
  currentDepartmentId: string;
  currentDepartment?: Department;
  status: ProductionCardStatus;
  priority: OrderPriority;
  deadline: string;
  notes?: string;
  startedAt?: string;
  completedAt?: string;
  history: ProductionCardHistoryEntry[];
}

export interface ProductionCardHistoryEntry {
  id: string;
  stepId: string;
  stepName: string;
  departmentId: string;
  departmentName: string;
  status: ProductionCardStatus;
  startedAt: string;
  completedAt?: string;
  duration?: number; // in minutes
  userId: string;
  userName: string;
  notes?: string;
  problemReason?: string;
}

// ============================================================================
// Production Actions (for offline queue)
// ============================================================================

export type ProductionActionType =
  | 'START_STEP'
  | 'PAUSE_STEP'
  | 'COMPLETE_STEP'
  | 'REPORT_PROBLEM';

export interface ProductionAction {
  type: ProductionActionType;
  cardId: string;
  payload?: {
    notes?: string;
    reason?: string;
  };
}

// ============================================================================
// Dashboard & Statistics
// ============================================================================

export interface ProductionStats {
  totalCards: number;
  byStatus: Record<ProductionCardStatus, number>;
  byDepartment: DepartmentStats[];
  delayedCount: number;
  completedToday: number;
  averageCompletionTime: number; // in minutes
}

export interface DepartmentStats {
  departmentId: string;
  departmentName: string;
  activeCards: number;
  completedToday: number;
  blockedCards: number;
}

// ============================================================================
// Filters & Queries
// ============================================================================

export interface ProductionCardFilters {
  departmentId?: string;
  status?: ProductionCardStatus;
  priority?: OrderPriority;
  search?: string;
}

export interface OrderFilters {
  status?: OrderStatus;
  priority?: OrderPriority;
  search?: string;
  fromDate?: string;
  toDate?: string;
}
