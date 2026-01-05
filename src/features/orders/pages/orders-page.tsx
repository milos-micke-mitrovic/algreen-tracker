import { useState } from 'react';
import { Search, Filter, MoreHorizontal } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';

import { useOrders } from '../hooks/use-orders';
import { CreateOrderSheet } from '../components/create-order-sheet';
import type { Order, OrderStatus, OrderPriority } from '@/types/domain';

const statusLabels: Record<OrderStatus, string> = {
  draft: 'Nacrt',
  confirmed: 'Potvrden',
  in_production: 'U proizvodnji',
  completed: 'Završen',
  cancelled: 'Otkazan',
};

const statusColors: Record<OrderStatus, string> = {
  draft: 'bg-muted text-muted-foreground',
  confirmed: 'bg-info/10 text-info',
  in_production: 'bg-warning/10 text-warning',
  completed: 'bg-success/10 text-success',
  cancelled: 'bg-destructive/10 text-destructive',
};

const priorityLabels: Record<OrderPriority, string> = {
  low: 'Nizak',
  normal: 'Normalan',
  high: 'Visok',
  urgent: 'Hitan',
};

const priorityColors: Record<OrderPriority, string> = {
  low: 'bg-muted text-muted-foreground',
  normal: 'bg-secondary text-secondary-foreground',
  high: 'bg-warning/10 text-warning',
  urgent: 'bg-destructive/10 text-destructive',
};

/**
 * Orders management page
 */
export function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<OrderPriority | 'all'>('all');

  const { data: orders, isLoading } = useOrders();

  // Filter orders
  const filteredOrders = orders?.filter((order) => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        order.orderNumber?.toLowerCase().includes(query) ||
        order.customerName?.toLowerCase().includes(query) ||
        order.description?.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }

    // Status filter
    if (statusFilter !== 'all' && order.status !== statusFilter) {
      return false;
    }

    // Priority filter
    if (priorityFilter !== 'all' && order.priority !== priorityFilter) {
      return false;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Nalozi</h1>
          <p className="text-muted-foreground">Upravljanje narudžbinama i nalozima</p>
        </div>
        <CreateOrderSheet />
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filteri
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {/* Search */}
            <Input
              placeholder="Pretraži..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              startIcon={<Search className="h-4 w-4" />}
            />

            {/* Status filter */}
            <Select
              value={statusFilter}
              onValueChange={(v) => setStatusFilter(v as OrderStatus | 'all')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Svi statusi</SelectItem>
                <SelectItem value="draft">Nacrt</SelectItem>
                <SelectItem value="confirmed">Potvrden</SelectItem>
                <SelectItem value="in_production">U proizvodnji</SelectItem>
                <SelectItem value="completed">Završen</SelectItem>
                <SelectItem value="cancelled">Otkazan</SelectItem>
              </SelectContent>
            </Select>

            {/* Priority filter */}
            <Select
              value={priorityFilter}
              onValueChange={(v) => setPriorityFilter(v as OrderPriority | 'all')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Prioritet" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Svi prioriteti</SelectItem>
                <SelectItem value="low">Nizak</SelectItem>
                <SelectItem value="normal">Normalan</SelectItem>
                <SelectItem value="high">Visok</SelectItem>
                <SelectItem value="urgent">Hitan</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <Spinner size="lg" />
            </div>
          ) : filteredOrders && filteredOrders.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Broj naloga</TableHead>
                  <TableHead>Kupac</TableHead>
                  <TableHead>Opis</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Prioritet</TableHead>
                  <TableHead>Rok</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <OrderRow key={order.id} order={order} />
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex h-64 items-center justify-center text-muted-foreground">
              Nema naloga za prikaz
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function OrderRow({ order }: { order: Order }) {
  const isOverdue =
    new Date(order.deadline) < new Date() &&
    order.status !== 'completed' &&
    order.status !== 'cancelled';

  return (
    <TableRow>
      <TableCell className="font-medium">{order.orderNumber}</TableCell>
      <TableCell>{order.customerName}</TableCell>
      <TableCell className="max-w-xs truncate">{order.description || '-'}</TableCell>
      <TableCell>
        <Badge className={statusColors[order.status]} variant="outline">
          {statusLabels[order.status]}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge className={priorityColors[order.priority]} variant="outline">
          {priorityLabels[order.priority]}
        </Badge>
      </TableCell>
      <TableCell className={cn(isOverdue && 'text-destructive font-medium')}>
        {new Date(order.deadline).toLocaleDateString('sr-Latn')}
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Pregledaj</DropdownMenuItem>
            <DropdownMenuItem>Izmeni</DropdownMenuItem>
            {order.status === 'confirmed' && (
              <DropdownMenuItem>Pokreni proizvodnju</DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">Otkaži</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
