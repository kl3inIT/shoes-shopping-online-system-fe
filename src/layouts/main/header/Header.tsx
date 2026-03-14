import { Menu, X, ShoppingCart, Heart, Bell } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useQueryCart } from '@/features/cart';
import { useQueryWishlist } from '@/features/wishlist';
import { LanguageToggle } from '@/components/language-toggle';
import { ModeToggle } from '@/components/mode-toggle';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { UserMenu } from './UserMenu';
import { useIsMobile } from '@/hooks/useMobile';
import { NotificationList } from '@/features/notifications/components';
import {
  useUserNotifications,
  useMarkNotificationAsRead,
} from '@/features/notifications/api/userNotificationApi';
import { useAuth } from 'react-oidc-context';

export function Header() {
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const auth = useAuth();

  const isMenuOpen = isMobile && mobileMenuOpen;

  const { data: cartData } = useQueryCart();
  const { data: wishlistData } = useQueryWishlist();
  const cartItemCount = cartData?.items.length ?? 0;
  const wishlistCount = wishlistData?.length ?? 0;

  const { data: notifications = [] } = useUserNotifications();
  const markAsReadMutation = useMarkNotificationAsRead();

  const mainNavigation = [
    { to: '/', label: t('nav.home') },
    { to: '/products', label: t('nav.products', { defaultValue: 'Products' }) },
    { to: '/about', label: t('nav.about', { defaultValue: 'About' }) },
  ];

  const handleCartClick = () => navigate('/cart');
  const handleWishlistClick = () => navigate('/wishlist');

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
            {/* Notifications */}
            {auth.isAuthenticated && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='relative hidden sm:flex'
                  >
                    <Bell className='h-5 w-5' />
                    {notifications.some((n) => !n.isRead) && (
                      <Badge
                        variant='destructive'
                        className='absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs'
                      >
                        {
                          notifications.filter(
                            (notification) => !notification.isRead
                          ).length
                        }
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align='end'
                  className='w-[360px] p-0'
                  sideOffset={8}
                >
                  <NotificationList
                    notifications={notifications}
                    maxHeight={400}
                    onMarkAsRead={(id) => {
                      const notification = notifications.find(
                        (n) => n.id === id
                      );
                      if (notification && !notification.isRead) {
                        markAsReadMutation.mutate(id);
                      }
                    }}
                  />
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Wishlist Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='ghost'
                  size='icon'
                  className='relative hidden sm:flex'
                  onClick={handleWishlistClick}
                >
                  <Heart className='h-5 w-5' />
                  {wishlistCount > 0 && (
                    <Badge
                      variant='destructive'
                      className='absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs'
                    >
                      {wishlistCount}
                    </Badge>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{t('nav.wishlist')}</TooltipContent>
            </Tooltip>

            {/* Cart Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='ghost'
                  size='icon'
                  className='relative'
                  onClick={handleCartClick}
                >
                  <ShoppingCart className='h-5 w-5' />
                  {cartItemCount > 0 && (
                    <Badge
                      variant='destructive'
                      className='absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs'
                    >
                      {cartItemCount}
                    </Badge>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{t('nav.cart')}</TooltipContent>
            </Tooltip>

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
