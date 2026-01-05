import type { Meta, StoryObj } from '@storybook/react';

import { Label } from './label';
import { Switch } from './switch';

const meta: Meta<typeof Switch> = {
  title: 'UI/Switch',
  component: Switch,
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
      <Switch id="airplane-mode" />
      <Label htmlFor="airplane-mode">Avionski režim</Label>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Switch id="disabled" disabled />
      <Label htmlFor="disabled" className="text-muted-foreground">
        Onemogućeno
      </Label>
    </div>
  ),
};

export const DisabledChecked: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Switch id="disabled-checked" disabled defaultChecked />
      <Label htmlFor="disabled-checked" className="text-muted-foreground">
        Onemogućeno i uključeno
      </Label>
    </div>
  ),
};

export const WithDescription: Story = {
  render: () => (
    <div className="flex items-start space-x-4">
      <Switch id="notifications" defaultChecked />
      <div className="grid gap-1">
        <Label htmlFor="notifications">Obaveštenja</Label>
        <p className="text-sm text-muted-foreground">
          Primajte obaveštenja o novim narudžbinama.
        </p>
      </div>
    </div>
  ),
};

export const SettingsList: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="dark-mode">Tamni režim</Label>
          <p className="text-xs text-muted-foreground">
            Koristi tamnu temu aplikacije
          </p>
        </div>
        <Switch id="dark-mode" />
      </div>
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="email-notif">Email obaveštenja</Label>
          <p className="text-xs text-muted-foreground">
            Primaj obaveštenja na email
          </p>
        </div>
        <Switch id="email-notif" defaultChecked />
      </div>
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="push-notif">Push obaveštenja</Label>
          <p className="text-xs text-muted-foreground">
            Primaj push obaveštenja
          </p>
        </div>
        <Switch id="push-notif" defaultChecked />
      </div>
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="marketing" className="text-muted-foreground">
            Marketing poruke
          </Label>
          <p className="text-xs text-muted-foreground">
            Primaj promotivne poruke
          </p>
        </div>
        <Switch id="marketing" disabled />
      </div>
    </div>
  ),
};

export const FormRow: Story = {
  render: () => (
    <div className="rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <div>
          <Label htmlFor="active-status" className="text-base">
            Aktivan status
          </Label>
          <p className="text-sm text-muted-foreground">
            Korisnik može da se prijavi u sistem
          </p>
        </div>
        <Switch id="active-status" defaultChecked />
      </div>
    </div>
  ),
};

export const AllStates: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Switch id="off" />
        <Label htmlFor="off">Isključeno</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Switch id="on" defaultChecked />
        <Label htmlFor="on">Uključeno</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Switch id="disabled-off" disabled />
        <Label htmlFor="disabled-off" className="text-muted-foreground">
          Onemogućeno (isključeno)
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <Switch id="disabled-on" disabled defaultChecked />
        <Label htmlFor="disabled-on" className="text-muted-foreground">
          Onemogućeno (uključeno)
        </Label>
      </div>
    </div>
  ),
};
