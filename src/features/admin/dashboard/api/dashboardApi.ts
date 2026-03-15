import { useQuery } from '@tanstack/react-query';
import apiClient from '@/features/apiClient';
import { type ApiSuccessResponse } from '@/types/apiTypes';

export interface DashboardMetrics {
  totalRevenue: number;
  totalCustomers: number;
  totalOrders: number;
  productsSold: number;
}

export interface DashboardChartPoint {
  date: string; // ISO date string
  revenue: number;
  profit: number;
}

export interface DashboardRecentOrder {
  id: string;
  orderCode: string;
  customerName: string;
  createdAt: string;
  totalAmount: number;
  status: string;
}

export interface DashboardTopSelling {
  productName: string;
  categoryName: string;
  totalSold: number;
  currentStock: number;
}

export interface DashboardLowStock {
  productName: string;
  size: string;
  remaining: number;
  status: string;
}

export const dashboardKeys = {
  metrics: ['admin', 'dashboard', 'metrics'] as const,
  chart: (days: number) => ['admin', 'dashboard', 'chart', days] as const,
  recentOrders: ['admin', 'dashboard', 'recent-orders'] as const,
  topSelling: ['admin', 'dashboard', 'top-selling'] as const,
  lowStock: ['admin', 'dashboard', 'low-stock'] as const,
};

export const useDashboardMetrics = () => {
  return useQuery({
    queryKey: dashboardKeys.metrics,
    queryFn: async () => {
      const res = await apiClient.get<ApiSuccessResponse<DashboardMetrics>>(
        '/api/v1/admin/dashboard/metrics'
      );
      return res.data.data;
    },
  });
};

export const useDashboardChart = (days: number) => {
  return useQuery({
    queryKey: dashboardKeys.chart(days),
    queryFn: async () => {
      const res = await apiClient.get<
        ApiSuccessResponse<DashboardChartPoint[]>
      >('/api/v1/admin/dashboard/chart', {
        params: { days },
      });
      return res.data.data;
    },
  });
};

export const useDashboardRecentOrders = () => {
  return useQuery({
    queryKey: dashboardKeys.recentOrders,
    queryFn: async () => {
      const res = await apiClient.get<
        ApiSuccessResponse<DashboardRecentOrder[]>
      >('/api/v1/admin/dashboard/recent-orders', {
        params: { limit: 10 },
      });
      return res.data.data;
    },
  });
};

export const useDashboardTopSelling = () => {
  return useQuery({
    queryKey: dashboardKeys.topSelling,
    queryFn: async () => {
      const res = await apiClient.get<
        ApiSuccessResponse<DashboardTopSelling[]>
      >('/api/v1/admin/dashboard/top-selling', {
        params: { limit: 10 },
      });
      return res.data.data;
    },
  });
};

export const useDashboardLowStock = () => {
  return useQuery({
    queryKey: dashboardKeys.lowStock,
    queryFn: async () => {
      const res = await apiClient.get<ApiSuccessResponse<DashboardLowStock[]>>(
        '/api/v1/admin/dashboard/low-stock',
        {
          params: { threshold: 5 },
        }
      );
      return res.data.data;
    },
  });
};
