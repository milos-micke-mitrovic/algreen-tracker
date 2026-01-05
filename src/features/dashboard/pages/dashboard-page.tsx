import {
  Package,
  Factory,
  Clock,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
} from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { useProductionCards } from '@/features/production/hooks/use-production-cards';
import { RecentActivity } from '../components/recent-activity';
import { DelayedOrders } from '../components/delayed-orders';
import { DepartmentWorkload } from '../components/department-workload';

/**
 * Main dashboard page with stats overview
 */
export function DashboardPage() {
  const { data: cards, isLoading } = useProductionCards();

  // Calculate stats
  const stats = {
    total: cards?.length ?? 0,
    inProgress: cards?.filter((c) => c.status === 'in_progress').length ?? 0,
    blocked: cards?.filter((c) => c.status === 'blocked').length ?? 0,
    completed: cards?.filter((c) => c.status === 'completed').length ?? 0,
    new: cards?.filter((c) => c.status === 'new').length ?? 0,
  };

  const overdue =
    cards?.filter(
      (c) => new Date(c.deadline) < new Date() && c.status !== 'completed'
    ).length ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Pregled</h1>
        <p className="text-muted-foreground">
          Dobrodošli nazad. Evo pregleda današnje proizvodnje.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Ukupno naloga"
          value={stats.total}
          icon={<Package className="h-5 w-5" />}
          loading={isLoading}
        />
        <StatsCard
          title="U toku"
          value={stats.inProgress}
          icon={<Factory className="h-5 w-5" />}
          loading={isLoading}
          variant="warning"
        />
        <StatsCard
          title="Blokirano"
          value={stats.blocked}
          icon={<AlertTriangle className="h-5 w-5" />}
          loading={isLoading}
          variant="destructive"
        />
        <StatsCard
          title="Završeno"
          value={stats.completed}
          icon={<CheckCircle className="h-5 w-5" />}
          loading={isLoading}
          variant="success"
        />
      </div>

      {/* Secondary stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          title="Novi nalozi"
          value={stats.new}
          description="Čekaju na početak"
          icon={<Clock className="h-5 w-5" />}
          loading={isLoading}
        />
        <StatsCard
          title="Probijeni rokovi"
          value={overdue}
          description="Zahtevaju pažnju"
          icon={<AlertTriangle className="h-5 w-5" />}
          loading={isLoading}
          variant={overdue > 0 ? 'destructive' : 'default'}
        />
        <StatsCard
          title="Efikasnost"
          value="--"
          description="Dolazi uskoro"
          icon={<TrendingUp className="h-5 w-5" />}
          loading={isLoading}
        />
      </div>

      {/* Widgets row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <DelayedOrders />
        <DepartmentWorkload />
      </div>

      {/* Recent activity */}
      <RecentActivity />
    </div>
  );
}

/**
 * Stats card component
 */
function StatsCard({
  title,
  value,
  description,
  icon,
  loading,
  variant = 'default',
}: {
  title: string;
  value: number | string;
  description?: string;
  icon: React.ReactNode;
  loading?: boolean;
  variant?: 'default' | 'success' | 'warning' | 'destructive';
}) {
  const iconColors = {
    default: 'text-muted-foreground',
    success: 'text-success',
    warning: 'text-warning',
    destructive: 'text-destructive',
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="mt-1 text-3xl font-bold">
              {loading ? '...' : value}
            </p>
            {description && (
              <p className="mt-1 text-xs text-muted-foreground">{description}</p>
            )}
          </div>
          <div className={iconColors[variant]}>{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}
