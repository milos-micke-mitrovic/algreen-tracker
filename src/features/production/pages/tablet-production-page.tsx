import { useState } from 'react';
import { Play, Pause, CheckCircle, AlertTriangle, ArrowLeft } from 'lucide-react';

import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth-store';
import { useDepartmentSubscription } from '@/hooks/use-signalr';
import { BigButton } from '@/components/tablet/big-button';
import { CardListItem } from '@/components/tablet/card-list-item';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

import {
  useDepartmentCards,
  useStartStep,
  usePauseStep,
  useCompleteStep,
  useReportProblem,
} from '../hooks/use-production-cards';
import { useProductionUIStore } from '../stores/production-ui-store';
import type { ProductionCard } from '@/types/domain';

/**
 * Tablet production page - main view for workers
 */
export function TabletProductionPage() {
  const user = useAuthStore((s) => s.user);
  const departmentId = user?.departmentId;

  // Subscribe to department events
  useDepartmentSubscription(departmentId ?? null);

  // Fetch cards for this department
  const { data: cards, isLoading, error } = useDepartmentCards(departmentId ?? null);

  // UI state
  const selectedCardId = useProductionUIStore((s) => s.selectedCardId);
  const setSelectedCardId = useProductionUIStore((s) => s.setSelectedCardId);

  // Selected card
  const selectedCard = cards?.find((c) => c.id === selectedCardId);

  if (!departmentId) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="text-center">
          <AlertTriangle className="mx-auto h-16 w-16 text-warning" />
          <h2 className="mt-4 text-xl font-semibold">Niste dodeljeni odeljenju</h2>
          <p className="mt-2 text-muted-foreground">
            Kontaktirajte administratora da vas dodeli odeljenju.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="text-center">
          <AlertTriangle className="mx-auto h-16 w-16 text-destructive" />
          <h2 className="mt-4 text-xl font-semibold">Greška pri učitavanju</h2>
          <p className="mt-2 text-muted-foreground">
            Pokušajte ponovo ili kontaktirajte podršku.
          </p>
        </div>
      </div>
    );
  }

  // If a card is selected, show detail view
  if (selectedCard) {
    return (
      <CardDetailView
        card={selectedCard}
        onBack={() => setSelectedCardId(null)}
      />
    );
  }

  // Show card list
  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">Nalozi za rad</h1>

      {cards && cards.length === 0 ? (
        <div className="flex h-64 items-center justify-center rounded-xl border-2 border-dashed">
          <div className="text-center">
            <CheckCircle className="mx-auto h-12 w-12 text-success" />
            <p className="mt-2 text-lg font-medium">Nema naloga</p>
            <p className="text-muted-foreground">Svi nalozi su završeni</p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {cards?.map((card) => (
            <CardListItem
              key={card.id}
              card={card}
              onClick={() => setSelectedCardId(card.id)}
              selected={card.id === selectedCardId}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Detail view for a single card with action buttons
 */
function CardDetailView({
  card,
  onBack,
}: {
  card: ProductionCard;
  onBack: () => void;
}) {
  const [problemDialogOpen, setProblemDialogOpen] = useState(false);
  const [problemReason, setProblemReason] = useState('');
  const [notesDialogOpen, setNotesDialogOpen] = useState(false);
  const [notes, setNotes] = useState('');
  const [pendingAction, setPendingAction] = useState<'complete' | 'pause' | null>(null);

  const startStep = useStartStep();
  const pauseStep = usePauseStep();
  const completeStep = useCompleteStep();
  const reportProblem = useReportProblem();

  const isLoading =
    startStep.isPending || pauseStep.isPending || completeStep.isPending || reportProblem.isPending;

  const handleStart = () => {
    startStep.mutate(card.id, {
      onSuccess: () => onBack(),
    });
  };

  const handlePause = () => {
    setPendingAction('pause');
    setNotesDialogOpen(true);
  };

  const handleComplete = () => {
    setPendingAction('complete');
    setNotesDialogOpen(true);
  };

  const handleNotesSubmit = () => {
    if (pendingAction === 'pause') {
      pauseStep.mutate(
        { cardId: card.id, notes: notes || undefined },
        { onSuccess: () => onBack() }
      );
    } else if (pendingAction === 'complete') {
      completeStep.mutate(
        { cardId: card.id, notes: notes || undefined },
        { onSuccess: () => onBack() }
      );
    }
    setNotesDialogOpen(false);
    setNotes('');
    setPendingAction(null);
  };

  const handleReportProblem = () => {
    setProblemDialogOpen(true);
  };

  const handleProblemSubmit = () => {
    if (!problemReason.trim()) return;

    reportProblem.mutate(
      { cardId: card.id, reason: problemReason },
      { onSuccess: () => onBack() }
    );
    setProblemDialogOpen(false);
    setProblemReason('');
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b bg-card p-4">
        <Button variant="ghost" onClick={onBack} className="mb-2">
          <ArrowLeft className="mr-2 h-5 w-5" />
          Nazad
        </Button>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              {card.order?.orderNumber || 'Nalog'}
            </h1>
            <p className="text-lg text-muted-foreground">
              {card.order?.customerName || 'Nepoznat kupac'}
            </p>
          </div>
          <StatusBadge status={card.status} />
        </div>

        {card.order?.description && (
          <p className="mt-4 text-muted-foreground">{card.order.description}</p>
        )}
      </div>

      {/* Current step info */}
      <div className="border-b bg-muted/30 p-4">
        <p className="text-sm font-medium text-muted-foreground">Trenutni korak</p>
        <p className="text-xl font-semibold">{card.currentStep?.name || 'Nepoznat korak'}</p>
      </div>

      {/* Action buttons */}
      <div className="flex-1 p-6">
        <div className="grid grid-cols-2 gap-4">
          {/* Start button - shown when card is new or paused */}
          {(card.status === 'new' || card.status === 'paused') && (
            <BigButton
              icon={<Play className="h-10 w-10" />}
              label="Pokreni"
              variant="start"
              onClick={handleStart}
              loading={startStep.isPending}
              disabled={isLoading}
            />
          )}

          {/* Pause button - shown when in progress */}
          {card.status === 'in_progress' && (
            <BigButton
              icon={<Pause className="h-10 w-10" />}
              label="Pauziraj"
              variant="pause"
              onClick={handlePause}
              loading={pauseStep.isPending}
              disabled={isLoading}
            />
          )}

          {/* Complete button - shown when in progress */}
          {card.status === 'in_progress' && (
            <BigButton
              icon={<CheckCircle className="h-10 w-10" />}
              label="Završi"
              variant="complete"
              onClick={handleComplete}
              loading={completeStep.isPending}
              disabled={isLoading}
            />
          )}

          {/* Problem button - always shown except when blocked/completed */}
          {card.status !== 'blocked' && card.status !== 'completed' && (
            <BigButton
              icon={<AlertTriangle className="h-10 w-10" />}
              label="Problem"
              variant="problem"
              onClick={handleReportProblem}
              loading={reportProblem.isPending}
              disabled={isLoading}
            />
          )}
        </div>
      </div>

      {/* Notes Dialog */}
      <Dialog open={notesDialogOpen} onOpenChange={setNotesDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {pendingAction === 'pause' ? 'Pauziraj korak' : 'Završi korak'}
            </DialogTitle>
            <DialogDescription>
              {pendingAction === 'pause'
                ? 'Dodajte napomenu zašto pauzrirate rad (opciono).'
                : 'Dodajte napomenu o završenom koraku (opciono).'}
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Unesite napomenu (opciono)..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-[100px]"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setNotesDialogOpen(false)}>
              Otkaži
            </Button>
            <Button onClick={handleNotesSubmit}>
              {pendingAction === 'pause' ? 'Pauziraj' : 'Završi'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Problem Dialog */}
      <Dialog open={problemDialogOpen} onOpenChange={setProblemDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Prijavi problem</DialogTitle>
            <DialogDescription>
              Opišite problem koji sprečava nastavak rada na ovom nalogu.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Opišite problem..."
            value={problemReason}
            onChange={(e) => setProblemReason(e.target.value)}
            className="min-h-[100px]"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setProblemDialogOpen(false)}>
              Otkaži
            </Button>
            <Button
              variant="destructive"
              onClick={handleProblemSubmit}
              disabled={!problemReason.trim()}
            >
              Prijavi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/**
 * Status badge component
 */
function StatusBadge({ status }: { status: ProductionCard['status'] }) {
  const styles = {
    new: 'bg-info/10 text-info',
    in_progress: 'bg-warning/10 text-warning',
    paused: 'bg-muted text-muted-foreground',
    blocked: 'bg-destructive/10 text-destructive',
    completed: 'bg-success/10 text-success',
  };

  const labels = {
    new: 'Nov',
    in_progress: 'U toku',
    paused: 'Pauziran',
    blocked: 'Blokiran',
    completed: 'Završen',
  };

  return (
    <span className={cn('rounded-full px-3 py-1 text-sm font-medium', styles[status])}>
      {labels[status]}
    </span>
  );
}
