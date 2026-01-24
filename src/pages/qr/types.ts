export type SePayQrResponse = {
  account: string;
  bank: string;
  amount: number;
  description?: string;
  expiredAt: number;
};

export type SePayQrCardProps = {
  account: string;
  bank: string;
  amount?: number | string;
  description?: string;
  expiredAt: number;
};
