import type { Order, OrderStatus, OrderPriority, ProductionCard } from '@/types/domain';

/**
 * Order with production cards
 */
export interface OrderWithCards extends Order {
  productionCards: ProductionCard[];
}

/**
 * Filters for order queries
 */
export interface OrderFilters {
  status?: OrderStatus;
  priority?: OrderPriority;
  customerId?: string;
  fromDate?: string;
  toDate?: string;
  search?: string;
}

/**
 * Create order request
 */
export interface CreateOrderRequest {
  customerName: string;
  description?: string;
  priority: OrderPriority;
  deadline: string;
  items?: OrderItemInput[];
}

/**
 * Order item input for creation
 */
export interface OrderItemInput {
  productName: string;
  quantity: number;
  unit: string;
  notes?: string;
}

/**
 * Update order request
 */
export interface UpdateOrderRequest {
  customerName?: string;
  description?: string;
  priority?: OrderPriority;
  deadline?: string;
  status?: OrderStatus;
}
