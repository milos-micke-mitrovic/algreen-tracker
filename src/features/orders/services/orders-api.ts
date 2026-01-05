import { get, post, put, del } from '@/services/api';
import type { Order } from '@/types/domain';
import type {
  OrderFilters,
  OrderWithCards,
  CreateOrderRequest,
  UpdateOrderRequest,
} from '../types/order.types';
import { mockOrders, mockProductionCards, delay } from '@/lib/mock-data';

// Toggle for using mock data (set to false when API is ready)
const USE_MOCK = true;

// In-memory mock state for mutations
let mockOrderList = [...mockOrders];
let nextOrderNumber = 9;

/**
 * Orders API service
 */
export const ordersApi = {
  /**
   * Get all orders with optional filters
   */
  async getOrders(filters?: OrderFilters): Promise<Order[]> {
    if (USE_MOCK) {
      await delay(300);
      let orders = [...mockOrderList];

      if (filters?.status) {
        orders = orders.filter((o) => o.status === filters.status);
      }
      if (filters?.priority) {
        orders = orders.filter((o) => o.priority === filters.priority);
      }
      if (filters?.fromDate) {
        const fromDate = new Date(filters.fromDate);
        orders = orders.filter((o) => new Date(o.createdAt) >= fromDate);
      }
      if (filters?.toDate) {
        const toDate = new Date(filters.toDate);
        orders = orders.filter((o) => new Date(o.createdAt) <= toDate);
      }
      if (filters?.search) {
        const search = filters.search.toLowerCase();
        orders = orders.filter(
          (o) =>
            o.customerName.toLowerCase().includes(search) ||
            o.orderNumber.toLowerCase().includes(search) ||
            o.description.toLowerCase().includes(search)
        );
      }

      return orders;
    }

    const params = new URLSearchParams();

    if (filters?.status) params.append('status', filters.status);
    if (filters?.priority) params.append('priority', filters.priority);
    if (filters?.customerId) params.append('customerId', filters.customerId);
    if (filters?.fromDate) params.append('fromDate', filters.fromDate);
    if (filters?.toDate) params.append('toDate', filters.toDate);
    if (filters?.search) params.append('search', filters.search);

    const queryString = params.toString();
    const url = queryString ? `/orders?${queryString}` : '/orders';

    return get<Order[]>(url);
  },

  /**
   * Get single order by ID
   */
  async getOrder(orderId: string): Promise<OrderWithCards> {
    if (USE_MOCK) {
      await delay(200);
      const order = mockOrderList.find((o) => o.id === orderId);
      if (!order) {
        throw new Error('Order not found');
      }
      const cards = mockProductionCards.filter((c) => c.orderId === orderId);
      return { ...order, productionCards: cards };
    }

    return get<OrderWithCards>(`/orders/${orderId}`);
  },

  /**
   * Create new order
   */
  async createOrder(data: CreateOrderRequest): Promise<Order> {
    if (USE_MOCK) {
      await delay(400);
      const newOrder: Order = {
        id: `order-${Date.now()}`,
        tenantId: 'tenant-1',
        orderNumber: `ALG-2024-00${nextOrderNumber++}`,
        customerName: data.customerName,
        description: data.description || '',
        status: 'draft',
        priority: data.priority,
        deadline: data.deadline,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      mockOrderList.push(newOrder);
      return newOrder;
    }

    return post<Order>('/orders', data);
  },

  /**
   * Update order
   */
  async updateOrder(orderId: string, data: UpdateOrderRequest): Promise<Order> {
    if (USE_MOCK) {
      await delay(300);
      const index = mockOrderList.findIndex((o) => o.id === orderId);
      if (index === -1) {
        throw new Error('Order not found');
      }

      const updatedOrder: Order = {
        ...mockOrderList[index],
        ...data,
        updatedAt: new Date().toISOString(),
      };

      mockOrderList[index] = updatedOrder;
      return updatedOrder;
    }

    return put<Order>(`/orders/${orderId}`, data);
  },

  /**
   * Delete order
   */
  async deleteOrder(orderId: string): Promise<void> {
    if (USE_MOCK) {
      await delay(300);
      mockOrderList = mockOrderList.filter((o) => o.id !== orderId);
      return;
    }

    return del(`/orders/${orderId}`);
  },

  /**
   * Start production for order (creates production card)
   */
  async startProduction(orderId: string): Promise<void> {
    if (USE_MOCK) {
      await delay(400);
      const index = mockOrderList.findIndex((o) => o.id === orderId);
      if (index === -1) {
        throw new Error('Order not found');
      }
      mockOrderList[index] = { ...mockOrderList[index], status: 'in_production' };
      return;
    }

    return post(`/orders/${orderId}/start-production`, {});
  },

  /**
   * Cancel order
   */
  async cancelOrder(orderId: string, reason?: string): Promise<Order> {
    if (USE_MOCK) {
      await delay(300);
      const index = mockOrderList.findIndex((o) => o.id === orderId);
      if (index === -1) {
        throw new Error('Order not found');
      }
      mockOrderList[index] = {
        ...mockOrderList[index],
        status: 'cancelled',
        notes: reason,
      };
      return mockOrderList[index];
    }

    return post<Order>(`/orders/${orderId}/cancel`, { reason });
  },
};
