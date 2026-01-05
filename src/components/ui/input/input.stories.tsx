import type { Meta, StoryObj } from '@storybook/react';
import { Mail, Search } from 'lucide-react';

import { Input } from './input';

const meta: Meta<typeof Input> = {
  title: 'UI/Input/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url'],
    },
    disabled: {
      control: 'boolean',
    },
    clearable: {
      control: 'boolean',
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
    placeholder: 'Unesite tekst...',
  },
};

export const WithLabel: Story = {
  render: () => (
    <div className="space-y-2">
      <label htmlFor="email" className="text-sm font-medium">
        Email
      </label>
      <Input id="email" type="email" placeholder="vas@email.com" />
    </div>
  ),
};

export const WithStartIcon: Story = {
  args: {
    placeholder: 'Pretraži...',
    startIcon: <Search className="h-4 w-4" />,
  },
};

export const WithHelperText: Story = {
  args: {
    placeholder: 'Unesite email',
    helperText: 'Koristićemo vašu email adresu za prijavu.',
  },
};

export const WithError: Story = {
  args: {
    placeholder: 'Unesite email',
    defaultValue: 'invalid-email',
    errorText: 'Unesite validnu email adresu',
  },
};

export const Clearable: Story = {
  args: {
    placeholder: 'Pretraži...',
    defaultValue: 'Pretraga',
    clearable: true,
  },
};

export const Disabled: Story = {
  args: {
    placeholder: 'Onemogućeno',
    disabled: true,
  },
};

export const AllStates: Story = {
  render: () => (
    <div className="space-y-4">
      <Input placeholder="Default" />
      <Input placeholder="Sa ikonom" startIcon={<Mail className="h-4 w-4" />} />
      <Input placeholder="Sa pomoćnim tekstom" helperText="Ovo je pomoćni tekst" />
      <Input placeholder="Sa greškom" errorText="Ovo polje je obavezno" />
      <Input placeholder="Clearable" defaultValue="Tekst" clearable />
      <Input placeholder="Disabled" disabled />
    </div>
  ),
};
