import * as React from 'react';
import { X } from 'lucide-react';

import { cn } from '@/lib/utils';

export interface TextareaProps extends React.ComponentProps<'textarea'> {
  helperText?: string;
  errorText?: string;
  clearable?: boolean;
  onClear?: () => void;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, helperText, errorText, clearable, onClear, value, defaultValue, onChange, ...props }, ref) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue ?? '');
    const isControlled = value !== undefined;
    const currentValue = isControlled ? value : internalValue;
    const hasError = !!errorText;

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
          <textarea
            className={cn(
              'flex min-h-[80px] w-full rounded-md border bg-background px-3 py-2 text-base placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
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
              className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
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
Textarea.displayName = 'Textarea';

export { Textarea };
