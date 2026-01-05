import * as React from 'react';

import { cn } from '@/lib/utils';
import { Spinner } from '@/components/ui/spinner';
import { haptics } from '@/lib/haptics';
import { sounds } from '@/lib/sounds';

type BigButtonVariant = 'start' | 'pause' | 'complete' | 'problem' | 'default';

const variantStyles: Record<BigButtonVariant, string> = {
  start: 'bg-success text-success-foreground hover:bg-success/90 active:bg-success/80 shadow-success/25',
  pause: 'bg-warning text-warning-foreground hover:bg-warning/90 active:bg-warning/80 shadow-warning/25',
  complete: 'bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80 shadow-primary/25',
  problem: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 active:bg-destructive/80 shadow-destructive/25',
  default: 'bg-secondary text-secondary-foreground hover:bg-secondary/90 active:bg-secondary/80 shadow-secondary/25',
};

interface BigButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label: string;
  variant?: BigButtonVariant;
  loading?: boolean;
}

/**
 * Large touch-friendly button for tablet actions
 * Min 120x120px for easy tapping with fingers
 * Includes haptic and sound feedback
 */
export function BigButton({
  icon,
  label,
  variant = 'default',
  loading = false,
  disabled,
  className,
  onClick,
  ...props
}: BigButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Trigger haptic and sound feedback
    haptics.tap();
    sounds.tap();

    // Call original onClick if provided
    onClick?.(e);
  };

  return (
    <button
      type="button"
      disabled={disabled || loading}
      onClick={handleClick}
      className={cn(
        'relative flex flex-col items-center justify-center gap-3',
        'min-h-[140px] min-w-[140px] rounded-2xl p-6',
        'text-lg font-semibold',
        'shadow-lg',
        'transition-all duration-200 ease-out',
        'transform-gpu',
        'active:scale-[0.97] active:shadow-md',
        'hover:scale-[1.02] hover:shadow-xl',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 disabled:hover:scale-100',
        'select-none touch-manipulation',
        // Add a subtle ring on focus for accessibility
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      <div className="relative flex h-10 w-10 items-center justify-center">
        <span
          className={cn(
            'text-4xl transition-transform duration-200',
            loading && 'opacity-0'
          )}
        >
          {icon}
        </span>
        {loading && (
          <span className="absolute inset-0 flex items-center justify-center">
            <Spinner size="lg" className="text-current" />
          </span>
        )}
      </div>
      <span className="text-center leading-tight">{label}</span>
    </button>
  );
}
