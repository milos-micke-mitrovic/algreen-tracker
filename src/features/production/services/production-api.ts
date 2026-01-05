import { get, post } from '@/services/api';
import type {
  GetProductionCardsResponse,
  GetProductionStepsResponse,
  StartStepResponse,
  PauseStepResponse,
  CompleteStepResponse,
  ReportProblemResponse,
  GetDepartmentsResponse,
} from '@/types/api';
import type { ProductionCard, ProductionStep, Department, ProductionCardFilters } from '@/types/domain';
import {
  mockProductionCards,
  mockProductionSteps,
  mockDepartments,
  delay,
} from '@/lib/mock-data';

// Toggle for using mock data (set to false when API is ready)
const USE_MOCK = true;

/**
 * Production API service
 */
export const productionApi = {
  /**
   * Get production cards with optional filters
   */
  getCards: async (filters?: ProductionCardFilters): Promise<ProductionCard[]> => {
    if (USE_MOCK) {
      await delay(300);
      let cards = [...mockProductionCards];

      if (filters?.departmentId) {
        cards = cards.filter((c) => c.currentDepartmentId === filters.departmentId);
      }
      if (filters?.status) {
        cards = cards.filter((c) => c.status === filters.status);
      }
      if (filters?.priority) {
        cards = cards.filter((c) => c.priority === filters.priority);
      }
      if (filters?.search) {
        const search = filters.search.toLowerCase();
        cards = cards.filter(
          (c) =>
            c.order?.customerName.toLowerCase().includes(search) ||
            c.order?.orderNumber.toLowerCase().includes(search)
        );
      }

      return cards;
    }

    const params = new URLSearchParams();
    if (filters?.departmentId) params.append('departmentId', filters.departmentId);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.priority) params.append('priority', filters.priority);
    if (filters?.search) params.append('search', filters.search);

    const queryString = params.toString();
    const url = `/production/cards${queryString ? `?${queryString}` : ''}`;

    const response = await get<GetProductionCardsResponse>(url);
    return response.cards;
  },

  /**
   * Get a single production card by ID
   */
  getCard: async (id: string): Promise<ProductionCard> => {
    if (USE_MOCK) {
      await delay(200);
      const card = mockProductionCards.find((c) => c.id === id);
      if (!card) {
        throw new Error('Card not found');
      }
      return card;
    }

    return get<ProductionCard>(`/production/cards/${id}`);
  },

  /**
   * Get production steps (configurable per tenant)
   */
  getSteps: async (): Promise<ProductionStep[]> => {
    if (USE_MOCK) {
      await delay(200);
      return mockProductionSteps;
    }

    const response = await get<GetProductionStepsResponse>('/production/steps');
    return response.steps;
  },

  /**
   * Get departments
   */
  getDepartments: async (): Promise<Department[]> => {
    if (USE_MOCK) {
      await delay(200);
      return mockDepartments;
    }

    const response = await get<GetDepartmentsResponse>('/departments');
    return response.departments;
  },

  /**
   * Start working on a production step
   */
  startStep: async (cardId: string): Promise<ProductionCard> => {
    if (USE_MOCK) {
      await delay(300);
      const card = mockProductionCards.find((c) => c.id === cardId);
      if (!card) {
        throw new Error('Card not found');
      }
      // Simulate starting the step
      return {
        ...card,
        status: 'in_progress',
        startedAt: new Date().toISOString(),
      };
    }

    const response = await post<StartStepResponse>(`/production/cards/${cardId}/start`);
    return response.card;
  },

  /**
   * Pause a production step
   */
  pauseStep: async (cardId: string, notes?: string): Promise<ProductionCard> => {
    if (USE_MOCK) {
      await delay(300);
      const card = mockProductionCards.find((c) => c.id === cardId);
      if (!card) {
        throw new Error('Card not found');
      }
      return {
        ...card,
        status: 'paused',
        notes: notes || card.notes,
      };
    }

    const response = await post<PauseStepResponse>(`/production/cards/${cardId}/pause`, { notes });
    return response.card;
  },

  /**
   * Complete a production step
   */
  completeStep: async (cardId: string, notes?: string): Promise<{ card: ProductionCard; isOrderComplete: boolean }> => {
    if (USE_MOCK) {
      await delay(400);
      const card = mockProductionCards.find((c) => c.id === cardId);
      if (!card) {
        throw new Error('Card not found');
      }
      // Find next step
      const currentStepIndex = mockProductionSteps.findIndex((s) => s.id === card.currentStepId);
      const nextStep = mockProductionSteps[currentStepIndex + 1];
      const isOrderComplete = !nextStep;

      return {
        card: {
          ...card,
          status: isOrderComplete ? 'completed' : 'new',
          currentStepId: nextStep?.id || card.currentStepId,
          currentStep: nextStep || card.currentStep,
          currentDepartmentId: nextStep?.departmentId || card.currentDepartmentId,
          currentDepartment: nextStep?.department || card.currentDepartment,
          completedAt: isOrderComplete ? new Date().toISOString() : undefined,
          notes: notes || card.notes,
        },
        isOrderComplete,
      };
    }

    const response = await post<CompleteStepResponse>(`/production/cards/${cardId}/complete`, { notes });
    return response;
  },

  /**
   * Report a problem with a production step
   */
  reportProblem: async (cardId: string, reason: string, notes?: string): Promise<ProductionCard> => {
    if (USE_MOCK) {
      await delay(300);
      const card = mockProductionCards.find((c) => c.id === cardId);
      if (!card) {
        throw new Error('Card not found');
      }
      return {
        ...card,
        status: 'blocked',
        notes: `${reason}${notes ? ` - ${notes}` : ''}`,
      };
    }

    const response = await post<ReportProblemResponse>(`/production/cards/${cardId}/problem`, {
      reason,
      notes,
    });
    return response.card;
  },
};
