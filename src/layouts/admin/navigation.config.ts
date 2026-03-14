import {
  IconBrandProducthunt,
  IconCategory,
  IconDashboard,
  IconHelp,
  IconPackage,
  IconShoe,
  IconStar,
  IconUserCog,
  IconUsers,
  type Icon,
} from '@tabler/icons-react';

import { PERMISSIONS, type PermissionRequirement } from '@/features/auth';

export type AdminNavigationItem = {
  defaultTitle: string;
  icon: Icon;
  requirement: PermissionRequirement;
  titleKey: string;
  url: string;
};

export const adminNavigationItems: readonly AdminNavigationItem[] = [
  {
    titleKey: 'admin.nav.dashboard',
    defaultTitle: 'Dashboard',
    url: '/admin',
    icon: IconDashboard,
    requirement: PERMISSIONS.dashboardView,
  },
  {
    titleKey: 'admin.nav.products',
    defaultTitle: 'Products',
    url: '/admin/products',
    icon: IconShoe,
    requirement: PERMISSIONS.productsManage,
  },
  {
    titleKey: 'admin.nav.orders',
    defaultTitle: 'Orders',
    url: '/admin/orders',
    icon: IconPackage,
    requirement: PERMISSIONS.ordersManage,
  },
  {
    titleKey: 'admin.nav.users',
    defaultTitle: 'Users',
    url: '/admin/users',
    icon: IconUserCog,
    requirement: PERMISSIONS.usersManage,
  },
  {
    titleKey: 'admin.nav.customers',
    defaultTitle: 'Customers',
    url: '/admin/customers',
    icon: IconUsers,
    requirement: PERMISSIONS.usersManage,
  },
  {
    titleKey: 'admin.nav.brands',
    defaultTitle: 'Brands',
    url: '/admin/brands',
    icon: IconBrandProducthunt,
    requirement: PERMISSIONS.brandsManage,
  },
  {
    titleKey: 'admin.nav.categories',
    defaultTitle: 'Categories',
    url: '/admin/categories',
    icon: IconCategory,
    requirement: PERMISSIONS.categoriesManage,
  },
  {
    titleKey: 'admin.nav.reviews',
    defaultTitle: 'Reviews',
    url: '/admin/reviews',
    icon: IconStar,
    requirement: PERMISSIONS.reviewsModerate,
  },
  {
    titleKey: 'admin.nav.ai',
    defaultTitle: 'AI',
    url: '/admin/ai',
    icon: IconHelp,
    requirement: PERMISSIONS.aiManage,
  },
] as const;
