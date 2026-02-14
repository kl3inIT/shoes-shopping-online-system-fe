import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  CheckoutForm,
  CheckoutOrderSummary,
  PaymentMethod,
  type ShippingAddress,
} from '@/features/checkout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  mockCheckoutItems,
  paymentOptions,
  cities,
  districts,
  wards,
  initialAddress,
  calculateOrderSummary,
} from './data';

export function CheckoutPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [address, setAddress] = useState<ShippingAddress>(initialAddress);
  const [selectedPayment, setSelectedPayment] = useState<string>('se-pay');
  const [errors, setErrors] = useState<
    Partial<Record<keyof ShippingAddress, string>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const items = mockCheckoutItems;
  const summary = calculateOrderSummary(items);

  const currentDistricts = address.city ? districts[address.city] || [] : [];
  const currentWards = address.district ? wards[address.district] || [] : [];

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ShippingAddress, string>> = {};

    if (!address.fullName.trim()) {
      newErrors.fullName = t('checkout.validation.fullNameRequired');
    }
    if (!address.phone.trim()) {
      newErrors.phone = t('checkout.validation.phoneRequired');
    } else if (!/^\d{10,11}$/.test(address.phone.replace(/\D/g, ''))) {
      newErrors.phone = t('checkout.validation.phoneInvalid');
    }
    if (!address.email.trim()) {
      newErrors.email = t('checkout.validation.emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address.email)) {
      newErrors.email = t('checkout.validation.emailInvalid');
    }
    if (!address.city) {
      newErrors.city = t('checkout.validation.cityRequired');
    }
    if (!address.district) {
      newErrors.district = t('checkout.validation.districtRequired');
    }
    if (!address.address.trim()) {
      newErrors.address = t('checkout.validation.addressRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = () => {
    if (validateForm()) {
      setConfirmDialogOpen(true);
    }
  };

  const handleConfirmOrder = async () => {
    setIsSubmitting(true);
    setConfirmDialogOpen(false);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Redirect to payment result page
    navigate('/checkout/payment-result?status=success&orderId=ORD123456');
  };

  const selectedPaymentMethod = paymentOptions.find(
    (p) => p.id === selectedPayment
  );

  return (
    <div className='container mx-auto px-4 py-8'>
      {/* Header */}
      <div className='mb-8'>
        <Button
          variant='ghost'
          className='mb-2'
          onClick={() => navigate('/cart')}
        >
          <ArrowLeft className='mr-2 h-4 w-4' />
          {t('checkout.backToCart')}
        </Button>
        <h1 className='text-3xl font-bold'>{t('checkout.title')}</h1>
      </div>

      <div className='grid gap-8 lg:grid-cols-3'>
        {/* Left Column - Forms */}
        <div className='space-y-6 lg:col-span-2'>
          {/* Shipping Address */}
          <CheckoutForm
            address={address}
            onChange={setAddress}
            cities={cities}
            districts={currentDistricts}
            wards={currentWards}
            errors={errors}
          />

          {/* Payment Method */}
          <PaymentMethod
            options={paymentOptions}
            selectedMethod={selectedPayment}
            onMethodChange={setSelectedPayment}
          />
        </div>

        {/* Right Column - Summary */}
        <div className='lg:col-span-1'>
          <div className='sticky top-4 space-y-4'>
            <CheckoutOrderSummary items={items} {...summary} />
            <Button
              className='w-full'
              size='lg'
              onClick={handlePlaceOrder}
              disabled={isSubmitting}
            >
              {isSubmitting && (
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              )}
              {t('checkout.placeOrder')}
            </Button>
            <p className='text-center text-xs text-muted-foreground'>
              {t('checkout.termsNotice')}
            </p>
          </div>
        </div>
      </div>

      {/* Confirm Order Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('checkout.confirmOrder.title')}</DialogTitle>
            <DialogDescription>
              {t('checkout.confirmOrder.description', {
                total: summary.total.toFixed(2),
                method: selectedPaymentMethod?.name || '',
              })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setConfirmDialogOpen(false)}
            >
              {t('common.cancel')}
            </Button>
            <Button onClick={handleConfirmOrder}>
              {t('checkout.confirmAndPay')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CheckoutPage;
