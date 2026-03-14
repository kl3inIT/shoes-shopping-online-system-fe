import * as React from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { IconShoe } from '@tabler/icons-react';
import { useAuth } from 'react-oidc-context';

import { useAuthorizedItems } from '@/features/auth';
import { NavMain } from '@/layouts/admin/nav-main';
import { adminNavigationItems } from '@/layouts/admin/navigation.config';
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
  const auth = useAuth();
  const visibleNavItems = useAuthorizedItems(adminNavigationItems);

  const user = {
    name:
      auth.user?.profile.name?.toString() ||
      auth.user?.profile.preferred_username?.toString() ||
      'User',
    email: auth.user?.profile.email?.toString() || '',
    avatar: '',
  };

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
        <NavMain
          items={visibleNavItems.map((item) => ({
            title: t(item.titleKey, { defaultValue: item.defaultTitle }),
            url: item.url,
            icon: item.icon,
          }))}
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
