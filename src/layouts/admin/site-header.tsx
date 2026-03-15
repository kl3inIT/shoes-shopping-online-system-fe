import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router';

import { LanguageToggle } from '@/components/language-toggle';
import { ModeToggle } from '@/components/mode-toggle';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { adminNavigationItems } from '@/layouts/admin/navigation.config';
import { SidebarTrigger } from '@/layouts/admin/sidebar';

export function SiteHeader() {
  const { t } = useTranslation();
  const location = useLocation();
  const pageTitle = useMemo(() => {
    const matchedItem = adminNavigationItems.find(
      (item) =>
        location.pathname === item.url ||
        (item.url !== '/admin' && location.pathname.startsWith(item.url))
    );

    if (matchedItem) {
      return t(matchedItem.titleKey, {
        defaultValue: matchedItem.defaultTitle,
      });
    }

    return t('admin.header.title', { defaultValue: 'Admin' });
  }, [location.pathname, t]);

  return (
    <header className='flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)'>
      <div className='flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6'>
        <SidebarTrigger className='-ml-1' />
        <Separator
          orientation='vertical'
          className='mx-2 data-[orientation=vertical]:h-4'
        />
        <h1 className='text-base font-medium'>{pageTitle}</h1>
        <div className='ml-auto flex items-center gap-2'>
          <Button
            variant='outline'
            asChild
            size='sm'
            className='hidden sm:flex'
          >
            <Link to='/'>
              {t('admin.header.viewStore', { defaultValue: 'View Store' })}
            </Link>
          </Button>
          <ModeToggle />
          <LanguageToggle />
        </div>
      </div>
    </header>
  );
}
