import type { Meta, StoryObj } from '@storybook/react';

import { Badge } from './badge';

const meta: Meta<typeof Badge> = {
  title: 'UI/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'destructive', 'outline'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Badge',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Sekundarno',
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Greška',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Okvir',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  ),
};

export const StatusBadges: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge className="bg-success/10 text-success">Završeno</Badge>
      <Badge className="bg-warning/10 text-warning">U toku</Badge>
      <Badge className="bg-destructive/10 text-destructive">Blokirano</Badge>
      <Badge className="bg-info/10 text-info">Novo</Badge>
    </div>
  ),
};

export const PriorityBadges: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge className="bg-muted text-muted-foreground">Nizak</Badge>
      <Badge className="bg-secondary text-secondary-foreground">Normalan</Badge>
      <Badge className="bg-warning/10 text-warning">Visok</Badge>
      <Badge className="bg-destructive/10 text-destructive">Hitan</Badge>
    </div>
  ),
};
