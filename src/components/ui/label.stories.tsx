import type { Meta, StoryObj } from '@storybook/react';

import { Checkbox } from './checkbox';
import { Input } from './input';
import { Label } from './label';

const meta: Meta<typeof Label> = {
  title: 'UI/Label',
  component: Label,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Labela',
  },
};

export const WithInput: Story = {
  render: () => (
    <div className="space-y-2">
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" placeholder="vas@email.com" />
    </div>
  ),
};

export const WithCheckbox: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms">Prihvatam uslove korišćenja</Label>
    </div>
  ),
};

export const Required: Story = {
  render: () => (
    <div className="space-y-2">
      <Label htmlFor="name">
        Ime <span className="text-destructive">*</span>
      </Label>
      <Input id="name" placeholder="Unesite ime" />
    </div>
  ),
};

export const WithDescription: Story = {
  render: () => (
    <div className="space-y-2">
      <Label htmlFor="username">Korisničko ime</Label>
      <Input id="username" placeholder="korisnik123" />
      <p className="text-xs text-muted-foreground">
        Korisničko ime mora imati između 3 i 20 karaktera.
      </p>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="space-y-2">
      <Label htmlFor="disabled-input" className="opacity-70">
        Onemogućeno polje
      </Label>
      <Input id="disabled-input" placeholder="Onemogućeno" disabled />
    </div>
  ),
};

export const FormFieldExample: Story = {
  render: () => (
    <div className="space-y-4 w-64">
      <div className="space-y-2">
        <Label htmlFor="first-name">
          Ime <span className="text-destructive">*</span>
        </Label>
        <Input id="first-name" placeholder="Marko" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="last-name">
          Prezime <span className="text-destructive">*</span>
        </Label>
        <Input id="last-name" placeholder="Marković" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Telefon</Label>
        <Input id="phone" placeholder="+381 60 123 4567" />
        <p className="text-xs text-muted-foreground">Opciono polje</p>
      </div>
    </div>
  ),
};
