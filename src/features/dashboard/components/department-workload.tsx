import { Factory } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { useProductionCards, useDepartments } from '@/features/production/hooks/use-production-cards';

interface DepartmentStats {
  id: string;
  name: string;
  activeCards: number;
  completedToday: number;
  blockedCards: number;
  totalCapacity: number; // Assumed capacity per department
}

export function DepartmentWorkload() {
  const { data: cards } = useProductionCards();
  const { data: departments } = useDepartments();

  // Calculate stats per department
  const departmentStats: DepartmentStats[] = (departments || []).map((dept) => {
    const deptCards = cards?.filter((c) => c.currentDepartmentId === dept.id) || [];
    const activeCards = deptCards.filter((c) => c.status === 'in_progress').length;
    const blockedCards = deptCards.filter((c) => c.status === 'blocked').length;
    const completedToday = deptCards.filter((c) => {
      if (c.status !== 'completed' || !c.completedAt) return false;
      const today = new Date();
      const completedDate = new Date(c.completedAt);
      return completedDate.toDateString() === today.toDateString();
    }).length;

    return {
      id: dept.id,
      name: dept.name,
      activeCards,
      completedToday,
      blockedCards,
      totalCapacity: 10, // Assumed capacity
    };
  });

  // Sort by active cards descending
  const sortedStats = [...departmentStats].sort((a, b) => b.activeCards - a.activeCards);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Factory className="h-5 w-5" />
          Opterećenje odeljenja
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sortedStats.length === 0 ? (
          <div className="flex h-32 items-center justify-center text-muted-foreground">
            Nema podataka o odeljenjima
          </div>
        ) : (
          <div className="space-y-4">
            {sortedStats.map((dept) => (
              <DepartmentRow key={dept.id} dept={dept} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function DepartmentRow({ dept }: { dept: DepartmentStats }) {
  const utilizationPercent = Math.min(
    (dept.activeCards / dept.totalCapacity) * 100,
    100
  );

  const getUtilizationColor = () => {
    if (utilizationPercent >= 90) return 'text-destructive';
    if (utilizationPercent >= 70) return 'text-warning';
    return 'text-success';
  };

  const getProgressColor = () => {
    if (utilizationPercent >= 90) return 'bg-destructive';
    if (utilizationPercent >= 70) return 'bg-warning';
    return 'bg-success';
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-medium">{dept.name}</span>
          {dept.blockedCards > 0 && (
            <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">
              {dept.blockedCards} blokirano
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-muted-foreground">
            {dept.completedToday} završeno danas
          </span>
          <span className={cn('font-medium', getUtilizationColor())}>
            {dept.activeCards}/{dept.totalCapacity}
          </span>
        </div>
      </div>
      {/* Custom progress bar with dynamic color */}
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className={cn('h-full transition-all', getProgressColor())}
          style={{ width: `${utilizationPercent}%` }}
        />
      </div>
    </div>
  );
}
