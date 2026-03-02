import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CreditCard, Wallet, Banknote } from 'lucide-react';
import type { PaymentOption } from '../types';

export interface PaymentMethodProps {
  options: PaymentOption[];
  selectedMethod?: string;
  onMethodChange?: (methodId: string) => void;
}

const iconMap = {
  card: CreditCard,
  wallet: Wallet,
  cash: Banknote,
};

export function PaymentMethod({
  options,
  selectedMethod,
  onMethodChange,
}: PaymentMethodProps) {
  const hasSingleMethod = options.length === 1;

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {hasSingleMethod ? 'Payment (Online via QR)' : 'Payment Method'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selectedMethod}
          onValueChange={onMethodChange}
          className={hasSingleMethod ? 'mt-1' : ''}
        >
          <div className='space-y-3'>
            {options.map((option) => {
              const Icon = option.icon ? iconMap[option.icon] : CreditCard;
              const isSelected = selectedMethod === option.id;

              return (
                <div key={option.id}>
                  <Label
                    htmlFor={option.id}
                    className={`flex items-center gap-4 rounded-lg border p-4 shadow-sm transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/5 ring-1 ring-primary/30'
                        : 'hover:bg-muted/50'
                    } ${
                      option.disabled
                        ? 'cursor-not-allowed opacity-50'
                        : 'cursor-pointer'
                    }`}
                  >
                    <RadioGroupItem
                      value={option.id}
                      id={option.id}
                      disabled={option.disabled}
                    />
                    <Icon className='h-6 w-6 text-primary' />
                    <div className='flex-1'>
                      <p className='font-semibold tracking-tight'>
                        {option.name}
                      </p>
                      {option.description && (
                        <p className='text-sm text-muted-foreground'>
                          {option.description}
                        </p>
                      )}
                    </div>
                    {hasSingleMethod && (
                      <span className='rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary'>
                        Online QR only
                      </span>
                    )}
                  </Label>
                </div>
              );
            })}
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
}

export default PaymentMethod;
