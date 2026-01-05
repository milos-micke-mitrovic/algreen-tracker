import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Pause } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { showToast } from '@/lib/toast';
import { usePauseStep } from '../hooks/use-production-cards';

const pauseSchema = z.object({
  notes: z.string().optional(),
});

type PauseFormData = z.infer<typeof pauseSchema>;

interface PauseStepDialogProps {
  cardId: string;
  orderNumber?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PauseStepDialog({
  cardId,
  orderNumber,
  open,
  onOpenChange,
}: PauseStepDialogProps) {
  const { mutateAsync: pauseStep, isPending } = usePauseStep();

  const {
    register,
    handleSubmit,
    reset,
  } = useForm<PauseFormData>({
    resolver: zodResolver(pauseSchema),
  });

  const onSubmit = async (data: PauseFormData) => {
    try {
      await pauseStep({
        cardId,
        notes: data.notes,
      });

      onOpenChange(false);
      reset();
      showToast.info('Korak pauziran');
    } catch {
      showToast.error('Greška pri pauziranju');
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-warning">
            <Pause className="h-5 w-5" />
            Pauziraj rad
          </DialogTitle>
          <DialogDescription>
            {orderNumber ? (
              <>Nalog: <strong>{orderNumber}</strong></>
            ) : (
              'Pauzirajte trenutni korak'
            )}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="notes">Razlog pauze (opciono)</Label>
            <Textarea
              id="notes"
              placeholder="Zašto pauzirate rad..."
              rows={3}
              {...register('notes')}
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1 sm:flex-none"
            >
              Otkaži
            </Button>
            <Button
              type="submit"
              variant="default"
              loading={isPending}
              className="flex-1 bg-warning text-warning-foreground hover:bg-warning/90 sm:flex-none"
            >
              Pauziraj
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
