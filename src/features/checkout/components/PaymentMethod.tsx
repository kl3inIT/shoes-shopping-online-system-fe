import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CreditCard, Wallet, Banknote } from 'lucide-react';

export interface PaymentOption {
  id: string;
  name: string;
  description?: string;
  icon?: 'card' | 'wallet' | 'cash';
  disabled?: boolean;
}

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
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Method</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup value={selectedMethod} onValueChange={onMethodChange}>
          <div className='space-y-3'>
            {options.map((option) => {
              const Icon = option.icon ? iconMap[option.icon] : CreditCard;
              return (
                <div key={option.id}>
                  <Label
                    htmlFor={option.id}
                    className={`flex cursor-pointer items-center gap-4 rounded-lg border p-4 transition-colors ${
                      selectedMethod === option.id
                        ? 'border-primary bg-primary/5'
                        : 'hover:bg-muted/50'
                    } ${option.disabled ? 'cursor-not-allowed opacity-50' : ''}`}
                  >
                    <RadioGroupItem
                      value={option.id}
                      id={option.id}
                      disabled={option.disabled}
                    />
                    <Icon className='h-5 w-5 text-muted-foreground' />
                    <div className='flex-1'>
                      <p className='font-medium'>{option.name}</p>
                      {option.description && (
                        <p className='text-sm text-muted-foreground'>
                          {option.description}
                        </p>
                      )}
                    </div>
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
