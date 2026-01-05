import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CalendarIcon, Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { sr } from 'date-fns/locale';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/date-picker/calendar';
import { useCreateOrder } from '../hooks/use-orders';
import type { OrderPriority } from '@/types/domain';

const orderSchema = z.object({
  customerName: z.string().min(1, 'Ime kupca je obavezno'),
  customerPhone: z.string().optional(),
  customerEmail: z.string().email('Neispravan email').optional().or(z.literal('')),
  description: z.string().min(1, 'Opis je obavezan'),
  notes: z.string().optional(),
  priority: z.enum(['low', 'normal', 'high', 'urgent']),
  deadline: z.date({ message: 'Rok je obavezan' }),
});

type OrderFormData = z.infer<typeof orderSchema>;

interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  unit: string;
  notes?: string;
}

const priorityOptions: { value: OrderPriority; label: string }[] = [
  { value: 'low', label: 'Nizak' },
  { value: 'normal', label: 'Normalan' },
  { value: 'high', label: 'Visok' },
  { value: 'urgent', label: 'Hitan' },
];

interface CreateOrderSheetProps {
  trigger?: React.ReactNode;
}

export function CreateOrderSheet({ trigger }: CreateOrderSheetProps) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const { mutateAsync: createOrder, isPending } = useCreateOrder();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      priority: 'normal',
    },
  });

  const deadline = watch('deadline');

  const addItem = () => {
    setItems([
      ...items,
      {
        id: crypto.randomUUID(),
        productName: '',
        quantity: 1,
        unit: 'kom',
      },
    ]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const updateItem = (id: string, field: keyof OrderItem, value: string | number) => {
    setItems(
      items.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const onSubmit = async (data: OrderFormData) => {
    try {
      await createOrder({
        customerName: data.customerName,
        description: data.description,
        priority: data.priority,
        deadline: data.deadline.toISOString(),
        items: items
          .filter((item) => item.productName.trim())
          .map((item) => ({
            productName: item.productName,
            quantity: item.quantity,
            unit: item.unit,
            notes: item.notes,
          })),
      });

      setOpen(false);
      reset();
      setItems([]);
    } catch {
      // Error toast is handled by the mutation hook
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      reset();
      setItems([]);
    }
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Novi nalog
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>Novi nalog</SheetTitle>
          <SheetDescription>
            Unesite podatke o narudžbini i dodajte stavke.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-6">
          {/* Customer Info */}
          <div className="space-y-4">
            <h3 className="font-medium">Podaci o kupcu</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="customerName">Ime kupca *</Label>
                <Input
                  id="customerName"
                  placeholder="Unesite ime kupca"
                  {...register('customerName')}
                  errorText={errors.customerName?.message}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerPhone">Telefon</Label>
                <Input
                  id="customerPhone"
                  placeholder="+381 60 123 4567"
                  {...register('customerPhone')}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="customerEmail">Email</Label>
                <Input
                  id="customerEmail"
                  type="email"
                  placeholder="kupac@email.com"
                  {...register('customerEmail')}
                  errorText={errors.customerEmail?.message}
                />
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="space-y-4">
            <h3 className="font-medium">Detalji naloga</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Prioritet *</Label>
                <Select
                  defaultValue="normal"
                  onValueChange={(v) => setValue('priority', v as OrderPriority)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Izaberite prioritet" />
                  </SelectTrigger>
                  <SelectContent>
                    {priorityOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Rok *</Label>
                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !deadline && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {deadline ? (
                        format(deadline, 'PPP', { locale: sr })
                      ) : (
                        <span>Izaberite datum</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={deadline}
                      onSelect={(date) => {
                        if (date) {
                          setValue('deadline', date);
                          setCalendarOpen(false);
                        }
                      }}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.deadline && (
                  <p className="text-xs text-destructive">{errors.deadline.message}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Opis *</Label>
              <Textarea
                id="description"
                placeholder="Opišite narudžbinu..."
                rows={3}
                {...register('description')}
              />
              {errors.description && (
                <p className="text-xs text-destructive">{errors.description.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Napomene</Label>
              <Textarea
                id="notes"
                placeholder="Dodatne napomene..."
                rows={2}
                {...register('notes')}
              />
            </div>
          </div>

          {/* Order Items */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Stavke naloga</h3>
              <Button type="button" variant="outline" size="sm" onClick={addItem}>
                <Plus className="mr-2 h-4 w-4" />
                Dodaj stavku
              </Button>
            </div>

            {items.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nema stavki. Kliknite "Dodaj stavku" za dodavanje.
              </p>
            ) : (
              <div className="space-y-3">
                {items.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-3 rounded-lg border bg-muted/30 p-3"
                  >
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                      {index + 1}
                    </div>
                    <div className="grid flex-1 gap-3 sm:grid-cols-4">
                      <div className="sm:col-span-2">
                        <Input
                          placeholder="Naziv proizvoda"
                          value={item.productName}
                          onChange={(e) =>
                            updateItem(item.id, 'productName', e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <Input
                          type="number"
                          min={1}
                          placeholder="Količina"
                          value={item.quantity}
                          onChange={(e) =>
                            updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)
                          }
                        />
                      </div>
                      <div>
                        <Select
                          value={item.unit}
                          onValueChange={(v) => updateItem(item.id, 'unit', v)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="kom">kom</SelectItem>
                            <SelectItem value="m">m</SelectItem>
                            <SelectItem value="m2">m²</SelectItem>
                            <SelectItem value="kg">kg</SelectItem>
                            <SelectItem value="set">set</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="shrink-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <SheetFooter className="mt-4">
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Otkaži
            </Button>
            <Button type="submit" loading={isPending}>
              Kreiraj nalog
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
