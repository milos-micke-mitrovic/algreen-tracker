import type { Meta, StoryObj } from '@storybook/react';

import { Textarea } from './textarea';

const meta: Meta<typeof Textarea> = {
  title: 'UI/Textarea',
  component: Textarea,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
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
      <label htmlFor="description" className="text-sm font-medium">
        Opis
      </label>
      <Textarea id="description" placeholder="Unesite opis..." />
    </div>
  ),
};

export const WithHelperText: Story = {
  args: {
    placeholder: 'Unesite napomenu...',
    helperText: 'Maksimalno 500 karaktera.',
  },
};

export const WithError: Story = {
  args: {
    placeholder: 'Unesite opis',
    defaultValue: 'Kratak tekst',
    errorText: 'Opis mora imati najmanje 50 karaktera.',
  },
};

export const Clearable: Story = {
  args: {
    placeholder: 'Unesite tekst...',
    defaultValue: 'Ovo je tekst koji može biti obrisan.',
    clearable: true,
  },
};

export const Disabled: Story = {
  args: {
    placeholder: 'Onemogućeno',
    disabled: true,
  },
};

export const CustomRows: Story = {
  render: () => (
    <div className="space-y-4">
      <Textarea placeholder="3 reda (podrazumevano)" rows={3} />
      <Textarea placeholder="5 redova" rows={5} />
      <Textarea placeholder="10 redova" rows={10} />
    </div>
  ),
};

export const AllStates: Story = {
  render: () => (
    <div className="space-y-4">
      <Textarea placeholder="Podrazumevano" />
      <Textarea placeholder="Sa pomoćnim tekstom" helperText="Ovo je pomoćni tekst" />
      <Textarea placeholder="Sa greškom" errorText="Ovo polje je obavezno" />
      <Textarea placeholder="Clearable" defaultValue="Tekst za brisanje" clearable />
      <Textarea placeholder="Onemogućeno" disabled />
    </div>
  ),
};

export const FormExample: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="problem" className="text-sm font-medium">
          Opis problema
        </label>
        <Textarea
          id="problem"
          placeholder="Opišite problem detaljno..."
          helperText="Molimo navedite sve relevantne informacije."
          rows={5}
        />
      </div>
    </div>
  ),
};
