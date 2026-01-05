import { formatDistanceToNow } from 'date-fns';
import { sr } from 'date-fns/locale';
import { AlertTriangle, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { useProductionCards } from '@/features/production/hooks/use-production-cards';
import type { ProductionCard, OrderPriority } from '@/types/domain';

const priorityColors: Record<OrderPriority, string> = {
  low: 'bg-muted text-muted-foreground',
  normal: 'bg-secondary text-secondary-foreground',
  high: 'bg-warning/10 text-warning',
  urgent: 'bg-destructive/10 text-destructive',
};

const priorityLabels: Record<OrderPriority, string> = {
  low: 'Nizak',
  normal: 'Normalan',
  high: 'Visok',
  urgent: 'Hitan',
};

export function DelayedOrders() {
  const { data: cards, isLoading } = useProductionCards();

  // Filter delayed cards
  const delayedCards = cards?.filter(
    (card) => new Date(card.deadline) < new Date() && card.status !== 'completed'
  ) || [];

  // Sort by priority (urgent first) then by deadline
  const sortedCards = [...delayedCards].sort((a, b) => {
    const priorityOrder = { urgent: 0, high: 1, normal: 2, low: 3 };
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (priorityDiff !== 0) return priorityDiff;
    return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          Probijeni rokovi
          {delayedCards.length > 0 && (
            <Badge variant="destructive" className="ml-2">
              {delayedCards.length}
            </Badge>
          )}
        </CardTitle>
        {delayedCards.length > 3 && (
          <Button variant="ghost" size="sm" asChild>
            <Link to="/dashboard/production?filter=delayed">
              Vidi sve
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex h-32 items-center justify-center text-muted-foreground">
            Učitavanje...
          </div>
        ) : sortedCards.length === 0 ? (
          <div className="flex h-32 flex-col items-center justify-center text-center">
            <Clock className="h-8 w-8 text-success mb-2" />
            <p className="text-sm text-muted-foreground">
              Svi nalozi su u roku!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedCards.slice(0, 5).map((card) => (
              <DelayedOrderRow key={card.id} card={card} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function DelayedOrderRow({ card }: { card: ProductionCard }) {
  const deadlineDate = new Date(card.deadline);
  const now = new Date();
  const daysOverdue = Math.floor(
    (now.getTime() - deadlineDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="flex items-center justify-between rounded-lg border border-destructive/20 bg-destructive/5 p-3">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium truncate">{card.order?.orderNumber || 'N/A'}</span>
          <Badge className={priorityColors[card.priority]} variant="outline">
            {priorityLabels[card.priority]}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground truncate mt-0.5">
          {card.currentDepartment?.name} • {card.currentStep?.name}
        </p>
      </div>
      <div className="text-right shrink-0 ml-4">
        <p className="text-sm font-medium text-destructive">
          {daysOverdue === 0 ? 'Danas' : daysOverdue === 1 ? '1 dan' : `${daysOverdue} dana`}
        </p>
        <p className="text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(card.deadline), { addSuffix: true, locale: sr })}
        </p>
      </div>
    </div>
  );
}
