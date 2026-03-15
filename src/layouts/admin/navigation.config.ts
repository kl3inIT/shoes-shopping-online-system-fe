import {
  IconBell,
  IconBrandProducthunt,
  IconCategory,
  IconDashboard,
  IconHelp,
  IconPackage,
  IconSettings,
  IconShoe,
  IconStar,
  IconUserCircle,
  IconUserCog,
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

export const adminPrimaryNavigationItems: readonly AdminNavigationItem[] = [
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
    titleKey: 'admin.nav.notifications',
    defaultTitle: 'Notifications',
    url: '/admin/notifications',
    icon: IconBell,
    requirement: PERMISSIONS.notificationsManage,
  },
  {
    titleKey: 'admin.nav.users',
    defaultTitle: 'Users',
    url: '/admin/users',
    icon: IconUserCog,
    requirement: PERMISSIONS.usersManage,
  },
  {
    titleKey: 'admin.nav.ai',
    defaultTitle: 'AI',
    url: '/admin/ai',
    icon: IconHelp,
    requirement: PERMISSIONS.aiManage,
  },
] as const;

export const adminSecondaryNavigationItems: readonly AdminNavigationItem[] = [
  {
    titleKey: 'admin.nav.settings',
    defaultTitle: 'Settings',
    url: '/admin/settings',
    icon: IconSettings,
    requirement: PERMISSIONS.dashboardView,
  },
  {
    titleKey: 'admin.nav.account',
    defaultTitle: 'Account',
    url: '/admin/account',
    icon: IconUserCircle,
    requirement: PERMISSIONS.dashboardView,
  },
] as const;

export const adminNavigationItems: readonly AdminNavigationItem[] = [
  ...adminPrimaryNavigationItems,
  ...adminSecondaryNavigationItems,
] as const;
