import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AlertTriangle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { showToast } from '@/lib/toast';
import { useReportProblem } from '../hooks/use-production-cards';

const problemReasons = [
  { value: 'material_missing', label: 'Nedostaje materijal', icon: '📦' },
  { value: 'machine_broken', label: 'Kvar mašine', icon: '🔧' },
  { value: 'quality_issue', label: 'Problem sa kvalitetom', icon: '⚠️' },
  { value: 'missing_info', label: 'Nedostaju informacije', icon: '📋' },
  { value: 'wrong_dimensions', label: 'Pogrešne dimenzije', icon: '📐' },
  { value: 'other', label: 'Drugo', icon: '❓' },
] as const;

const problemSchema = z.object({
  reason: z.string().min(1, 'Izaberite razlog'),
  notes: z.string().optional(),
});

type ProblemFormData = z.infer<typeof problemSchema>;

interface ReportProblemDialogProps {
  cardId: string;
  orderNumber?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReportProblemDialog({
  cardId,
  orderNumber,
  open,
  onOpenChange,
}: ReportProblemDialogProps) {
  const [selectedReason, setSelectedReason] = useState<string>('');

  const { mutateAsync: reportProblem, isPending } = useReportProblem();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ProblemFormData>({
    resolver: zodResolver(problemSchema),
  });

  const onSubmit = async (data: ProblemFormData) => {
    try {
      // Find the label for the reason
      const reasonLabel = problemReasons.find((r) => r.value === data.reason)?.label || data.reason;

      await reportProblem({
        cardId,
        reason: reasonLabel,
        notes: data.notes,
      });

      onOpenChange(false);
      reset();
      setSelectedReason('');
      showToast.warning('Problem prijavljen');
    } catch {
      showToast.error('Greška pri prijavljivanju problema');
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    reset();
    setSelectedReason('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Prijavi problem
          </DialogTitle>
          <DialogDescription>
            {orderNumber ? (
              <>Nalog: <strong>{orderNumber}</strong></>
            ) : (
              'Prijavite problem sa proizvodnjom'
            )}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Reason Selection - Large touch-friendly buttons */}
          <div className="space-y-3">
            <Label>Razlog problema *</Label>
            <RadioGroup
              value={selectedReason}
              onValueChange={(value) => {
                setSelectedReason(value);
                setValue('reason', value);
              }}
              className="grid grid-cols-2 gap-3"
            >
              {problemReasons.map((reason) => (
                <div key={reason.value}>
                  <RadioGroupItem
                    value={reason.value}
                    id={reason.value}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={reason.value}
                    className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-muted bg-popover p-4 text-center transition-all hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-destructive peer-data-[state=checked]:bg-destructive/10 [&:has([data-state=checked])]:border-destructive"
                  >
                    <span className="text-2xl">{reason.icon}</span>
                    <span className="text-sm font-medium">{reason.label}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
            {errors.reason && (
              <p className="text-xs text-destructive">{errors.reason.message}</p>
            )}
          </div>

          {/* Additional Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Dodatne napomene</Label>
            <Textarea
              id="notes"
              placeholder="Opišite problem detaljnije..."
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
              variant="destructive"
              loading={isPending}
              className="flex-1 sm:flex-none"
            >
              Prijavi problem
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
