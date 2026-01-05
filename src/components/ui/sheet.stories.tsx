import type { Meta, StoryObj } from '@storybook/react';

import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './sheet';

const meta: Meta<typeof Sheet> = {
  title: 'UI/Sheet',
  component: Sheet,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Otvori sheet</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Naslov sheeta</SheetTitle>
          <SheetDescription>
            Ovo je opis sheeta. Ovde možete dodati više informacija.
          </SheetDescription>
        </SheetHeader>
        <div className="py-4">
          <p>Sadržaj sheeta ide ovde.</p>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Zatvori</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

export const RightSide: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Desna strana</Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Dodaj korisnika</SheetTitle>
          <SheetDescription>
            Unesite podatke novog korisnika.
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Ime</Label>
            <Input id="name" placeholder="Unesite ime" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="email@example.com" />
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Otkaži</Button>
          </SheetClose>
          <Button>Sačuvaj</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

export const LeftSide: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Leva strana</Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Navigacija</SheetTitle>
          <SheetDescription>
            Izaberite opciju iz menija.
          </SheetDescription>
        </SheetHeader>
        <nav className="flex flex-col gap-2 py-4">
          <Button variant="ghost" className="justify-start">
            Početna
          </Button>
          <Button variant="ghost" className="justify-start">
            Proizvodi
          </Button>
          <Button variant="ghost" className="justify-start">
            Narudžbine
          </Button>
          <Button variant="ghost" className="justify-start">
            Podešavanja
          </Button>
        </nav>
      </SheetContent>
    </Sheet>
  ),
};

export const TopSide: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Gornja strana</Button>
      </SheetTrigger>
      <SheetContent side="top">
        <SheetHeader>
          <SheetTitle>Obaveštenje</SheetTitle>
          <SheetDescription>
            Imate nova obaveštenja.
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  ),
};

export const BottomSide: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Donja strana</Button>
      </SheetTrigger>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>Podešavanja</SheetTitle>
          <SheetDescription>
            Izaberite opcije koje želite da primenite.
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  ),
};

export const WithForm: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Kreiraj narudžbinu</Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>Nova narudžbina</SheetTitle>
          <SheetDescription>
            Popunite formu za kreiranje nove narudžbine.
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="customer">Kupac</Label>
            <Input id="customer" placeholder="Ime kupca" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="product">Proizvod</Label>
            <Input id="product" placeholder="Naziv proizvoda" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="quantity">Količina</Label>
            <Input id="quantity" type="number" placeholder="0" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Napomena</Label>
            <textarea
              id="notes"
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="Dodatne napomene..."
            />
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Otkaži</Button>
          </SheetClose>
          <Button>Kreiraj</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};
