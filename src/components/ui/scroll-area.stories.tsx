import type { Meta, StoryObj } from '@storybook/react';

import { ScrollArea, ScrollBar } from './scroll-area';

const meta: Meta<typeof ScrollArea> = {
  title: 'UI/ScrollArea',
  component: ScrollArea,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const tags = Array.from({ length: 50 }).map(
  (_, i, a) => `v1.${a.length - i}.0`
);

export const Default: Story = {
  render: function Render() {
    return (
      <ScrollArea className="h-72 w-48 rounded-md border">
        <div className="p-4">
          <h4 className="mb-4 text-sm font-medium leading-none">Verzije</h4>
          {tags.map((tag) => (
            <div key={tag}>
              <div className="text-sm">{tag}</div>
              <div className="my-2 h-px bg-border" />
            </div>
          ))}
        </div>
      </ScrollArea>
    );
  },
};

export const HorizontalScroll: Story = {
  render: function Render() {
    const items = Array.from({ length: 20 }).map((_, i) => ({
      id: i + 1,
      title: `Slika ${i + 1}`,
    }));

    return (
      <ScrollArea className="w-96 whitespace-nowrap rounded-md border">
        <div className="flex w-max space-x-4 p-4">
          {items.map((item) => (
            <figure key={item.id} className="shrink-0">
              <div className="overflow-hidden rounded-md">
                <div className="h-32 w-32 bg-muted flex items-center justify-center">
                  <span className="text-muted-foreground text-sm">{item.title}</span>
                </div>
              </div>
              <figcaption className="pt-2 text-xs text-muted-foreground">
                {item.title}
              </figcaption>
            </figure>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    );
  },
};

export const LongContent: Story = {
  render: function Render() {
    return (
      <ScrollArea className="h-[400px] w-[350px] rounded-md border p-4">
        <h4 className="mb-4 text-lg font-semibold">Uslovi korišćenja</h4>
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="mb-4">
            <h5 className="font-medium mb-2">Član {i + 1}</h5>
            <p className="text-sm text-muted-foreground">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
              ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
              aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
              pariatur.
            </p>
          </div>
        ))}
      </ScrollArea>
    );
  },
};

export const ListWithDividers: Story = {
  render: function Render() {
    const users = [
      'Marko Petrović',
      'Ana Jovanović',
      'Nikola Nikolić',
      'Jelena Đorđević',
      'Stefan Milić',
      'Milica Stojanović',
      'Luka Pavlović',
      'Sara Ilić',
      'Aleksandar Marković',
      'Teodora Popović',
      'Filip Tomić',
      'Maja Kostić',
      'Nemanja Ristić',
      'Jovana Živković',
      'Petar Stanković',
    ];

    return (
      <ScrollArea className="h-72 w-64 rounded-md border">
        <div className="p-4">
          <h4 className="mb-4 text-sm font-medium leading-none">Korisnici</h4>
          {users.map((user, index) => (
            <div key={user}>
              <div className="flex items-center py-2">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <span className="text-xs font-medium text-primary">
                    {user.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <span className="text-sm">{user}</span>
              </div>
              {index < users.length - 1 && <div className="h-px bg-border" />}
            </div>
          ))}
        </div>
      </ScrollArea>
    );
  },
};

export const BothDirections: Story = {
  render: function Render() {
    return (
      <ScrollArea className="h-72 w-72 rounded-md border">
        <div className="p-4" style={{ width: '500px' }}>
          <h4 className="mb-4 text-sm font-medium leading-none">
            Tabela sa obe trake za skrolovanje
          </h4>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="p-2 text-left">ID</th>
                <th className="p-2 text-left">Ime</th>
                <th className="p-2 text-left">Email</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Datum</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 20 }).map((_, i) => (
                <tr key={i} className="border-b">
                  <td className="p-2">{i + 1}</td>
                  <td className="p-2 whitespace-nowrap">Korisnik {i + 1}</td>
                  <td className="p-2 whitespace-nowrap">user{i + 1}@example.com</td>
                  <td className="p-2">Aktivan</td>
                  <td className="p-2 whitespace-nowrap">01.01.2025</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    );
  },
};

export const CustomHeight: Story = {
  render: function Render() {
    return (
      <div className="flex gap-4">
        <ScrollArea className="h-32 w-48 rounded-md border">
          <div className="p-4">
            <h4 className="mb-2 text-sm font-medium">Mala (128px)</h4>
            {Array.from({ length: 10 }).map((_, i) => (
              <p key={i} className="text-sm text-muted-foreground">
                Stavka {i + 1}
              </p>
            ))}
          </div>
        </ScrollArea>
        <ScrollArea className="h-64 w-48 rounded-md border">
          <div className="p-4">
            <h4 className="mb-2 text-sm font-medium">Srednja (256px)</h4>
            {Array.from({ length: 20 }).map((_, i) => (
              <p key={i} className="text-sm text-muted-foreground">
                Stavka {i + 1}
              </p>
            ))}
          </div>
        </ScrollArea>
        <ScrollArea className="h-96 w-48 rounded-md border">
          <div className="p-4">
            <h4 className="mb-2 text-sm font-medium">Velika (384px)</h4>
            {Array.from({ length: 30 }).map((_, i) => (
              <p key={i} className="text-sm text-muted-foreground">
                Stavka {i + 1}
              </p>
            ))}
          </div>
        </ScrollArea>
      </div>
    );
  },
};
