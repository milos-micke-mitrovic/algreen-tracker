import type { Meta, StoryObj } from '@storybook/react';
import { Mail, ArrowRight } from 'lucide-react';

import { Button } from './button';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
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
    children: 'Dugme',
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
    children: 'Obriši',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Okvir',
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost',
  },
};

export const Link: Story = {
  args: {
    variant: 'link',
    children: 'Link dugme',
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Malo',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Veliko',
  },
};

export const WithStartIcon: Story = {
  args: {
    children: 'Pošalji email',
    startIcon: <Mail className="h-4 w-4" />,
  },
};

export const WithEndIcon: Story = {
  args: {
    children: 'Nastavi',
    endIcon: <ArrowRight className="h-4 w-4" />,
  },
};

export const Loading: Story = {
  args: {
    children: 'Sačuvaj',
    loading: true,
  },
};

export const Disabled: Story = {
  args: {
    children: 'Onemogućeno',
    disabled: true,
  },
};

export const IconOnly: Story = {
  args: {
    size: 'icon',
    children: <Mail className="h-4 w-4" />,
    'aria-label': 'Pošalji email',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button>Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
      <Button size="icon"><Mail className="h-4 w-4" /></Button>
    </div>
  ),
};
