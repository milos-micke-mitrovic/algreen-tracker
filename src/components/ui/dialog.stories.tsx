import type { Meta, StoryObj } from '@storybook/react';

import { Button } from './button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './dialog';
import { Input } from './input';
import { Label } from './label';

const meta: Meta<typeof Dialog> = {
  title: 'UI/Dialog',
  component: Dialog,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Otvori dijalog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Naslov dijaloga</DialogTitle>
          <DialogDescription>
            Ovo je opis dijaloga. Ovde možete dodati više informacija.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p>Sadržaj dijaloga ide ovde.</p>
        </div>
        <DialogFooter>
          <Button variant="outline">Otkaži</Button>
          <Button>Potvrdi</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const WithForm: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Izmeni profil</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Izmeni profil</DialogTitle>
          <DialogDescription>
            Unesite nove podatke za vaš profil.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Ime</Label>
            <Input id="name" defaultValue="Marko Marković" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue="marko@example.com" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline">Otkaži</Button>
          <Button>Sačuvaj</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const ConfirmationDialog: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">Obriši nalog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Da li ste sigurni?</DialogTitle>
          <DialogDescription>
            Ova akcija ne može biti poništena. Vaš nalog će biti trajno obrisan
            zajedno sa svim podacima.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline">Otkaži</Button>
          <Button variant="destructive">Obriši</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const LargeContent: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Uslovi korišćenja</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Uslovi korišćenja</DialogTitle>
          <DialogDescription>
            Molimo pročitajte pažljivo pre nego što prihvatite.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4 text-sm">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
          <p>
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
            nisi ut aliquip ex ea commodo consequat.
          </p>
          <p>
            Duis aute irure dolor in reprehenderit in voluptate velit esse
            cillum dolore eu fugiat nulla pariatur.
          </p>
          <p>
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
            officia deserunt mollit anim id est laborum.
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline">Odbij</Button>
          <Button>Prihvati</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};
