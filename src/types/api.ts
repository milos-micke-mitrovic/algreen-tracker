/**
 * API request/response types
 */

import type {
  AuthUser,
  Department,
  Order,
  ProductionCard,
  ProductionCardFilters,
  ProductionStats,
  ProductionStep,
  Tenant,
} from './domain';

// ============================================================================
// Authentication
// ============================================================================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: AuthUser;
  tenant: Tenant;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// ============================================================================
// Production Cards
// ============================================================================

export interface GetProductionCardsRequest {
  filters?: ProductionCardFilters;
  page?: number;
  pageSize?: number;
}

export interface GetProductionCardsResponse {
  cards: ProductionCard[];
  total: number;
  page: number;
  pageSize: number;
}

export interface StartStepRequest {
  cardId: string;
}

export interface StartStepResponse {
  card: ProductionCard;
}

export interface PauseStepRequest {
  cardId: string;
  notes?: string;
}

export interface PauseStepResponse {
  card: ProductionCard;
}

export interface CompleteStepRequest {
  cardId: string;
  notes?: string;
}

export interface CompleteStepResponse {
  card: ProductionCard;
  isOrderComplete: boolean;
}

export interface ReportProblemRequest {
  cardId: string;
  reason: string;
  notes?: string;
}

export interface ReportProblemResponse {
  card: ProductionCard;
}

// ============================================================================
// Production Steps
// ============================================================================

export interface GetProductionStepsResponse {
  steps: ProductionStep[];
}

// ============================================================================
// Departments
// ============================================================================

export interface GetDepartmentsResponse {
  departments: Department[];
}

// ============================================================================
// Orders
// ============================================================================

export interface CreateOrderRequest {
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  description: string;
  notes?: string;
  priority: Order['priority'];
  deadline: string;
}

export interface CreateOrderResponse {
  order: Order;
  productionCard: ProductionCard;
}

export interface UpdateOrderRequest {
  orderId: string;
  data: Partial<CreateOrderRequest>;
}

export interface UpdateOrderResponse {
  order: Order;
}

// ============================================================================
// Dashboard
// ============================================================================

export interface GetDashboardStatsResponse {
  stats: ProductionStats;
  recentActivity: RecentActivityItem[];
}

export interface RecentActivityItem {
  id: string;
  type: 'step_completed' | 'step_started' | 'problem_reported' | 'order_created';
  cardId?: string;
  orderId?: string;
  orderNumber?: string;
  departmentName?: string;
  userName: string;
  message: string;
  timestamp: string;
}

// ============================================================================
// Error Response
// ============================================================================

export interface ApiErrorResponse {
  code: string;
  message: string;
  details?: Record<string, string[]>;
}

// ============================================================================
// Common
// ============================================================================

export interface SuccessResponse {
  success: boolean;
  message?: string;
}
