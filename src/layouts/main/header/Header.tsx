import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink } from 'react-router';
import { useTranslation } from 'react-i18next';

import { LanguageToggle } from '@/components/language-toggle';
import { ModeToggle } from '@/components/mode-toggle';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { UserMenu } from './UserMenu';
import { useIsMobile } from '@/hooks/useMobile';

export function Header() {
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const isMenuOpen = isMobile && mobileMenuOpen;

  const mainNavigation = [
    { to: '/', label: t('nav.home') },
    { to: '/products', label: t('nav.products', { defaultValue: 'Products' }) },
  ];

  return (
    <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='mx-auto max-w-6xl px-4'>
        <div className='flex h-16 items-center justify-between'>
          <div className='flex items-center gap-6'>
            <Link className='flex items-center gap-2' to='/'>
              <span className='bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-xl font-bold tracking-tight text-transparent'>
                {t('appName')}
              </span>
            </Link>

            <nav className='hidden md:flex'>
              <ul className='flex items-center gap-6'>
                {mainNavigation.map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      className={({ isActive }) =>
                        cn(
                          'text-sm font-medium transition-colors hover:text-primary',
                          isActive
                            ? 'font-semibold text-primary'
                            : 'text-muted-foreground'
                        )
                      }
                      end={item.to === '/'}
                    >
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className='flex items-center gap-2'>
            <UserMenu mobile={false} />
            <ModeToggle />
            <LanguageToggle />

            {isMobile && (
              <Button
                className='md:hidden'
                onClick={() => setMobileMenuOpen((v) => !v)}
                size='icon'
                variant='ghost'
                aria-label='Toggle menu'
              >
                {isMenuOpen ? (
                  <X className='h-5 w-5' />
                ) : (
                  <Menu className='h-5 w-5' />
                )}
              </Button>
            )}
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className='md:hidden'>
          <div className='space-y-1 border-b px-4 py-3'>
            {mainNavigation.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'block rounded-md px-3 py-2 text-base font-medium',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'hover:bg-muted/50 hover:text-primary'
                  )
                }
                end={item.to === '/'}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
            <div className='mt-2 border-t pt-2'>
              <UserMenu mobile onAfterAction={() => setMobileMenuOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
