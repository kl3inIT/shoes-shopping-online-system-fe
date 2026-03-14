export type CustomerOrderSummary = {
  createdAt: string;
  id: string;
  orderNumber: string;
  paymentStatus: string;
  shippingStatus?: string;
  totalAmount: number;
};

export type CustomerOrdersQueryParams = {
  page?: number;
  size?: number;
  status?: string;
};
