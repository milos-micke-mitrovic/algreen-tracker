import type { Meta, StoryObj } from '@storybook/react';

import { Label } from './label';
import { RadioGroup, RadioGroupItem } from './radio-group';

const meta: Meta<typeof RadioGroup> = {
  title: 'UI/RadioGroup',
  component: RadioGroup,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <RadioGroup defaultValue="option1">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option1" id="option1" />
        <Label htmlFor="option1">Opcija 1</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option2" id="option2" />
        <Label htmlFor="option2">Opcija 2</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option3" id="option3" />
        <Label htmlFor="option3">Opcija 3</Label>
      </div>
    </RadioGroup>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <RadioGroup defaultValue="option1" className="flex gap-4">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option1" id="h-option1" />
        <Label htmlFor="h-option1">Da</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option2" id="h-option2" />
        <Label htmlFor="h-option2">Ne</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option3" id="h-option3" />
        <Label htmlFor="h-option3">Možda</Label>
      </div>
    </RadioGroup>
  ),
};

export const WithDisabled: Story = {
  render: () => (
    <RadioGroup defaultValue="basic">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="free" id="free" />
        <Label htmlFor="free">Besplatan plan</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="basic" id="basic" />
        <Label htmlFor="basic">Osnovni plan</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="pro" id="pro" disabled />
        <Label htmlFor="pro" className="text-muted-foreground">
          Pro plan (uskoro)
        </Label>
      </div>
    </RadioGroup>
  ),
};

export const WithDescriptions: Story = {
  render: () => (
    <RadioGroup defaultValue="standard">
      <div className="flex items-start space-x-2">
        <RadioGroupItem value="standard" id="shipping-standard" className="mt-1" />
        <div className="grid gap-1">
          <Label htmlFor="shipping-standard">Standardna dostava</Label>
          <p className="text-sm text-muted-foreground">3-5 radnih dana</p>
        </div>
      </div>
      <div className="flex items-start space-x-2">
        <RadioGroupItem value="express" id="shipping-express" className="mt-1" />
        <div className="grid gap-1">
          <Label htmlFor="shipping-express">Ekspres dostava</Label>
          <p className="text-sm text-muted-foreground">1-2 radna dana</p>
        </div>
      </div>
      <div className="flex items-start space-x-2">
        <RadioGroupItem value="overnight" id="shipping-overnight" className="mt-1" />
        <div className="grid gap-1">
          <Label htmlFor="shipping-overnight">Dostava sledeći dan</Label>
          <p className="text-sm text-muted-foreground">Garantovana dostava sutra</p>
        </div>
      </div>
    </RadioGroup>
  ),
};

export const UserRoles: Story = {
  render: () => (
    <div className="space-y-3">
      <Label>Uloga korisnika</Label>
      <RadioGroup defaultValue="worker">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="admin" id="role-admin" />
          <Label htmlFor="role-admin">Administrator</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="manager" id="role-manager" />
          <Label htmlFor="role-manager">Menadžer</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="worker" id="role-worker" />
          <Label htmlFor="role-worker">Radnik</Label>
        </div>
      </RadioGroup>
    </div>
  ),
};

export const PaymentMethod: Story = {
  render: () => (
    <div className="space-y-3">
      <Label>Način plaćanja</Label>
      <RadioGroup defaultValue="card">
        <div className="flex items-start space-x-2">
          <RadioGroupItem value="card" id="pay-card" className="mt-1" />
          <div className="grid gap-1">
            <Label htmlFor="pay-card">Kartica</Label>
            <p className="text-xs text-muted-foreground">Visa, Mastercard, Maestro</p>
          </div>
        </div>
        <div className="flex items-start space-x-2">
          <RadioGroupItem value="cash" id="pay-cash" className="mt-1" />
          <div className="grid gap-1">
            <Label htmlFor="pay-cash">Gotovina</Label>
            <p className="text-xs text-muted-foreground">Plaćanje pri preuzimanju</p>
          </div>
        </div>
        <div className="flex items-start space-x-2">
          <RadioGroupItem value="transfer" id="pay-transfer" className="mt-1" />
          <div className="grid gap-1">
            <Label htmlFor="pay-transfer">Virman</Label>
            <p className="text-xs text-muted-foreground">Plaćanje pre isporuke</p>
          </div>
        </div>
      </RadioGroup>
    </div>
  ),
};
