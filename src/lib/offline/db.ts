import Dexie, { type Table } from 'dexie';

import type { ProductionCard, ProductionStep, Department } from '@/types/domain';

/**
 * Queued action for offline sync
 */
export interface QueuedAction {
  id?: number;
  type: string;
  payload: Record<string, unknown>;
  createdAt: Date;
  retryCount: number;
  lastError?: string;
  tenantId: string;
  userId: string;
}

/**
 * Cached production card
 */
export interface CachedProductionCard {
  id: string;
  data: ProductionCard;
  cachedAt: Date;
  tenantId: string;
}

/**
 * Cached production step configuration
 */
export interface CachedProductionStep {
  id: string;
  data: ProductionStep;
  cachedAt: Date;
  tenantId: string;
}

/**
 * Cached department
 */
export interface CachedDepartment {
  id: string;
  data: Department;
  cachedAt: Date;
  tenantId: string;
}

/**
 * Offline database schema using Dexie
 */
class OfflineDatabase extends Dexie {
  actionQueue!: Table<QueuedAction>;
  productionCards!: Table<CachedProductionCard>;
  productionSteps!: Table<CachedProductionStep>;
  departments!: Table<CachedDepartment>;

  constructor() {
    super('algreen-tracker-offline');

    this.version(1).stores({
      // Action queue - auto-increment id, indexed by type and createdAt
      actionQueue: '++id, type, createdAt, tenantId',

      // Production cards cache - indexed by id and tenantId
      productionCards: 'id, tenantId, cachedAt',

      // Production steps cache
      productionSteps: 'id, tenantId',

      // Departments cache
      departments: 'id, tenantId',
    });
  }
}

// Singleton database instance
export const db = new OfflineDatabase();

// Helper functions

/**
 * Clear all cached data for a tenant
 */
export async function clearTenantCache(tenantId: string): Promise<void> {
  await db.transaction('rw', [db.productionCards, db.productionSteps, db.departments], async () => {
    await db.productionCards.where('tenantId').equals(tenantId).delete();
    await db.productionSteps.where('tenantId').equals(tenantId).delete();
    await db.departments.where('tenantId').equals(tenantId).delete();
  });
}

/**
 * Clear all offline data
 */
export async function clearAllOfflineData(): Promise<void> {
  await db.transaction('rw', [db.actionQueue, db.productionCards, db.productionSteps, db.departments], async () => {
    await db.actionQueue.clear();
    await db.productionCards.clear();
    await db.productionSteps.clear();
    await db.departments.clear();
  });
}

/**
 * Get count of pending actions
 */
export async function getPendingActionsCount(): Promise<number> {
  return db.actionQueue.count();
}

/**
 * Cache production cards
 */
export async function cacheProductionCards(cards: ProductionCard[], tenantId: string): Promise<void> {
  const now = new Date();
  const cachedCards: CachedProductionCard[] = cards.map((card) => ({
    id: card.id,
    data: card,
    cachedAt: now,
    tenantId,
  }));

  await db.productionCards.bulkPut(cachedCards);
}

/**
 * Get cached production cards
 */
export async function getCachedProductionCards(tenantId: string): Promise<ProductionCard[]> {
  const cached = await db.productionCards.where('tenantId').equals(tenantId).toArray();
  return cached.map((c) => c.data);
}

/**
 * Cache production steps
 */
export async function cacheProductionSteps(steps: ProductionStep[], tenantId: string): Promise<void> {
  const now = new Date();
  const cachedSteps: CachedProductionStep[] = steps.map((step) => ({
    id: step.id,
    data: step,
    cachedAt: now,
    tenantId,
  }));

  await db.productionSteps.bulkPut(cachedSteps);
}

/**
 * Get cached production steps
 */
export async function getCachedProductionSteps(tenantId: string): Promise<ProductionStep[]> {
  const cached = await db.productionSteps.where('tenantId').equals(tenantId).toArray();
  return cached.map((c) => c.data);
}

/**
 * Cache departments
 */
export async function cacheDepartments(departments: Department[], tenantId: string): Promise<void> {
  const now = new Date();
  const cachedDepts: CachedDepartment[] = departments.map((dept) => ({
    id: dept.id,
    data: dept,
    cachedAt: now,
    tenantId,
  }));

  await db.departments.bulkPut(cachedDepts);
}

/**
 * Get cached departments
 */
export async function getCachedDepartments(tenantId: string): Promise<Department[]> {
  const cached = await db.departments.where('tenantId').equals(tenantId).toArray();
  return cached.map((c) => c.data);
}
