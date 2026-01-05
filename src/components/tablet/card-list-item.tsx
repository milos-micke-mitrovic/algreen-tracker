import { Clock, AlertTriangle, ChevronRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { sr } from 'date-fns/locale';

import { cn } from '@/lib/utils';
import { haptics } from '@/lib/haptics';
import { sounds } from '@/lib/sounds';
import type { ProductionCard, ProductionCardStatus, OrderPriority } from '@/types/domain';

const statusColors: Record<ProductionCardStatus, string> = {
  new: 'bg-info/10 text-info border-info/20',
  in_progress: 'bg-warning/10 text-warning border-warning/20',
  paused: 'bg-muted text-muted-foreground border-muted',
  blocked: 'bg-destructive/10 text-destructive border-destructive/20',
  completed: 'bg-success/10 text-success border-success/20',
};

const statusLabels: Record<ProductionCardStatus, string> = {
  new: 'Nov',
  in_progress: 'U toku',
  paused: 'Pauziran',
  blocked: 'Blokiran',
  completed: 'Završen',
};

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

interface CardListItemProps {
  card: ProductionCard;
  onClick?: () => void;
  selected?: boolean;
}

/**
 * Touch-friendly production card list item for tablets
 * Includes haptic and sound feedback
 */
export function CardListItem({ card, onClick, selected }: CardListItemProps) {
  const isOverdue = new Date(card.deadline) < new Date() && card.status !== 'completed';
  const deadlineText = formatDistanceToNow(new Date(card.deadline), {
    addSuffix: true,
    locale: sr,
  });

  const handleClick = () => {
    haptics.tap();
    sounds.tap();
    onClick?.();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        'group flex w-full items-center gap-4 rounded-2xl border-2 p-5 text-left',
        'shadow-sm',
        'transition-all duration-200 ease-out',
        'transform-gpu',
        'hover:shadow-md hover:scale-[1.01]',
        'active:scale-[0.99] active:shadow-sm',
        'touch-manipulation',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        selected
          ? 'border-primary bg-primary/5 shadow-primary/20'
          : 'border-border bg-card hover:border-primary/30',
        // Pulse animation for blocked items
        card.status === 'blocked' && 'animate-pulse-subtle',
        statusColors[card.status]
      )}
    >
      {/* Status indicator */}
      <div
        className={cn(
          'flex h-14 w-14 shrink-0 items-center justify-center rounded-lg text-2xl font-bold',
          statusColors[card.status]
        )}
      >
        {card.order?.orderNumber?.slice(-3) || '???'}
      </div>

      {/* Card info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="truncate text-lg font-semibold">
            {card.order?.customerName || 'Nepoznat kupac'}
          </h3>
          {card.status === 'blocked' && (
            <AlertTriangle className="h-5 w-5 shrink-0 text-destructive" />
          )}
        </div>

        <p className="truncate text-sm text-muted-foreground">
          {card.order?.description || 'Bez opisa'}
        </p>

        <div className="mt-2 flex items-center gap-3">
          {/* Priority badge */}
          <span
            className={cn(
              'rounded-full px-2 py-0.5 text-xs font-medium',
              priorityColors[card.priority]
            )}
          >
            {priorityLabels[card.priority]}
          </span>

          {/* Status badge */}
          <span className="text-xs font-medium">{statusLabels[card.status]}</span>

          {/* Deadline */}
          <span
            className={cn(
              'flex items-center gap-1 text-xs',
              isOverdue ? 'text-destructive font-medium' : 'text-muted-foreground'
            )}
          >
            <Clock className="h-3 w-3" />
            {deadlineText}
          </span>
        </div>
      </div>

      {/* Arrow with animation */}
      <ChevronRight className="h-6 w-6 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:translate-x-1" />
    </button>
  );
}
