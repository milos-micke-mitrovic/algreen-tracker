import * as React from 'react';
import { Clock } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';

export interface TimePickerProps {
  value?: string; // Format: "HH:mm"
  onChange?: (time: string | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  helperText?: string;
  errorText?: string;
  className?: string;
  minuteStep?: number;
}

function generateTimeOptions(minuteStep: number = 15): string[] {
  const options: string[] = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += minuteStep) {
      const h = hour.toString().padStart(2, '0');
      const m = minute.toString().padStart(2, '0');
      options.push(`${h}:${m}`);
    }
  }
  return options;
}

function TimePicker({
  value,
  onChange,
  placeholder = 'Izaberite vreme',
  disabled,
  helperText,
  errorText,
  className,
  minuteStep = 15,
}: TimePickerProps) {
  const [open, setOpen] = React.useState(false);
  const hasError = !!errorText;
  const timeOptions = React.useMemo(() => generateTimeOptions(minuteStep), [minuteStep]);

  const handleSelect = (time: string) => {
    onChange?.(time);
    setOpen(false);
  };

  return (
    <div className={cn('w-full', className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={disabled}
            className={cn(
              'w-full justify-start text-left font-normal',
              !value && 'text-muted-foreground',
              hasError && 'border-destructive focus:border-destructive'
            )}
          >
            <Clock className="mr-2 h-4 w-4" />
            {value || placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-24 p-0" align="start">
          <ScrollArea className="h-60">
            <div className="p-1">
              {timeOptions.map((time) => (
                <Button
                  key={time}
                  variant={value === time ? 'default' : 'ghost'}
                  size="sm"
                  className="w-full justify-center font-normal"
                  onClick={() => handleSelect(time)}
                >
                  {time}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </PopoverContent>
      </Popover>
      {(helperText || errorText) && (
        <p className={cn('mt-1.5 text-xs', hasError ? 'text-destructive' : 'text-muted-foreground')}>
          {errorText || helperText}
        </p>
      )}
    </div>
  );
}

export { TimePicker };
