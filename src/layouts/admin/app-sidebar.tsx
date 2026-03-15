import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { IconShoe } from '@tabler/icons-react';
import { useAuth } from 'react-oidc-context';
import { Link } from 'react-router';

import { useAuthorizedItems } from '@/features/auth';
import { getMeQueryOptions } from '@/features/user/queryOptions';
import { NavMain } from '@/layouts/admin/nav-main';
import { adminPrimaryNavigationItems } from '@/layouts/admin/navigation.config';
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
  const visiblePrimaryItems = useAuthorizedItems(adminPrimaryNavigationItems);
  const { data: me } = useQuery({
    ...getMeQueryOptions(),
    enabled: auth.isAuthenticated,
  });

  const user = {
    name:
      auth.user?.profile.name?.toString() ||
      auth.user?.profile.preferred_username?.toString() ||
      'User',
    email: auth.user?.profile.email?.toString() || '',
    avatar:
      me?.avatarUrl ||
      auth.user?.profile.picture?.toString() ||
      auth.user?.profile.avatar_url?.toString() ||
      auth.user?.profile.avatarUrl?.toString() ||
      undefined,
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
          items={visiblePrimaryItems.map((item) => ({
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
