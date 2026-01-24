import { useEffect, useState } from 'react';
import { fetchSePayQr } from '../services/sepayQr.service';
import type { SePayQrResponse } from '../types';

export function useSePayQr() {
  const [data, setData] = useState<SePayQrResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSePayQr()
      .then(setData)
      .catch(() => setError('Failed to load QR'))
      .finally(() => setLoading(false));
  }, []);

  return {
    data,
    loading,
    error,
  };
}
