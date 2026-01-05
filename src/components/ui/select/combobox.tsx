import * as React from 'react';
import { Check, ChevronsUpDown, X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export interface ComboboxOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface ComboboxBaseProps {
  options: ComboboxOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  helperText?: string;
  errorText?: string;
  disabled?: boolean;
  className?: string;
}

interface SingleComboboxProps extends ComboboxBaseProps {
  multiple?: false;
  value?: string;
  onValueChange?: (value: string) => void;
  maxDisplay?: never;
}

interface MultiComboboxProps extends ComboboxBaseProps {
  multiple: true;
  value?: string[];
  onValueChange?: (value: string[]) => void;
  maxDisplay?: number;
}

export type ComboboxProps = SingleComboboxProps | MultiComboboxProps;

function Combobox(props: ComboboxProps) {
  const {
    options,
    placeholder = 'Izaberite...',
    searchPlaceholder = 'Pretraži...',
    emptyMessage = 'Nema rezultata.',
    helperText,
    errorText,
    disabled,
    className,
    multiple,
  } = props;

  const [open, setOpen] = React.useState(false);
  const hasError = !!errorText;

  // Single select handlers
  const singleValue = !multiple ? (props.value as string | undefined) : undefined;
  const singleOnChange = !multiple ? (props.onValueChange as ((value: string) => void) | undefined) : undefined;

  // Multi select handlers
  const multiValue = multiple ? (props.value as string[] | undefined) ?? [] : [];
  const multiOnChange = multiple ? (props.onValueChange as ((value: string[]) => void) | undefined) : undefined;
  const maxDisplay = multiple ? (props.maxDisplay ?? 3) : 3;

  const selectedOptions = multiple
    ? options.filter((option) => multiValue.includes(option.value))
    : [];

  const selectedOption = !multiple
    ? options.find((option) => option.value === singleValue)
    : undefined;

  const handleSingleSelect = (optionValue: string) => {
    singleOnChange?.(optionValue === singleValue ? '' : optionValue);
    setOpen(false);
  };

  const handleMultiSelect = (optionValue: string) => {
    const newValue = multiValue.includes(optionValue)
      ? multiValue.filter((v) => v !== optionValue)
      : [...multiValue, optionValue];
    multiOnChange?.(newValue);
  };

  const handleRemove = (optionValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    multiOnChange?.(multiValue.filter((v) => v !== optionValue));
  };

  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    multiOnChange?.([]);
  };

  // Render trigger content
  const renderTriggerContent = () => {
    if (multiple) {
      if (selectedOptions.length === 0) {
        return <span className="text-muted-foreground">{placeholder}</span>;
      }

      if (selectedOptions.length <= maxDisplay) {
        return (
          <div className="flex flex-wrap gap-1 flex-1">
            {selectedOptions.map((option) => (
              <Badge
                key={option.value}
                variant="secondary"
                className="mr-1 mb-0.5 mt-0.5"
              >
                {option.label}
                <button
                  type="button"
                  className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onClick={(e) => handleRemove(option.value, e)}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        );
      }

      return (
        <Badge variant="secondary" className="mr-1">
          {selectedOptions.length} izabrano
        </Badge>
      );
    }

    return selectedOption ? (
      selectedOption.label
    ) : (
      <span className="text-muted-foreground">{placeholder}</span>
    );
  };

  return (
    <div className={cn('w-full', className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn(
              'w-full justify-between font-normal',
              multiple && 'min-h-10 h-auto',
              hasError && 'border-destructive focus:border-destructive'
            )}
          >
            <div className={cn('flex flex-1', multiple && 'flex-wrap gap-1')}>
              {renderTriggerContent()}
            </div>
            <div className="flex items-center gap-1 shrink-0 ml-2">
              {multiple && multiValue.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <ChevronsUpDown className="h-4 w-4 opacity-50" />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
          <Command>
            <CommandInput placeholder={searchPlaceholder} />
            <CommandList>
              <CommandEmpty>{emptyMessage}</CommandEmpty>
              <CommandGroup>
                {options.map((option) => {
                  const isSelected = multiple
                    ? multiValue.includes(option.value)
                    : singleValue === option.value;

                  return (
                    <CommandItem
                      key={option.value}
                      value={option.label}
                      disabled={option.disabled}
                      onSelect={() =>
                        multiple
                          ? handleMultiSelect(option.value)
                          : handleSingleSelect(option.value)
                      }
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          isSelected ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                      {option.label}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {(helperText || errorText) && (
        <p
          className={cn(
            'mt-1.5 text-xs',
            hasError ? 'text-destructive' : 'text-muted-foreground'
          )}
        >
          {errorText || helperText}
        </p>
      )}
    </div>
  );
}

export { Combobox };
