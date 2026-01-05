import type { Meta, StoryObj } from '@storybook/react';
import { KeyRound, Lock } from 'lucide-react';

import { Label } from '../label';
import { PasswordInput } from './password-input';

const meta: Meta<typeof PasswordInput> = {
  title: 'UI/Input/PasswordInput',
  component: PasswordInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    disabled: {
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
    placeholder: 'Unesite lozinku',
  },
};

export const WithLabel: Story = {
  render: () => (
    <div className="space-y-2">
      <Label htmlFor="password">Lozinka</Label>
      <PasswordInput id="password" placeholder="Unesite lozinku" />
    </div>
  ),
};

export const WithStartIcon: Story = {
  args: {
    placeholder: 'Unesite lozinku',
    startIcon: <KeyRound className="h-4 w-4" />,
  },
};

export const WithLockIcon: Story = {
  args: {
    placeholder: 'Unesite lozinku',
    startIcon: <Lock className="h-4 w-4" />,
  },
};

export const WithHelperText: Story = {
  args: {
    placeholder: 'Unesite lozinku',
    startIcon: <KeyRound className="h-4 w-4" />,
    helperText: 'Lozinka mora imati najmanje 8 karaktera.',
  },
};

export const WithError: Story = {
  args: {
    placeholder: 'Unesite lozinku',
    startIcon: <KeyRound className="h-4 w-4" />,
    defaultValue: '123',
    errorText: 'Lozinka mora imati najmanje 8 karaktera.',
  },
};

export const Disabled: Story = {
  args: {
    placeholder: 'Onemogućeno',
    disabled: true,
  },
};

export const LoginForm: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="login-password">
          Lozinka <span className="text-destructive">*</span>
        </Label>
        <PasswordInput
          id="login-password"
          placeholder="Unesite lozinku"
          startIcon={<KeyRound className="h-4 w-4" />}
        />
      </div>
    </div>
  ),
};

export const ChangePassword: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="current-password">Trenutna lozinka</Label>
        <PasswordInput
          id="current-password"
          placeholder="Unesite trenutnu lozinku"
          startIcon={<Lock className="h-4 w-4" />}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="new-password">Nova lozinka</Label>
        <PasswordInput
          id="new-password"
          placeholder="Unesite novu lozinku"
          startIcon={<KeyRound className="h-4 w-4" />}
          helperText="Lozinka mora imati najmanje 8 karaktera, jedno veliko slovo i jedan broj."
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirm-password">Potvrdite lozinku</Label>
        <PasswordInput
          id="confirm-password"
          placeholder="Ponovite novu lozinku"
          startIcon={<KeyRound className="h-4 w-4" />}
        />
      </div>
    </div>
  ),
};

export const AllStates: Story = {
  render: () => (
    <div className="space-y-4">
      <PasswordInput placeholder="Podrazumevano" />
      <PasswordInput
        placeholder="Sa ikonom"
        startIcon={<KeyRound className="h-4 w-4" />}
      />
      <PasswordInput
        placeholder="Sa pomoćnim tekstom"
        startIcon={<KeyRound className="h-4 w-4" />}
        helperText="Ovo je pomoćni tekst"
      />
      <PasswordInput
        placeholder="Sa greškom"
        startIcon={<KeyRound className="h-4 w-4" />}
        errorText="Ovo polje je obavezno"
      />
      <PasswordInput placeholder="Onemogućeno" disabled />
    </div>
  ),
};
