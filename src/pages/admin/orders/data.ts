export type OrderStatus =
  | 'PLACED'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED';

export interface OrderItem {
  id: string;
  productName: string;
  productImage: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  shippingName: string;
  shippingPhone: string;
  shippingEmail: string;
  shippingAddress: string;
  paymentMethod: string;
  paymentTransactionId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    customer: {
      id: 'c1',
      name: 'Nguyen Van A',
      email: 'nguyenvana@gmail.com',
      phone: '0901234567',
    },
    items: [
      {
        id: 'i1',
        productName: 'Nike Air Max 270',
        productImage:
          'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
        size: '42',
        color: 'Black',
        quantity: 1,
        price: 150,
      },
      {
        id: 'i2',
        productName: 'Adidas Ultraboost 22',
        productImage:
          'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400',
        size: '42',
        color: 'White',
        quantity: 1,
        price: 190,
      },
    ],
    totalAmount: 340,
    status: 'DELIVERED',
    shippingName: 'Nguyen Van A',
    shippingPhone: '0901234567',
    shippingEmail: 'nguyenvana@gmail.com',
    shippingAddress: '123 Nguyen Hue, District 1, Ho Chi Minh City',
    paymentMethod: 'SE_PAY',
    paymentTransactionId: 'TXN123456',
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-22T15:30:00Z',
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-002',
    customer: {
      id: 'c2',
      name: 'Tran Thi B',
      email: 'tranthib@gmail.com',
      phone: '0912345678',
    },
    items: [
      {
        id: 'i3',
        productName: 'Jordan 1 Retro High',
        productImage:
          'https://images.unsplash.com/photo-1597045566677-8cf032ed6634?w=400',
        size: '40',
        color: 'Red/Black',
        quantity: 1,
        price: 170,
      },
    ],
    totalAmount: 170,
    status: 'SHIPPED',
    shippingName: 'Tran Thi B',
    shippingPhone: '0912345678',
    shippingEmail: 'tranthib@gmail.com',
    shippingAddress: '456 Le Loi, District 3, Ho Chi Minh City',
    paymentMethod: 'CREDIT_CARD',
    paymentTransactionId: 'TXN789012',
    createdAt: '2024-01-21T14:00:00Z',
    updatedAt: '2024-01-23T09:00:00Z',
  },
  {
    id: '3',
    orderNumber: 'ORD-2024-003',
    customer: {
      id: 'c3',
      name: 'Le Van C',
      email: 'levanc@gmail.com',
      phone: '0923456789',
    },
    items: [
      {
        id: 'i4',
        productName: 'New Balance 990v5',
        productImage:
          'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400',
        size: '43',
        color: 'Grey',
        quantity: 2,
        price: 185,
      },
    ],
    totalAmount: 370,
    status: 'PROCESSING',
    shippingName: 'Le Van C',
    shippingPhone: '0923456789',
    shippingEmail: 'levanc@gmail.com',
    shippingAddress: '789 Hai Ba Trung, District 1, Ho Chi Minh City',
    paymentMethod: 'COD',
    notes: 'Please call before delivery',
    createdAt: '2024-01-22T09:00:00Z',
    updatedAt: '2024-01-22T11:00:00Z',
  },
  {
    id: '4',
    orderNumber: 'ORD-2024-004',
    customer: {
      id: 'c4',
      name: 'Pham Thi D',
      email: 'phamthid@gmail.com',
      phone: '0934567890',
    },
    items: [
      {
        id: 'i5',
        productName: 'Puma RS-X',
        productImage:
          'https://images.unsplash.com/photo-1608379743498-fa39e1ca79b2?w=400',
        size: '38',
        color: 'White',
        quantity: 1,
        price: 110,
      },
    ],
    totalAmount: 110,
    status: 'PLACED',
    shippingName: 'Pham Thi D',
    shippingPhone: '0934567890',
    shippingEmail: 'phamthid@gmail.com',
    shippingAddress: '321 Vo Van Tan, District 3, Ho Chi Minh City',
    paymentMethod: 'SE_PAY',
    createdAt: '2024-01-23T08:00:00Z',
    updatedAt: '2024-01-23T08:00:00Z',
  },
  {
    id: '5',
    orderNumber: 'ORD-2024-005',
    customer: {
      id: 'c5',
      name: 'Hoang Van E',
      email: 'hoangvane@gmail.com',
      phone: '0945678901',
    },
    items: [
      {
        id: 'i6',
        productName: 'Nike Air Max 270',
        productImage:
          'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
        size: '44',
        color: 'White',
        quantity: 1,
        price: 150,
      },
    ],
    totalAmount: 150,
    status: 'CANCELLED',
    shippingName: 'Hoang Van E',
    shippingPhone: '0945678901',
    shippingEmail: 'hoangvane@gmail.com',
    shippingAddress: '654 Nguyen Trai, District 5, Ho Chi Minh City',
    paymentMethod: 'CREDIT_CARD',
    notes: 'Cancelled by customer',
    createdAt: '2024-01-19T16:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z',
  },
];

export const statusOptions = [
  { value: 'PLACED', label: 'Placed' },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'PROCESSING', label: 'Processing' },
  { value: 'SHIPPED', label: 'Shipped' },
  { value: 'DELIVERED', label: 'Delivered' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

export const paymentMethodOptions = [
  { value: 'SE_PAY', label: 'SE Pay' },
  { value: 'CREDIT_CARD', label: 'Credit Card' },
  { value: 'COD', label: 'Cash on Delivery' },
];
