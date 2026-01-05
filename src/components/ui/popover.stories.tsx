import type { Meta, StoryObj } from '@storybook/react';
import { Settings } from 'lucide-react';

import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

const meta: Meta<typeof Popover> = {
  title: 'UI/Popover',
  component: Popover,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Otvori popover</Button>
      </PopoverTrigger>
      <PopoverContent>
        <p className="text-sm">Ovo je sadržaj popover-a.</p>
      </PopoverContent>
    </Popover>
  ),
};

export const WithForm: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Dimenzije</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Dimenzije</h4>
            <p className="text-sm text-muted-foreground">
              Podesite dimenzije komponente.
            </p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="width">Širina</Label>
              <Input id="width" defaultValue="100%" className="col-span-2 h-8" />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="maxWidth">Max širina</Label>
              <Input id="maxWidth" defaultValue="300px" className="col-span-2 h-8" />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="height">Visina</Label>
              <Input id="height" defaultValue="auto" className="col-span-2 h-8" />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

export const WithSettings: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Podešavanja</h4>
            <p className="text-sm text-muted-foreground">
              Podesite opcije prikaza.
            </p>
          </div>
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="compact">Kompaktan prikaz</Label>
              <input type="checkbox" id="compact" className="h-4 w-4" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="animations">Animacije</Label>
              <input type="checkbox" id="animations" className="h-4 w-4" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="sounds">Zvukovi</Label>
              <input type="checkbox" id="sounds" className="h-4 w-4" />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

export const Positions: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm">Gore</Button>
        </PopoverTrigger>
        <PopoverContent side="top" className="w-auto">
          <p className="text-sm">Popover iznad</p>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm">Dole</Button>
        </PopoverTrigger>
        <PopoverContent side="bottom" className="w-auto">
          <p className="text-sm">Popover ispod</p>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm">Levo</Button>
        </PopoverTrigger>
        <PopoverContent side="left" className="w-auto">
          <p className="text-sm">Popover levo</p>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm">Desno</Button>
        </PopoverTrigger>
        <PopoverContent side="right" className="w-auto">
          <p className="text-sm">Popover desno</p>
        </PopoverContent>
      </Popover>
    </div>
  ),
};

export const SharePopover: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button>Podeli</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Podeli link</h4>
            <p className="text-sm text-muted-foreground">
              Kopirajte link i podelite ga sa drugima.
            </p>
          </div>
          <div className="flex gap-2">
            <Input
              readOnly
              defaultValue="https://example.com/share/abc123"
              className="flex-1"
            />
            <Button size="sm">Kopiraj</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

export const FilterPopover: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Filteri</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Filteri</h4>
            <p className="text-sm text-muted-foreground">
              Filtrirajte rezultate po kriterijumima.
            </p>
          </div>
          <div className="grid gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Svi</option>
                <option value="active">Aktivni</option>
                <option value="pending">Na čekanju</option>
                <option value="completed">Završeni</option>
              </select>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="date">Datum</Label>
              <Input type="date" id="date" />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm">
              Resetuj
            </Button>
            <Button size="sm">Primeni</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
};
