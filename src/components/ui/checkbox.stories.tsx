import type { Meta, StoryObj } from '@storybook/react';

import { Checkbox } from './checkbox';
import { Label } from './label';

const meta: Meta<typeof Checkbox> = {
  title: 'UI/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: 'boolean',
    },
    checked: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Checked: Story = {
  args: {
    defaultChecked: true,
  },
};

export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms">Prihvatam uslove korišćenja</Label>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Checkbox id="disabled" disabled />
      <Label htmlFor="disabled" className="text-muted-foreground">
        Onemogućeno
      </Label>
    </div>
  ),
};

export const DisabledChecked: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Checkbox id="disabled-checked" disabled defaultChecked />
      <Label htmlFor="disabled-checked" className="text-muted-foreground">
        Onemogućeno i čekirano
      </Label>
    </div>
  ),
};

export const CheckboxGroup: Story = {
  render: () => (
    <div className="space-y-3">
      <p className="text-sm font-medium">Izaberite kategorije:</p>
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox id="cat-electronics" defaultChecked />
          <Label htmlFor="cat-electronics">Elektronika</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="cat-clothing" />
          <Label htmlFor="cat-clothing">Odeća</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="cat-food" />
          <Label htmlFor="cat-food">Hrana</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="cat-other" disabled />
          <Label htmlFor="cat-other" className="text-muted-foreground">
            Ostalo (nedostupno)
          </Label>
        </div>
      </div>
    </div>
  ),
};

export const WithDescription: Story = {
  render: () => (
    <div className="flex items-start space-x-2">
      <Checkbox id="newsletter" className="mt-1" />
      <div className="grid gap-1.5">
        <Label htmlFor="newsletter">Pretplata na novosti</Label>
        <p className="text-sm text-muted-foreground">
          Primajte obaveštenja o novim proizvodima i akcijama.
        </p>
      </div>
    </div>
  ),
};

export const FormExample: Story = {
  render: () => (
    <div className="space-y-4">
      <p className="text-sm font-medium">Podešavanja obaveštenja</p>
      <div className="space-y-3">
        <div className="flex items-start space-x-2">
          <Checkbox id="email-notif" defaultChecked className="mt-1" />
          <div className="grid gap-1">
            <Label htmlFor="email-notif">Email obaveštenja</Label>
            <p className="text-xs text-muted-foreground">
              Primajte obaveštenja putem emaila.
            </p>
          </div>
        </div>
        <div className="flex items-start space-x-2">
          <Checkbox id="sms-notif" className="mt-1" />
          <div className="grid gap-1">
            <Label htmlFor="sms-notif">SMS obaveštenja</Label>
            <p className="text-xs text-muted-foreground">
              Primajte hitna obaveštenja putem SMS-a.
            </p>
          </div>
        </div>
        <div className="flex items-start space-x-2">
          <Checkbox id="push-notif" defaultChecked className="mt-1" />
          <div className="grid gap-1">
            <Label htmlFor="push-notif">Push obaveštenja</Label>
            <p className="text-xs text-muted-foreground">
              Primajte push obaveštenja u aplikaciji.
            </p>
          </div>
        </div>
      </div>
    </div>
  ),
};
