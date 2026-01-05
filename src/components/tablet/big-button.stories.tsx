import type { Meta, StoryObj } from '@storybook/react';
import { Play, Pause, CheckCircle, AlertTriangle, Settings } from 'lucide-react';

import { BigButton } from './big-button';

const meta: Meta<typeof BigButton> = {
  title: 'Tablet/BigButton',
  component: BigButton,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'light',
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'start', 'pause', 'complete', 'problem'],
    },
    loading: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    icon: <Settings className="h-10 w-10" />,
    label: 'Podešavanja',
    variant: 'default',
  },
};

export const Start: Story = {
  args: {
    icon: <Play className="h-10 w-10" />,
    label: 'Pokreni',
    variant: 'start',
  },
};

export const PauseVariant: Story = {
  args: {
    icon: <Pause className="h-10 w-10" />,
    label: 'Pauziraj',
    variant: 'pause',
  },
};

export const Complete: Story = {
  args: {
    icon: <CheckCircle className="h-10 w-10" />,
    label: 'Završi',
    variant: 'complete',
  },
};

export const Problem: Story = {
  args: {
    icon: <AlertTriangle className="h-10 w-10" />,
    label: 'Prijavi problem',
    variant: 'problem',
  },
};

export const Loading: Story = {
  args: {
    icon: <Play className="h-10 w-10" />,
    label: 'Pokreni',
    variant: 'start',
    loading: true,
  },
};

export const Disabled: Story = {
  args: {
    icon: <Play className="h-10 w-10" />,
    label: 'Pokreni',
    variant: 'start',
    disabled: true,
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <BigButton
        icon={<Play className="h-10 w-10" />}
        label="Pokreni"
        variant="start"
      />
      <BigButton
        icon={<Pause className="h-10 w-10" />}
        label="Pauziraj"
        variant="pause"
      />
      <BigButton
        icon={<CheckCircle className="h-10 w-10" />}
        label="Završi"
        variant="complete"
      />
      <BigButton
        icon={<AlertTriangle className="h-10 w-10" />}
        label="Problem"
        variant="problem"
      />
      <BigButton
        icon={<Settings className="h-10 w-10" />}
        label="Podešavanja"
        variant="default"
      />
    </div>
  ),
};

export const TabletActionBar: Story = {
  render: () => (
    <div className="flex gap-4 p-4 bg-muted rounded-2xl">
      <BigButton
        icon={<Play className="h-10 w-10" />}
        label="Pokreni korak"
        variant="start"
      />
      <BigButton
        icon={<Pause className="h-10 w-10" />}
        label="Pauziraj"
        variant="pause"
      />
      <BigButton
        icon={<CheckCircle className="h-10 w-10" />}
        label="Završi korak"
        variant="complete"
      />
      <BigButton
        icon={<AlertTriangle className="h-10 w-10" />}
        label="Prijavi problem"
        variant="problem"
      />
    </div>
  ),
};

export const LoadingStates: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <BigButton
        icon={<Play className="h-10 w-10" />}
        label="Pokreni"
        variant="start"
        loading
      />
      <BigButton
        icon={<CheckCircle className="h-10 w-10" />}
        label="Završi"
        variant="complete"
        loading
      />
    </div>
  ),
};

export const DisabledStates: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <BigButton
        icon={<Play className="h-10 w-10" />}
        label="Pokreni"
        variant="start"
        disabled
      />
      <BigButton
        icon={<Pause className="h-10 w-10" />}
        label="Pauziraj"
        variant="pause"
        disabled
      />
      <BigButton
        icon={<CheckCircle className="h-10 w-10" />}
        label="Završi"
        variant="complete"
        disabled
      />
    </div>
  ),
};
