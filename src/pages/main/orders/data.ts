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
    status: 'SHIPPED' as OrderStatus,
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
    status: 'DELIVERED' as OrderStatus,
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
    status: 'CONFIRMED' as OrderStatus,
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
    status: 'CANCELLED' as OrderStatus,
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
    status: 'PENDING_PAYMENT' as OrderStatus,
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

/** Thứ tự trạng thái để hiển thị timeline (bỏ qua trạng thái kết thúc/hủy). */
const TIMELINE_STATUS_ORDER: OrderStatus[] = [
  'PENDING_PAYMENT',
  'PAID',
  'CONFIRMED',
  'SHIPPED',
  'DELIVERED',
];

type TranslateFn = (key: string) => string;

export const getOrderTimeline = (
  status: OrderStatus,
  t: TranslateFn
): TimelineStep[] => {
  const baseSteps: TimelineStep[] = [
    {
      id: 'order_placed',
      title: t('orders.timeline.orderPlaced'),
      description: t('orders.timeline.orderPlacedDesc'),
      timestamp: '',
      status: 'completed',
    },
    {
      id: 'paid',
      title: t('orders.timeline.paid'),
      description: t('orders.timeline.paidDesc'),
      timestamp: '',
      status: 'upcoming',
    },
    {
      id: 'confirmed',
      title: t('orders.timeline.confirmed'),
      description: t('orders.timeline.confirmedDesc'),
      timestamp: '',
      status: 'upcoming',
    },
    {
      id: 'shipped',
      title: t('orders.timeline.shipped'),
      description: t('orders.timeline.shippedDesc'),
      timestamp: '',
      status: 'upcoming',
    },
    {
      id: 'delivered',
      title: t('orders.timeline.delivered'),
      description: t('orders.timeline.deliveredDesc'),
      status: 'upcoming',
    },
  ];

  const currentIndex = TIMELINE_STATUS_ORDER.indexOf(status);
  const stepIndex = currentIndex >= 0 ? currentIndex : 0;

  return baseSteps.map((step, index) => ({
    ...step,
    status:
      index < stepIndex
        ? 'completed'
        : index === stepIndex
          ? 'current'
          : 'upcoming',
  }));
};
