import { LogIn, LogOut, Menu, User, X } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'react-oidc-context';

import { LanguageToggle } from '@/components/language-toggle';
import { ModeToggle } from '@/components/mode-toggle';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

export function Header() {
  const { t } = useTranslation();
  const auth = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const mainNavigation = [
    { to: '/', label: t('nav.home') },
    { to: '/products', label: t('nav.products', { defaultValue: 'Products' }) },
  ];

  const handleLogin = () => {
    void auth.signinRedirect();
  };

  const handleLogout = () => {
    void auth.signoutRedirect();
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'
      )}
    >
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
            {auth.isLoading ? (
              <div className='h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent' />
            ) : auth.isAuthenticated && auth.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='outline' size='sm' className='gap-2'>
                    <User className='h-4 w-4' />
                    <span className='hidden sm:inline-block'>
                      {auth.user.profile.name ||
                        auth.user.profile.preferred_username ||
                        auth.user.profile.email ||
                        'User'}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end' className='w-56'>
                  <DropdownMenuLabel>
                    <div className='flex flex-col space-y-1'>
                      <p className='text-sm font-medium leading-none'>
                        {auth.user.profile.name || 'User'}
                      </p>
                      {auth.user.profile.email && (
                        <p className='text-xs leading-none text-muted-foreground'>
                          {auth.user.profile.email}
                        </p>
                      )}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className='cursor-pointer'
                  >
                    <LogOut className='mr-2 h-4 w-4' />
                    <span>Đăng xuất</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={handleLogin} size='sm' className='gap-2'>
                <LogIn className='h-4 w-4' />
                <span className='hidden sm:inline-block'>Đăng nhập</span>
              </Button>
            )}
            <ModeToggle />
            <LanguageToggle />

            <Button
              className='md:hidden'
              onClick={() => setMobileMenuOpen((v) => !v)}
              size='icon'
              variant='ghost'
              aria-label='Toggle menu'
            >
              {mobileMenuOpen ? (
                <X className='h-5 w-5' />
              ) : (
                <Menu className='h-5 w-5' />
              )}
            </Button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
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
              {auth.isLoading ? (
                <div className='flex items-center justify-center px-3 py-2'>
                  <div className='h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent' />
                </div>
              ) : auth.isAuthenticated && auth.user ? (
                <>
                  <div className='px-3 py-2 text-sm'>
                    <p className='font-medium'>
                      {auth.user.profile.name ||
                        auth.user.profile.preferred_username ||
                        auth.user.profile.email ||
                        'User'}
                    </p>
                    {auth.user.profile.email && (
                      <p className='text-xs text-muted-foreground'>
                        {auth.user.profile.email}
                      </p>
                    )}
                  </div>
                  <Button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    variant='outline'
                    className='w-full justify-start'
                    size='sm'
                  >
                    <LogOut className='mr-2 h-4 w-4' />
                    Đăng xuất
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => {
                    handleLogin();
                    setMobileMenuOpen(false);
                  }}
                  className='w-full justify-start'
                  size='sm'
                >
                  <LogIn className='mr-2 h-4 w-4' />
                  Đăng nhập
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
