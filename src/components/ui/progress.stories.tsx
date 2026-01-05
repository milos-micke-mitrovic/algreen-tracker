import type { Meta, StoryObj } from '@storybook/react';

import { Progress } from './progress';

const meta: Meta<typeof Progress> = {
  title: 'UI/Progress',
  component: Progress,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 100 },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 60,
  },
};

export const Empty: Story = {
  args: {
    value: 0,
  },
};

export const Partial: Story = {
  args: {
    value: 33,
  },
};

export const AlmostComplete: Story = {
  args: {
    value: 90,
  },
};

export const Complete: Story = {
  args: {
    value: 100,
  },
};

export const WithLabel: Story = {
  render: () => (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>Napredak</span>
        <span className="text-muted-foreground">60%</span>
      </div>
      <Progress value={60} />
    </div>
  ),
};

export const UploadProgress: Story = {
  render: () => (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>Učitavanje fajla...</span>
        <span className="text-muted-foreground">45%</span>
      </div>
      <Progress value={45} />
      <p className="text-xs text-muted-foreground">2.3 MB od 5.1 MB</p>
    </div>
  ),
};

export const TaskProgress: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Zadatak 1</span>
          <span className="text-muted-foreground">Završeno</span>
        </div>
        <Progress value={100} />
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Zadatak 2</span>
          <span className="text-muted-foreground">U toku</span>
        </div>
        <Progress value={65} />
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Zadatak 3</span>
          <span className="text-muted-foreground">Na čekanju</span>
        </div>
        <Progress value={0} />
      </div>
    </div>
  ),
};

export const StepsProgress: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex justify-between text-sm">
        <span>Korak 2 od 4</span>
        <span className="text-muted-foreground">50%</span>
      </div>
      <Progress value={50} />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Podaci</span>
        <span>Potvrda</span>
        <span>Plaćanje</span>
        <span>Završeno</span>
      </div>
    </div>
  ),
};

export const ColoredProgress: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <span className="text-sm">Podrazumevana</span>
        <Progress value={60} />
      </div>
      <div className="space-y-2">
        <span className="text-sm">Uspešna</span>
        <Progress value={100} className="[&>div]:bg-success" />
      </div>
      <div className="space-y-2">
        <span className="text-sm">Upozorenje</span>
        <Progress value={75} className="[&>div]:bg-warning" />
      </div>
      <div className="space-y-2">
        <span className="text-sm">Greška</span>
        <Progress value={25} className="[&>div]:bg-destructive" />
      </div>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <span className="text-sm">Mala (h-2)</span>
        <Progress value={60} className="h-2" />
      </div>
      <div className="space-y-2">
        <span className="text-sm">Podrazumevana (h-4)</span>
        <Progress value={60} />
      </div>
      <div className="space-y-2">
        <span className="text-sm">Velika (h-6)</span>
        <Progress value={60} className="h-6" />
      </div>
    </div>
  ),
};
