import * as React from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  IconBox,
  IconBrandProducthunt,
  IconCategory,
  IconChartBar,
  IconDashboard,
  IconHelp,
  IconPackage,
  IconSearch,
  IconSettings,
  IconShoe,
  IconStar,
  IconUsers,
} from '@tabler/icons-react';

import { NavMain } from '@/layouts/admin/nav-main';
import { NavSecondary } from '@/layouts/admin/nav-secondary';
import { NavUser } from '@/layouts/admin/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/layouts/admin/sidebar';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { t } = useTranslation();

  const user = {
    name: 'Admin User',
    email: 'admin@ssos.com',
    avatar: '/avatars/admin.jpg',
  };

  const navMain = [
    {
      title: t('admin.nav.dashboard'),
      url: '/admin',
      icon: IconDashboard,
    },
    {
      title: t('admin.nav.products'),
      url: '/admin/products',
      icon: IconShoe,
    },
    {
      title: t('admin.nav.orders'),
      url: '/admin/orders',
      icon: IconPackage,
    },
    {
      title: t('admin.nav.customers'),
      url: '/admin/customers',
      icon: IconUsers,
    },
    {
      title: t('admin.nav.brands'),
      url: '/admin/brands',
      icon: IconBrandProducthunt,
    },
    {
      title: t('admin.nav.categories'),
      url: '/admin/categories',
      icon: IconCategory,
    },
    {
      title: t('admin.nav.reviews'),
      url: '/admin/reviews',
      icon: IconStar,
    },
    {
      title: t('admin.nav.inventory'),
      url: '/admin/inventory',
      icon: IconBox,
    },
    {
      title: t('admin.nav.analytics'),
      url: '/admin/analytics',
      icon: IconChartBar,
    },
  ];

  const navSecondary = [
    {
      title: t('admin.nav.settings'),
      url: '/admin/settings',
      icon: IconSettings,
    },
    {
      title: t('admin.nav.help'),
      url: '/admin/help',
      icon: IconHelp,
    },
    {
      title: t('admin.nav.search'),
      url: '#',
      icon: IconSearch,
    },
  ];

  return (
    <Sidebar collapsible='offcanvas' {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className='data-[slot=sidebar-menu-button]:!p-1.5'
            >
              <Link to='/admin'>
                <IconShoe className='!size-5' />
                <span className='text-base font-semibold'>
                  {t('appName')} Admin
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <NavSecondary items={navSecondary} className='mt-auto' />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
