import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  CheckoutForm,
  CheckoutOrderSummary,
  type ShippingAddress,
  type CreateOrderRequest,
  useCheckoutCart,
  useVietnamAddressOptions,
  useCreateOrderMutation,
} from '@/features/checkout';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { initialAddress } from './data';

export function CheckoutPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Local state only for address (used by address API hook).
  const [address, setAddress] = useState<ShippingAddress>(initialAddress);

  const createOrderMutation = useCreateOrderMutation();

  const { items, summary } = useCheckoutCart();

  const { cityOptions, districtOptions, wardOptions } =
    useVietnamAddressOptions(address.city, address.district);

  const handleCreateOrder = () => {
    const cityLabel =
      cityOptions.find((c) => c.value === address.city)?.label ?? '';
    const districtLabel =
      districtOptions.find((d) => d.value === address.district)?.label ?? '';
    const wardLabel =
      wardOptions.find((w) => w.value === address.ward)?.label ?? '';

    const shippingAddress = [
      address.address,
      wardLabel,
      districtLabel,
      cityLabel,
    ]
      .filter(Boolean)
      .join(', ');

    const buildCreateOrderRequest = (): CreateOrderRequest => ({
      discountId: 1,
      shippingName: address.fullName,
      shippingPhone: address.phone,
      shippingAddress,
      notes: address.note ?? '',
    });

    createOrderMutation.mutate(buildCreateOrderRequest(), {
      onSuccess: (data) => {
        navigate(`/payment/qr/${data.orderId}`);
      },
    });
  };

  return (
    <div className='container mx-auto px-4 py-8'>
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
        <div className='space-y-6 lg:col-span-2'>
          <CheckoutForm
            address={address}
            onChange={setAddress}
            cities={cityOptions}
            districts={districtOptions}
            wards={wardOptions}
          />

          {/* <PaymentMethod
            options={paymentOptions}
            selectedMethod={selectedPayment}
            onMethodChange={setSelectedPayment}
          /> */}
        </div>

        <div className='lg:col-span-1'>
          <div className='sticky top-4 space-y-4'>
            <CheckoutOrderSummary items={items} {...summary} />
            <Button
              className='w-full'
              size='lg'
              disabled={createOrderMutation.isPending}
              onClick={handleCreateOrder}
            >
              {t('checkout.placeOrder')}
            </Button>
            <p className='text-center text-xs text-muted-foreground'>
              {t('checkout.termsNotice')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
