import { formatDistanceToNow } from 'date-fns';
import { sr } from 'date-fns/locale';
import {
  Play,
  CheckCircle,
  AlertTriangle,
  Package,
  Pause,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ActivityItem {
  id: string;
  type: 'step_started' | 'step_completed' | 'problem_reported' | 'order_created' | 'step_paused';
  message: string;
  userName: string;
  orderNumber?: string;
  departmentName?: string;
  timestamp: string;
}

// Mock data for now
const mockActivity: ActivityItem[] = [
  {
    id: '1',
    type: 'step_completed',
    message: 'Završio korak "Sečenje"',
    userName: 'Marko P.',
    orderNumber: 'NAL-2024-0042',
    departmentName: 'Sečenje',
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    type: 'problem_reported',
    message: 'Prijavio problem: Nedostaje materijal',
    userName: 'Jovan S.',
    orderNumber: 'NAL-2024-0039',
    departmentName: 'Bušenje',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    type: 'step_started',
    message: 'Započeo korak "Farbanje"',
    userName: 'Nikola M.',
    orderNumber: 'NAL-2024-0041',
    departmentName: 'Farbanje',
    timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    type: 'order_created',
    message: 'Kreiran novi nalog',
    userName: 'Ana T.',
    orderNumber: 'NAL-2024-0043',
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
  },
  {
    id: '5',
    type: 'step_completed',
    message: 'Završio korak "Montaža"',
    userName: 'Petar D.',
    orderNumber: 'NAL-2024-0038',
    departmentName: 'Montaža',
    timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
  },
  {
    id: '6',
    type: 'step_paused',
    message: 'Pauzirao rad',
    userName: 'Milan K.',
    orderNumber: 'NAL-2024-0040',
    departmentName: 'Zavarivanje',
    timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
  },
];

const activityIcons = {
  step_started: Play,
  step_completed: CheckCircle,
  problem_reported: AlertTriangle,
  order_created: Package,
  step_paused: Pause,
};

const activityColors = {
  step_started: 'text-info bg-info/10',
  step_completed: 'text-success bg-success/10',
  problem_reported: 'text-destructive bg-destructive/10',
  order_created: 'text-primary bg-primary/10',
  step_paused: 'text-warning bg-warning/10',
};

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Nedavna aktivnost</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          <div className="space-y-0 divide-y">
            {mockActivity.map((item) => (
              <ActivityRow key={item.id} item={item} />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

function ActivityRow({ item }: { item: ActivityItem }) {
  const Icon = activityIcons[item.type];

  return (
    <div className="flex items-start gap-3 p-4 hover:bg-muted/50 transition-colors">
      <div
        className={cn(
          'flex h-9 w-9 shrink-0 items-center justify-center rounded-full',
          activityColors[item.type]
        )}
      >
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm">
          <span className="font-medium">{item.userName}</span>{' '}
          <span className="text-muted-foreground">{item.message}</span>
        </p>
        <div className="flex items-center gap-2 mt-1">
          {item.orderNumber && (
            <span className="text-xs font-medium text-primary">{item.orderNumber}</span>
          )}
          {item.departmentName && (
            <span className="text-xs text-muted-foreground">• {item.departmentName}</span>
          )}
        </div>
      </div>
      <span className="text-xs text-muted-foreground whitespace-nowrap">
        {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true, locale: sr })}
      </span>
    </div>
  );
}
