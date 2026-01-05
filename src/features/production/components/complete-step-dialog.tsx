import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckCircle } from 'lucide-react';

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
import { useCompleteStep } from '../hooks/use-production-cards';

const completeSchema = z.object({
  notes: z.string().optional(),
});

type CompleteFormData = z.infer<typeof completeSchema>;

interface CompleteStepDialogProps {
  cardId: string;
  orderNumber?: string;
  stepName?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CompleteStepDialog({
  cardId,
  orderNumber,
  stepName,
  open,
  onOpenChange,
}: CompleteStepDialogProps) {
  const { mutateAsync: completeStep, isPending } = useCompleteStep();

  const {
    register,
    handleSubmit,
    reset,
  } = useForm<CompleteFormData>({
    resolver: zodResolver(completeSchema),
  });

  const onSubmit = async (data: CompleteFormData) => {
    try {
      const result = await completeStep({
        cardId,
        notes: data.notes,
      });

      onOpenChange(false);
      reset();

      if (result?.isOrderComplete) {
        showToast.success('Nalog završen!');
      } else {
        showToast.success('Korak završen');
      }
    } catch {
      showToast.error('Greška pri završavanju koraka');
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
          <DialogTitle className="flex items-center gap-2 text-success">
            <CheckCircle className="h-5 w-5" />
            Završi korak
          </DialogTitle>
          <DialogDescription>
            {orderNumber && stepName ? (
              <>
                Nalog: <strong>{orderNumber}</strong>
                <br />
                Korak: <strong>{stepName}</strong>
              </>
            ) : (
              'Potvrdite završetak koraka'
            )}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="rounded-lg border border-success/20 bg-success/10 p-4">
            <p className="text-sm text-success">
              Da li ste sigurni da želite da završite ovaj korak?
              Nalog će preći na sledeći korak u proizvodnji.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Napomene (opciono)</Label>
            <Textarea
              id="notes"
              placeholder="Dodatne napomene o završenom koraku..."
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
              className="flex-1 bg-success text-success-foreground hover:bg-success/90 sm:flex-none"
            >
              Završi korak
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
