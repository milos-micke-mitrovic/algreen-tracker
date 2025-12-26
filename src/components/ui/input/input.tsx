import * as React from 'react';
import { X } from 'lucide-react';

import { cn } from '@/lib/utils';

export interface InputProps extends React.ComponentProps<'input'> {
  startIcon?: React.ReactNode;
  helperText?: string;
  errorText?: string;
  clearable?: boolean;
  onClear?: () => void;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, startIcon, helperText, errorText, clearable, onClear, value, defaultValue, onChange, ...props }, ref) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue ?? '');
    const isControlled = value !== undefined;
    const currentValue = isControlled ? value : internalValue;
    const hasError = !!errorText;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) {
        setInternalValue(e.target.value);
      }
      onChange?.(e);
    };

    const handleClear = () => {
      if (!isControlled) {
        setInternalValue('');
      }
      onClear?.();
    };

    const showClearButton = clearable && currentValue && String(currentValue).length > 0;

    return (
      <div className="w-full">
        <div className="relative">
          {startIcon && (
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {startIcon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              'flex h-10 w-full rounded-md border bg-background px-3 py-2 text-base placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
              startIcon && 'pl-10',
              showClearButton && 'pr-10',
              hasError ? 'border-destructive focus-visible:border-destructive' : 'border-input',
              className
            )}
            ref={ref}
            value={currentValue}
            onChange={handleChange}
            {...props}
          />
          {showClearButton && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        {(helperText || errorText) && (
          <p className={cn('mt-1.5 text-xs', hasError ? 'text-destructive' : 'text-muted-foreground')}>
            {errorText || helperText}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };
