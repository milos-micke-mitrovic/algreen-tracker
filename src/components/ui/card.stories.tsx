import type { Meta, StoryObj } from '@storybook/react';

import { Button } from './button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './card';

const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Naslov kartice</CardTitle>
        <CardDescription>Opis kartice ide ovde.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Sadržaj kartice.</p>
      </CardContent>
    </Card>
  ),
};

export const WithFooter: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Narudžbina #1234</CardTitle>
        <CardDescription>Kreirana: 15. januar 2025.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Ova narudžbina sadrži 5 stavki i čeka na obradu.
        </p>
      </CardContent>
      <CardFooter className="justify-between">
        <Button variant="outline">Otkaži</Button>
        <Button>Obradi</Button>
      </CardFooter>
    </Card>
  ),
};

export const SimpleCard: Story = {
  render: () => (
    <Card>
      <CardContent className="pt-6">
        <p>Jednostavna kartica samo sa sadržajem.</p>
      </CardContent>
    </Card>
  ),
};

export const StatsCard: Story = {
  render: () => (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>Ukupna prodaja</CardDescription>
        <CardTitle className="text-4xl">45,231 RSD</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground">
          +20.1% u odnosu na prošli mesec
        </p>
      </CardContent>
    </Card>
  ),
};

export const FormCard: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Prijava</CardTitle>
        <CardDescription>
          Unesite svoje podatke za pristup sistemu.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Email</label>
          <input
            type="email"
            placeholder="vas@email.com"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Lozinka</label>
          <input
            type="password"
            placeholder="********"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Prijavi se</Button>
      </CardFooter>
    </Card>
  ),
};
