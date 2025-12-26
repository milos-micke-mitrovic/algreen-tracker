import * as React from 'react';
import { format, setHours, setMinutes } from 'date-fns';
import { srLatn } from 'date-fns/locale';
import { CalendarIcon, Clock } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from './calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';

export interface DateTimePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
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

function DateTimePicker({
  value,
  onChange,
  placeholder = 'Izaberite datum i vreme',
  disabled,
  helperText,
  errorText,
  className,
  minuteStep = 15,
}: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false);
  const hasError = !!errorText;
  const timeOptions = React.useMemo(() => generateTimeOptions(minuteStep), [minuteStep]);

  const selectedTime = value
    ? `${value.getHours().toString().padStart(2, '0')}:${value.getMinutes().toString().padStart(2, '0')}`
    : undefined;

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) {
      onChange?.(undefined);
      return;
    }

    // Keep the current time if we have a value, otherwise set to current time
    if (value) {
      date = setHours(date, value.getHours());
      date = setMinutes(date, value.getMinutes());
    }
    onChange?.(date);
  };

  const handleTimeSelect = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    let newDate = value || new Date();
    newDate = setHours(newDate, hours);
    newDate = setMinutes(newDate, minutes);
    onChange?.(newDate);
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
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? format(value, 'PPP HH:mm', { locale: srLatn }) : placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="flex">
            <Calendar
              mode="single"
              selected={value}
              onSelect={handleDateSelect}
              initialFocus
            />
            <div className="w-20 border-l">
              <div className="flex items-center gap-2 border-b px-2 py-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Vreme</span>
              </div>
              <ScrollArea className="h-[300px]">
                <div className="p-1">
                  {timeOptions.map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? 'default' : 'ghost'}
                      size="sm"
                      className="w-full justify-center font-normal"
                      onClick={() => handleTimeSelect(time)}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
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

export { DateTimePicker };
