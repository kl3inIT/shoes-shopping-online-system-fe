import type {
  OrderCardProps,
  OrderStatus,
  TimelineStep,
} from '@/features/orders';

export const mockOrders: Omit<
  OrderCardProps,
  'onViewDetails' | 'onTrackOrder' | 'onReorder'
>[] = [
  {
    id: 'order-1',
    orderNumber: 'ORD-2024-001234',
    status: 'shipped' as OrderStatus,
    createdAt: '2024-01-25T10:30:00Z',
    items: [
      {
        id: 'item-1',
        name: 'Nike Air Max 270',
        image:
          'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
        price: 150,
        size: '42',
        quantity: 1,
      },
      {
        id: 'item-2',
        name: 'Adidas Ultraboost 22',
        image:
          'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400',
        price: 190,
        size: '43',
        quantity: 1,
      },
    ],
    total: 373.4,
  },
  {
    id: 'order-2',
    orderNumber: 'ORD-2024-001198',
    status: 'delivered' as OrderStatus,
    createdAt: '2024-01-20T14:15:00Z',
    items: [
      {
        id: 'item-3',
        name: 'Converse Chuck Taylor',
        image:
          'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=400',
        price: 65,
        size: '41',
        quantity: 2,
      },
    ],
    total: 143.0,
  },
  {
    id: 'order-3',
    orderNumber: 'ORD-2024-001156',
    status: 'processing' as OrderStatus,
    createdAt: '2024-01-28T09:00:00Z',
    items: [
      {
        id: 'item-4',
        name: 'Jordan 1 Retro High',
        image:
          'https://images.unsplash.com/photo-1597045566677-8cf032ed6634?w=400',
        price: 170,
        size: '44',
        quantity: 1,
      },
    ],
    total: 187.0,
  },
  {
    id: 'order-4',
    orderNumber: 'ORD-2024-001089',
    status: 'cancelled' as OrderStatus,
    createdAt: '2024-01-15T16:45:00Z',
    items: [
      {
        id: 'item-5',
        name: 'Puma RS-X',
        image:
          'https://images.unsplash.com/photo-1608379743498-fa39e1ca79b2?w=400',
        price: 110,
        size: '40',
        quantity: 1,
      },
    ],
    total: 121.0,
  },
  {
    id: 'order-5',
    orderNumber: 'ORD-2024-000987',
    status: 'pending' as OrderStatus,
    createdAt: '2024-01-29T08:30:00Z',
    items: [
      {
        id: 'item-6',
        name: 'New Balance 990v5',
        image:
          'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400',
        price: 185,
        size: '42',
        quantity: 1,
      },
    ],
    total: 203.5,
  },
];

export const getOrderTimeline = (status: OrderStatus): TimelineStep[] => {
  const baseSteps: TimelineStep[] = [
    {
      id: 'order_placed',
      title: 'Order Placed',
      description: 'Your order has been placed successfully',
      timestamp: '2024-01-25T10:30:00Z',
      status: 'completed',
    },
    {
      id: 'processing',
      title: 'Processing',
      description: 'We are preparing your order',
      timestamp: '2024-01-25T14:00:00Z',
      status: 'completed',
    },
    {
      id: 'shipped',
      title: 'Shipped',
      description: 'Your order is on the way',
      timestamp: '2024-01-26T09:00:00Z',
      status: 'completed',
    },
    {
      id: 'out_for_delivery',
      title: 'Out for Delivery',
      description: 'Your order will be delivered today',
      status: 'current',
    },
    {
      id: 'delivered',
      title: 'Delivered',
      description: 'Order delivered successfully',
      status: 'upcoming',
    },
  ];

  const statusOrder: OrderStatus[] = [
    'pending',
    'processing',
    'shipped',
    'delivered',
  ];
  const currentIndex = statusOrder.indexOf(status);

  return baseSteps.map((step, index) => ({
    ...step,
    status:
      index < currentIndex
        ? 'completed'
        : index === currentIndex
          ? 'current'
          : 'upcoming',
  }));
};
