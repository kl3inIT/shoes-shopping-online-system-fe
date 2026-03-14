import { useEffect, useMemo, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useQueryCart } from '@/features/cart';
import { createOrder } from './api';
import type {
  CheckoutItem,
  CheckoutSummary,
  CreateOrderRequest,
} from './types';

interface VNWard {
  code: number;
  name: string;
}

interface VNDistrict {
  code: number;
  name: string;
  wards: VNWard[];
}

interface VNProvince {
  code: number;
  name: string;
  districts: VNDistrict[];
}

function computeCheckoutSummary(subtotal: number): CheckoutSummary {
  const shipping = subtotal >= 100 ? 0 : 10;
  const tax = 0;
  const discount = 0;
  const total = subtotal + shipping + tax - discount;
  return { subtotal, shipping, discount, tax, total };
}

export function useCheckoutCart() {
  const { data: cartData } = useQueryCart();

  const items: CheckoutItem[] = useMemo(
    () =>
      cartData?.items.map((item) => ({
        id: item.id,
        name: item.shoeName,
        brand: '',
        image: item.shoeImage ?? '',
        price: Number(item.price),
        size: item.size,
        quantity: Number(item.quantity),
        color: item.color,
      })) ?? [],
    [cartData]
  );

  const summary: CheckoutSummary = useMemo(
    () =>
      cartData
        ? computeCheckoutSummary(Number(cartData.totalPrice))
        : { subtotal: 0, shipping: 0, discount: 0, tax: 0, total: 0 },
    [cartData]
  );

  return { cartData, items, summary };
}

export function useVietnamAddressOptions(
  cityCode: string,
  districtCode: string
) {
  const [provinces, setProvinces] = useState<VNProvince[]>([]);

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch('https://provinces.open-api.vn/api/?depth=3');
        if (!res.ok) return;
        const data = (await res.json()) as VNProvince[];
        setProvinces(data);
      } catch {
        // ignore address API error, form can still be used
      }
    })();
  }, []);

  const cityOptions = useMemo(
    () =>
      provinces.map((p) => ({
        value: String(p.code),
        label: p.name,
      })),
    [provinces]
  );

  const selectedProvince = useMemo(
    () =>
      cityCode ? provinces.find((p) => String(p.code) === cityCode) : undefined,
    [cityCode, provinces]
  );

  const districtOptions = useMemo(
    () =>
      selectedProvince?.districts.map((d) => ({
        value: String(d.code),
        label: d.name,
      })) ?? [],
    [selectedProvince]
  );

  const selectedDistrict = useMemo(
    () =>
      districtCode
        ? selectedProvince?.districts.find(
            (d) => String(d.code) === districtCode
          )
        : undefined,
    [districtCode, selectedProvince]
  );

  const wardOptions = useMemo(
    () =>
      selectedDistrict?.wards.map((w) => ({
        value: String(w.code),
        label: w.name,
      })) ?? [],
    [selectedDistrict]
  );

  return { cityOptions, districtOptions, wardOptions };
}

export function useCreateOrderMutation() {
  return useMutation({
    mutationFn: (body: CreateOrderRequest) => createOrder(body),
  });
}
