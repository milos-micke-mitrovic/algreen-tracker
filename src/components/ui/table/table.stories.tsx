import type { Meta, StoryObj } from '@storybook/react';

import { Badge } from '../badge';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from './table';

const meta: Meta<typeof Table> = {
  title: 'UI/Table/Table',
  component: Table,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const invoices = [
  { id: 'INV001', status: 'Plaćeno', method: 'Kartica', amount: '12,500.00 RSD' },
  { id: 'INV002', status: 'Na čekanju', method: 'Virman', amount: '8,750.00 RSD' },
  { id: 'INV003', status: 'Plaćeno', method: 'Gotovina', amount: '3,200.00 RSD' },
  { id: 'INV004', status: 'Otkazano', method: 'Kartica', amount: '5,600.00 RSD' },
  { id: 'INV005', status: 'Plaćeno', method: 'Kartica', amount: '15,800.00 RSD' },
];

export const Default: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Faktura</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Način plaćanja</TableHead>
          <TableHead className="text-right">Iznos</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.id}>
            <TableCell className="font-medium">{invoice.id}</TableCell>
            <TableCell>{invoice.status}</TableCell>
            <TableCell>{invoice.method}</TableCell>
            <TableCell className="text-right">{invoice.amount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

export const WithCaption: Story = {
  render: () => (
    <Table>
      <TableCaption>Lista poslednjih faktura</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Faktura</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Način plaćanja</TableHead>
          <TableHead className="text-right">Iznos</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.id}>
            <TableCell className="font-medium">{invoice.id}</TableCell>
            <TableCell>{invoice.status}</TableCell>
            <TableCell>{invoice.method}</TableCell>
            <TableCell className="text-right">{invoice.amount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

export const WithFooter: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Faktura</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Način plaćanja</TableHead>
          <TableHead className="text-right">Iznos</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.id}>
            <TableCell className="font-medium">{invoice.id}</TableCell>
            <TableCell>{invoice.status}</TableCell>
            <TableCell>{invoice.method}</TableCell>
            <TableCell className="text-right">{invoice.amount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Ukupno</TableCell>
          <TableCell className="text-right font-bold">45,850.00 RSD</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
};

const users = [
  { id: 1, name: 'Marko Marković', email: 'marko@example.com', role: 'admin', status: 'active' },
  { id: 2, name: 'Jovan Petrović', email: 'jovan@example.com', role: 'manager', status: 'active' },
  { id: 3, name: 'Ana Nikolić', email: 'ana@example.com', role: 'worker', status: 'inactive' },
  { id: 4, name: 'Petar Ilić', email: 'petar@example.com', role: 'worker', status: 'active' },
];

export const UsersTable: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Ime</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Uloga</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="font-medium">{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>
              <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                {user.role === 'admin' ? 'Administrator' : user.role === 'manager' ? 'Menadžer' : 'Radnik'}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge
                className={
                  user.status === 'active'
                    ? 'bg-success/10 text-success'
                    : 'bg-muted text-muted-foreground'
                }
              >
                {user.status === 'active' ? 'Aktivan' : 'Neaktivan'}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

const orders = [
  { id: 'ORD-001', customer: 'Kompanija A', product: 'Aluminijumski profil', quantity: 100, status: 'completed' },
  { id: 'ORD-002', customer: 'Kompanija B', product: 'Aluminijumski lim', quantity: 50, status: 'in_progress' },
  { id: 'ORD-003', customer: 'Kompanija C', product: 'Aluminijumska cev', quantity: 75, status: 'pending' },
  { id: 'ORD-004', customer: 'Kompanija D', product: 'Aluminijumski profil', quantity: 200, status: 'delayed' },
];

export const OrdersTable: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Narudžbina</TableHead>
          <TableHead>Kupac</TableHead>
          <TableHead>Proizvod</TableHead>
          <TableHead className="text-right">Količina</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell className="font-medium">{order.id}</TableCell>
            <TableCell>{order.customer}</TableCell>
            <TableCell>{order.product}</TableCell>
            <TableCell className="text-right">{order.quantity}</TableCell>
            <TableCell>
              <Badge
                className={
                  order.status === 'completed'
                    ? 'bg-success/10 text-success'
                    : order.status === 'in_progress'
                    ? 'bg-info/10 text-info'
                    : order.status === 'pending'
                    ? 'bg-warning/10 text-warning'
                    : 'bg-destructive/10 text-destructive'
                }
              >
                {order.status === 'completed'
                  ? 'Završeno'
                  : order.status === 'in_progress'
                  ? 'U toku'
                  : order.status === 'pending'
                  ? 'Na čekanju'
                  : 'Kasni'}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

export const EmptyTable: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Faktura</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Iznos</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell colSpan={3} className="h-24 text-center">
            <p className="text-muted-foreground">Nema podataka za prikaz.</p>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};
