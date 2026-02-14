import { Check, Package, Truck, MapPin, Clock } from 'lucide-react';

export interface TimelineStep {
  id: string;
  title: string;
  description?: string;
  timestamp?: string;
  status: 'completed' | 'current' | 'upcoming';
}

export interface OrderTimelineProps {
  steps: TimelineStep[];
}

const statusIcons = {
  order_placed: Package,
  processing: Clock,
  shipped: Truck,
  out_for_delivery: Truck,
  delivered: MapPin,
};

export function OrderTimeline({ steps }: OrderTimelineProps) {
  return (
    <div className='relative'>
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        const Icon =
          step.status === 'completed'
            ? Check
            : statusIcons[step.id as keyof typeof statusIcons] || Clock;

        return (
          <div key={step.id} className='flex gap-4'>
            {/* Timeline indicator */}
            <div className='flex flex-col items-center'>
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                  step.status === 'completed'
                    ? 'border-primary bg-primary text-primary-foreground'
                    : step.status === 'current'
                      ? 'border-primary bg-background text-primary'
                      : 'border-muted bg-muted text-muted-foreground'
                }`}
              >
                <Icon className='h-5 w-5' />
              </div>
              {!isLast && (
                <div
                  className={`h-full w-0.5 ${
                    step.status === 'completed' ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              )}
            </div>

            {/* Content */}
            <div className={`pb-8 ${isLast ? 'pb-0' : ''}`}>
              <h4
                className={`font-medium ${
                  step.status === 'upcoming' ? 'text-muted-foreground' : ''
                }`}
              >
                {step.title}
              </h4>
              {step.description && (
                <p className='mt-1 text-sm text-muted-foreground'>
                  {step.description}
                </p>
              )}
              {step.timestamp && (
                <p className='mt-1 text-xs text-muted-foreground'>
                  {new Date(step.timestamp).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default OrderTimeline;
