import type { Meta, StoryObj } from '@storybook/react';
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from './alert';

const meta: Meta<typeof Alert> = {
  title: 'UI/Alert',
  component: Alert,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'success', 'warning', 'info'],
    },
  },
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
    <Alert>
      <AlertTitle>Obaveštenje</AlertTitle>
      <AlertDescription>
        Ovo je podrazumevano obaveštenje.
      </AlertDescription>
    </Alert>
  ),
};

export const Destructive: Story = {
  render: () => (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Greška</AlertTitle>
      <AlertDescription>
        Došlo je do greške prilikom obrade zahteva.
      </AlertDescription>
    </Alert>
  ),
};

export const Success: Story = {
  render: () => (
    <Alert variant="success">
      <CheckCircle className="h-4 w-4" />
      <AlertTitle>Uspešno</AlertTitle>
      <AlertDescription>
        Vaše promene su uspešno sačuvane.
      </AlertDescription>
    </Alert>
  ),
};

export const Warning: Story = {
  render: () => (
    <Alert variant="warning">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Upozorenje</AlertTitle>
      <AlertDescription>
        Ova akcija ne može biti poništena.
      </AlertDescription>
    </Alert>
  ),
};

export const InfoVariant: Story = {
  render: () => (
    <Alert variant="info">
      <Info className="h-4 w-4" />
      <AlertTitle>Informacija</AlertTitle>
      <AlertDescription>
        Nova verzija aplikacije je dostupna.
      </AlertDescription>
    </Alert>
  ),
};

export const WithoutTitle: Story = {
  render: () => (
    <Alert variant="info">
      <Info className="h-4 w-4" />
      <AlertDescription>
        Samo opis bez naslova.
      </AlertDescription>
    </Alert>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <Alert>
        <AlertTitle>Podrazumevano</AlertTitle>
        <AlertDescription>Podrazumevana varijanta obaveštenja.</AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Greška</AlertTitle>
        <AlertDescription>Destruktivna varijanta za greške.</AlertDescription>
      </Alert>
      <Alert variant="success">
        <CheckCircle className="h-4 w-4" />
        <AlertTitle>Uspeh</AlertTitle>
        <AlertDescription>Varijanta za uspešne akcije.</AlertDescription>
      </Alert>
      <Alert variant="warning">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Upozorenje</AlertTitle>
        <AlertDescription>Varijanta za upozorenja.</AlertDescription>
      </Alert>
      <Alert variant="info">
        <Info className="h-4 w-4" />
        <AlertTitle>Info</AlertTitle>
        <AlertDescription>Informativna varijanta.</AlertDescription>
      </Alert>
    </div>
  ),
};
