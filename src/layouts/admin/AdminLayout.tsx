import * as React from 'react';
import { Outlet } from 'react-router';
import { AppSidebar } from '@/layouts/admin/app-sidebar';
import { SiteHeader } from '@/layouts/admin/site-header';
import { SidebarInset, SidebarProvider } from '@/layouts/admin/sidebar';

export function AdminLayout() {
  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 72)',
          '--header-height': 'calc(var(--spacing) * 12)',
        } as React.CSSProperties
      }
    >
      <AppSidebar variant='inset' />
      <SidebarInset>
        <SiteHeader />
        <div className='flex flex-1 flex-col'>
          <div className='@container/main flex flex-1 flex-col gap-2'>
            <div className='flex flex-col gap-4 py-4 md:gap-6 md:py-6'>
              <Outlet />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
