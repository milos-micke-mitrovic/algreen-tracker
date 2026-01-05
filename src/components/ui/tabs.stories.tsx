import type { Meta, StoryObj } from '@storybook/react';

import { Button } from './button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card';
import { Input } from './input';
import { Label } from './label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';

const meta: Meta<typeof Tabs> = {
  title: 'UI/Tabs',
  component: Tabs,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-[400px]">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="tab1">
      <TabsList>
        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        <TabsTrigger value="tab3">Tab 3</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">
        <p className="text-sm text-muted-foreground">Sadržaj prvog taba.</p>
      </TabsContent>
      <TabsContent value="tab2">
        <p className="text-sm text-muted-foreground">Sadržaj drugog taba.</p>
      </TabsContent>
      <TabsContent value="tab3">
        <p className="text-sm text-muted-foreground">Sadržaj trećeg taba.</p>
      </TabsContent>
    </Tabs>
  ),
};

export const AccountSettings: Story = {
  render: () => (
    <Tabs defaultValue="account">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="account">Nalog</TabsTrigger>
        <TabsTrigger value="password">Lozinka</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <Card>
          <CardHeader>
            <CardTitle>Nalog</CardTitle>
            <CardDescription>
              Izmenite podatke vašeg naloga.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Ime</Label>
              <Input id="name" defaultValue="Marko Marković" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Korisničko ime</Label>
              <Input id="username" defaultValue="@marko" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Sačuvaj promene</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="password">
        <Card>
          <CardHeader>
            <CardTitle>Lozinka</CardTitle>
            <CardDescription>
              Promenite lozinku za pristup nalogu.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current">Trenutna lozinka</Label>
              <Input id="current" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new">Nova lozinka</Label>
              <Input id="new" type="password" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Promeni lozinku</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  ),
};

export const ProductTabs: Story = {
  render: () => (
    <Tabs defaultValue="description">
      <TabsList>
        <TabsTrigger value="description">Opis</TabsTrigger>
        <TabsTrigger value="specs">Specifikacije</TabsTrigger>
        <TabsTrigger value="reviews">Recenzije</TabsTrigger>
      </TabsList>
      <TabsContent value="description" className="pt-4">
        <p className="text-sm">
          Ovo je detaljan opis proizvoda. Ovde se nalaze sve informacije
          o karakteristikama i prednostima proizvoda.
        </p>
      </TabsContent>
      <TabsContent value="specs" className="pt-4">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between border-b pb-2">
            <span className="text-muted-foreground">Dimenzije</span>
            <span>100 x 50 x 25 cm</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="text-muted-foreground">Težina</span>
            <span>2.5 kg</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Materijal</span>
            <span>Aluminijum</span>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="reviews" className="pt-4">
        <p className="text-sm text-muted-foreground">
          Još uvek nema recenzija za ovaj proizvod.
        </p>
      </TabsContent>
    </Tabs>
  ),
};

export const DisabledTab: Story = {
  render: () => (
    <Tabs defaultValue="active">
      <TabsList>
        <TabsTrigger value="active">Aktivan</TabsTrigger>
        <TabsTrigger value="pending">Na čekanju</TabsTrigger>
        <TabsTrigger value="disabled" disabled>
          Onemogućen
        </TabsTrigger>
      </TabsList>
      <TabsContent value="active">
        <p className="text-sm text-muted-foreground">Aktivni sadržaj.</p>
      </TabsContent>
      <TabsContent value="pending">
        <p className="text-sm text-muted-foreground">Sadržaj na čekanju.</p>
      </TabsContent>
    </Tabs>
  ),
};

export const FullWidth: Story = {
  render: () => (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="w-full">
        <TabsTrigger value="all" className="flex-1">
          Sve
        </TabsTrigger>
        <TabsTrigger value="active" className="flex-1">
          Aktivne
        </TabsTrigger>
        <TabsTrigger value="completed" className="flex-1">
          Završene
        </TabsTrigger>
        <TabsTrigger value="cancelled" className="flex-1">
          Otkazane
        </TabsTrigger>
      </TabsList>
      <TabsContent value="all" className="pt-4">
        <p className="text-sm text-muted-foreground">Prikazane su sve narudžbine.</p>
      </TabsContent>
      <TabsContent value="active" className="pt-4">
        <p className="text-sm text-muted-foreground">Prikazane su aktivne narudžbine.</p>
      </TabsContent>
      <TabsContent value="completed" className="pt-4">
        <p className="text-sm text-muted-foreground">Prikazane su završene narudžbine.</p>
      </TabsContent>
      <TabsContent value="cancelled" className="pt-4">
        <p className="text-sm text-muted-foreground">Prikazane su otkazane narudžbine.</p>
      </TabsContent>
    </Tabs>
  ),
};
