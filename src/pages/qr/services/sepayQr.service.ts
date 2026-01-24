import type { SePayQrResponse } from '../types';

const STORAGE_KEY = 'sepay_qr_mock';
export async function fetchSePayQr(): Promise<SePayQrResponse> {
  const cached = localStorage.getItem(STORAGE_KEY);

  if (cached) {
    return JSON.parse(cached);
  }

  const data: SePayQrResponse = {
    account: '0123456789',
    bank: 'VCB',
    amount: 250000,
    description: 'Thanh toán đơn hàng #123',
    expiredAt: Date.now() + 5 * 60 * 1000,
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

  return data;
}
