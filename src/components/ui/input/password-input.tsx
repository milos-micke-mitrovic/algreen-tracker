import * as React from 'react';
import { Eye, EyeOff } from 'lucide-react';

import { cn } from '@/lib/utils';

export interface PasswordInputProps extends Omit<React.ComponentProps<'input'>, 'type'> {
  startIcon?: React.ReactNode;
  helperText?: string;
  errorText?: string;
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, startIcon, helperText, errorText, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const hasError = !!errorText;

    return (
      <div className="w-full">
        <div className="relative">
          {startIcon && (
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {startIcon}
            </div>
          )}
          <input
            type={showPassword ? 'text' : 'password'}
            className={cn(
              'flex h-10 w-full rounded-md border bg-background px-3 py-2 pr-10 text-base placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
              startIcon != null && 'pl-10',
              hasError ? 'border-destructive focus-visible:border-destructive' : 'border-input',
              className
            )}
            ref={ref}
            {...props}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
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
PasswordInput.displayName = 'PasswordInput';

export { PasswordInput };
