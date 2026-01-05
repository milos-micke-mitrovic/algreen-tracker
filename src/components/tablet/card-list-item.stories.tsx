import type { Meta, StoryObj } from '@storybook/react';
import { addDays, subDays } from 'date-fns';

import { CardListItem } from './card-list-item';
import type { ProductionCard } from '@/types/domain';

const meta: Meta<typeof CardListItem> = {
  title: 'Tablet/CardListItem',
  component: CardListItem,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="max-w-xl">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

const baseCard: ProductionCard = {
  id: '1',
  tenantId: 'tenant-1',
  orderId: 'order-1',
  currentStepId: 'step-1',
  currentDepartmentId: 'dept-1',
  status: 'new',
  priority: 'normal',
  deadline: addDays(new Date(), 3).toISOString(),
  history: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  order: {
    id: 'order-1',
    tenantId: 'tenant-1',
    orderNumber: 'ORD-001',
    customerName: 'Kompanija ABC d.o.o.',
    description: 'Aluminijumski profil 40x40mm - 100 komada',
    status: 'in_production',
    priority: 'normal',
    deadline: addDays(new Date(), 3).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
};

export const New: Story = {
  args: {
    card: {
      ...baseCard,
      status: 'new',
    },
  },
};

export const InProgress: Story = {
  args: {
    card: {
      ...baseCard,
      status: 'in_progress',
      order: {
        ...baseCard.order!,
        orderNumber: 'ORD-002',
        customerName: 'Metal Trade d.o.o.',
        description: 'Aluminijumska cev 50mm - 50 komada',
      },
    },
  },
};

export const Paused: Story = {
  args: {
    card: {
      ...baseCard,
      status: 'paused',
      order: {
        ...baseCard.order!,
        orderNumber: 'ORD-003',
        customerName: 'Gradnja Plus',
        description: 'Aluminijumski lim 2mm - 20 tabli',
      },
    },
  },
};

export const Blocked: Story = {
  args: {
    card: {
      ...baseCard,
      status: 'blocked',
      priority: 'urgent',
      order: {
        ...baseCard.order!,
        orderNumber: 'ORD-004',
        customerName: 'Hitno gradnja d.o.o.',
        description: 'Specijalni profil - čeka materijal',
        priority: 'urgent',
      },
    },
  },
};

export const Completed: Story = {
  args: {
    card: {
      ...baseCard,
      status: 'completed',
      order: {
        ...baseCard.order!,
        orderNumber: 'ORD-005',
        customerName: 'Završena firma',
        description: 'Standardni profil - isporučeno',
        status: 'completed',
      },
    },
  },
};

export const Overdue: Story = {
  args: {
    card: {
      ...baseCard,
      status: 'in_progress',
      deadline: subDays(new Date(), 2).toISOString(),
      order: {
        ...baseCard.order!,
        orderNumber: 'ORD-006',
        customerName: 'Kasni narudžba d.o.o.',
        description: 'Hitna narudžbina - kasni 2 dana',
        deadline: subDays(new Date(), 2).toISOString(),
      },
    },
  },
};

export const Selected: Story = {
  args: {
    card: {
      ...baseCard,
      status: 'in_progress',
    },
    selected: true,
  },
};

export const HighPriority: Story = {
  args: {
    card: {
      ...baseCard,
      status: 'new',
      priority: 'high',
      order: {
        ...baseCard.order!,
        orderNumber: 'ORD-007',
        customerName: 'Važan klijent',
        description: 'Prioritetna narudžbina',
        priority: 'high',
      },
    },
  },
};

export const UrgentPriority: Story = {
  args: {
    card: {
      ...baseCard,
      status: 'new',
      priority: 'urgent',
      order: {
        ...baseCard.order!,
        orderNumber: 'ORD-008',
        customerName: 'HITNO - VIP Klijent',
        description: 'Hitna isporuka do kraja dana',
        priority: 'urgent',
      },
    },
  },
};

export const LowPriority: Story = {
  args: {
    card: {
      ...baseCard,
      status: 'new',
      priority: 'low',
      order: {
        ...baseCard.order!,
        orderNumber: 'ORD-009',
        customerName: 'Nije hitno d.o.o.',
        description: 'Standardna narudžbina - bez žurbe',
        priority: 'low',
      },
    },
  },
};

export const AllStatuses: Story = {
  render: () => (
    <div className="space-y-3">
      <CardListItem
        card={{
          ...baseCard,
          status: 'new',
          order: {
            ...baseCard.order!,
            orderNumber: 'ORD-101',
            customerName: 'Nova narudžbina',
            description: 'Status: Nov',
          },
        }}
      />
      <CardListItem
        card={{
          ...baseCard,
          status: 'in_progress',
          order: {
            ...baseCard.order!,
            orderNumber: 'ORD-102',
            customerName: 'U obradi',
            description: 'Status: U toku',
          },
        }}
      />
      <CardListItem
        card={{
          ...baseCard,
          status: 'paused',
          order: {
            ...baseCard.order!,
            orderNumber: 'ORD-103',
            customerName: 'Pauzirana',
            description: 'Status: Pauziran',
          },
        }}
      />
      <CardListItem
        card={{
          ...baseCard,
          status: 'blocked',
          priority: 'urgent',
          order: {
            ...baseCard.order!,
            orderNumber: 'ORD-104',
            customerName: 'Blokirana',
            description: 'Status: Blokiran',
            priority: 'urgent',
          },
        }}
      />
      <CardListItem
        card={{
          ...baseCard,
          status: 'completed',
          order: {
            ...baseCard.order!,
            orderNumber: 'ORD-105',
            customerName: 'Završena',
            description: 'Status: Završen',
            status: 'completed',
          },
        }}
      />
    </div>
  ),
};

export const AllPriorities: Story = {
  render: () => (
    <div className="space-y-3">
      <CardListItem
        card={{
          ...baseCard,
          priority: 'low',
          order: {
            ...baseCard.order!,
            orderNumber: 'ORD-201',
            customerName: 'Nizak prioritet',
            description: 'Prioritet: Nizak',
            priority: 'low',
          },
        }}
      />
      <CardListItem
        card={{
          ...baseCard,
          priority: 'normal',
          order: {
            ...baseCard.order!,
            orderNumber: 'ORD-202',
            customerName: 'Normalan prioritet',
            description: 'Prioritet: Normalan',
            priority: 'normal',
          },
        }}
      />
      <CardListItem
        card={{
          ...baseCard,
          priority: 'high',
          order: {
            ...baseCard.order!,
            orderNumber: 'ORD-203',
            customerName: 'Visok prioritet',
            description: 'Prioritet: Visok',
            priority: 'high',
          },
        }}
      />
      <CardListItem
        card={{
          ...baseCard,
          priority: 'urgent',
          order: {
            ...baseCard.order!,
            orderNumber: 'ORD-204',
            customerName: 'Hitan prioritet',
            description: 'Prioritet: Hitan',
            priority: 'urgent',
          },
        }}
      />
    </div>
  ),
};
