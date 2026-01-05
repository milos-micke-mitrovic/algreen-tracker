/**
 * SignalR event types for real-time updates
 */

import type { ProductionCardStatus, OrderPriority } from './domain';

// ============================================================================
// Base Event
// ============================================================================

export interface BaseEvent {
  eventId: string;
  tenantId: string;
  timestamp: string;
}

// ============================================================================
// Production Card Events
// ============================================================================

export interface ProductionCardCreatedEvent extends BaseEvent {
  type: 'ProductionCardCreated';
  cardId: string;
  orderId: string;
  orderNumber: string;
  departmentId: string;
  departmentName: string;
  priority: OrderPriority;
  deadline: string;
}

export interface ProductionStepStartedEvent extends BaseEvent {
  type: 'ProductionStepStarted';
  cardId: string;
  stepId: string;
  stepName: string;
  departmentId: string;
  departmentName: string;
  userId: string;
  userName: string;
  startedAt: string;
}

export interface ProductionStepCompletedEvent extends BaseEvent {
  type: 'ProductionStepCompleted';
  cardId: string;
  completedStepId: string;
  completedStepName: string;
  nextStepId: string | null;
  nextStepName: string | null;
  nextDepartmentId: string | null;
  nextDepartmentName: string | null;
  isOrderComplete: boolean;
  userId: string;
  userName: string;
  completedAt: string;
  duration: number; // in minutes
}

export interface ProductionStepPausedEvent extends BaseEvent {
  type: 'ProductionStepPaused';
  cardId: string;
  stepId: string;
  stepName: string;
  departmentId: string;
  userId: string;
  userName: string;
  notes?: string;
}

export interface ProductionBlockedEvent extends BaseEvent {
  type: 'ProductionBlocked';
  cardId: string;
  stepId: string;
  stepName: string;
  departmentId: string;
  departmentName: string;
  reason: string;
  userId: string;
  userName: string;
}

export interface ProductionCardStatusChangedEvent extends BaseEvent {
  type: 'ProductionCardStatusChanged';
  cardId: string;
  previousStatus: ProductionCardStatus;
  newStatus: ProductionCardStatus;
  departmentId: string;
}

// ============================================================================
// Order Events
// ============================================================================

export interface OrderCreatedEvent extends BaseEvent {
  type: 'OrderCreated';
  orderId: string;
  orderNumber: string;
  customerName: string;
  priority: OrderPriority;
  deadline: string;
}

export interface OrderCompletedEvent extends BaseEvent {
  type: 'OrderCompleted';
  orderId: string;
  orderNumber: string;
  completedAt: string;
  totalDuration: number; // in minutes
}

// ============================================================================
// Department Events
// ============================================================================

export interface DepartmentWorkloadChangedEvent extends BaseEvent {
  type: 'DepartmentWorkloadChanged';
  departmentId: string;
  departmentName: string;
  activeCards: number;
  blockedCards: number;
}

// ============================================================================
// Union Type for All Events
// ============================================================================

export type ProductionEvent =
  | ProductionCardCreatedEvent
  | ProductionStepStartedEvent
  | ProductionStepCompletedEvent
  | ProductionStepPausedEvent
  | ProductionBlockedEvent
  | ProductionCardStatusChangedEvent
  | OrderCreatedEvent
  | OrderCompletedEvent
  | DepartmentWorkloadChangedEvent;

// ============================================================================
// Event Names (for type-safe subscriptions)
// ============================================================================

export type ProductionEventName = ProductionEvent['type'];

// ============================================================================
// Event Handler Type
// ============================================================================

export type EventHandler<T extends ProductionEvent> = (event: T) => void;

// ============================================================================
// Type-safe Event Map
// ============================================================================

export interface ProductionEventMap {
  ProductionCardCreated: ProductionCardCreatedEvent;
  ProductionStepStarted: ProductionStepStartedEvent;
  ProductionStepCompleted: ProductionStepCompletedEvent;
  ProductionStepPaused: ProductionStepPausedEvent;
  ProductionBlocked: ProductionBlockedEvent;
  ProductionCardStatusChanged: ProductionCardStatusChangedEvent;
  OrderCreated: OrderCreatedEvent;
  OrderCompleted: OrderCompletedEvent;
  DepartmentWorkloadChanged: DepartmentWorkloadChangedEvent;
}
