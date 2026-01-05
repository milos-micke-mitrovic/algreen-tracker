import { useState } from 'react';
import { Search, Filter } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';

import { useProductionCards, useDepartments } from '../hooks/use-production-cards';
import type { ProductionCard, ProductionCardStatus, OrderPriority } from '@/types/domain';

const statusLabels: Record<ProductionCardStatus, string> = {
  new: 'Nov',
  in_progress: 'U toku',
  paused: 'Pauziran',
  blocked: 'Blokiran',
  completed: 'Završen',
};

const statusColors: Record<ProductionCardStatus, string> = {
  new: 'bg-info/10 text-info',
  in_progress: 'bg-warning/10 text-warning',
  paused: 'bg-muted text-muted-foreground',
  blocked: 'bg-destructive/10 text-destructive',
  completed: 'bg-success/10 text-success',
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
 * Production overview page for dashboard
 * Shows all production cards with filtering
 */
export function ProductionOverviewPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProductionCardStatus | 'all'>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');

  const { data: cards, isLoading } = useProductionCards();
  const { data: departments } = useDepartments();

  // Filter cards
  const filteredCards = cards?.filter((card) => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        card.order?.orderNumber?.toLowerCase().includes(query) ||
        card.order?.customerName?.toLowerCase().includes(query) ||
        card.order?.description?.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }

    // Status filter
    if (statusFilter !== 'all' && card.status !== statusFilter) {
      return false;
    }

    // Department filter
    if (departmentFilter !== 'all' && card.currentDepartmentId !== departmentFilter) {
      return false;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Proizvodnja</h1>
        <p className="text-muted-foreground">Pregled svih naloga u proizvodnji</p>
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
              onValueChange={(v) => setStatusFilter(v as ProductionCardStatus | 'all')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Svi statusi</SelectItem>
                <SelectItem value="new">Nov</SelectItem>
                <SelectItem value="in_progress">U toku</SelectItem>
                <SelectItem value="paused">Pauziran</SelectItem>
                <SelectItem value="blocked">Blokiran</SelectItem>
                <SelectItem value="completed">Završen</SelectItem>
              </SelectContent>
            </Select>

            {/* Department filter */}
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Odeljenje" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Sva odeljenja</SelectItem>
                {departments?.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </SelectItem>
                ))}
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
          ) : filteredCards && filteredCards.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Broj naloga</TableHead>
                  <TableHead>Kupac</TableHead>
                  <TableHead>Odeljenje</TableHead>
                  <TableHead>Korak</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Prioritet</TableHead>
                  <TableHead>Rok</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCards.map((card) => (
                  <ProductionRow key={card.id} card={card} />
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

function ProductionRow({ card }: { card: ProductionCard }) {
  const isOverdue = new Date(card.deadline) < new Date() && card.status !== 'completed';

  return (
    <TableRow>
      <TableCell className="font-medium">{card.order?.orderNumber || '-'}</TableCell>
      <TableCell>{card.order?.customerName || '-'}</TableCell>
      <TableCell>{card.currentDepartment?.name || '-'}</TableCell>
      <TableCell>{card.currentStep?.name || '-'}</TableCell>
      <TableCell>
        <Badge className={statusColors[card.status]} variant="outline">
          {statusLabels[card.status]}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge className={priorityColors[card.priority]} variant="outline">
          {priorityLabels[card.priority]}
        </Badge>
      </TableCell>
      <TableCell className={cn(isOverdue && 'text-destructive font-medium')}>
        {new Date(card.deadline).toLocaleDateString('sr-Latn')}
      </TableCell>
    </TableRow>
  );
}
