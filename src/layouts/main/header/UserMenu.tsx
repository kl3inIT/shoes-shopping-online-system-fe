import {
  LogIn,
  LogOut,
  User,
  UserCircle,
  UserPlus,
  Package,
  Heart,
  ShoppingCart,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'react-oidc-context';
import { Link } from 'react-router';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type UserMenuProps = {
  mobile?: boolean;
  onAfterAction?: () => void;
};

function getDisplayName(auth: ReturnType<typeof useAuth>) {
  if (!auth.user) return 'User';
  return (
    auth.user.profile.name ||
    auth.user.profile.preferred_username ||
    auth.user.profile.email ||
    'User'
  );
}

export function UserMenu({ mobile = false, onAfterAction }: UserMenuProps) {
  const auth = useAuth();
  const { t } = useTranslation();

  const handleLogin = () => {
    void auth.signinRedirect();
    onAfterAction?.();
  };

  const handleRegister = () => {
    // Keycloak supports `kc_action=register` to open the registration screen.
    // `extraQueryParams` is supported by oidc-client-ts via react-oidc-context.
    void auth.signinRedirect({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      extraQueryParams: { kc_action: 'register' } as any,
    });
    onAfterAction?.();
  };

  const handleLogout = () => {
    void auth.signoutRedirect();
    onAfterAction?.();
  };

  if (auth.isLoading) {
    return mobile ? (
      <div className='flex items-center justify-center px-3 py-2'>
        <div className='h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent' />
      </div>
    ) : (
      <div className='h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent' />
    );
  }

  if (!auth.isAuthenticated || !auth.user) {
    return mobile ? (
      <div className='flex flex-col gap-2'>
        <Button
          onClick={handleLogin}
          className='w-full justify-start'
          size='sm'
        >
          <LogIn className='mr-2 h-4 w-4' />
          {t('auth.login', { defaultValue: 'Đăng nhập' })}
        </Button>
        <Button
          onClick={handleRegister}
          variant='outline'
          className='w-full justify-start'
          size='sm'
        >
          <UserPlus className='mr-2 h-4 w-4' />
          {t('auth.register', { defaultValue: 'Đăng ký' })}
        </Button>
      </div>
    ) : (
      <div className='flex items-center gap-2'>
        <Button onClick={handleLogin} size='sm' className='gap-2'>
          <LogIn className='h-4 w-4' />
          <span className='hidden sm:inline-block'>
            {t('auth.login', { defaultValue: 'Đăng nhập' })}
          </span>
        </Button>
        <Button
          onClick={handleRegister}
          size='sm'
          variant='outline'
          className='gap-2'
        >
          <UserPlus className='h-4 w-4' />
          <span className='hidden sm:inline-block'>
            {t('auth.register', { defaultValue: 'Đăng ký' })}
          </span>
        </Button>
      </div>
    );
  }

  const displayName = getDisplayName(auth);
  const keycloakId = auth.user.profile.sub as string | undefined;
  const profilePath = keycloakId ? `/profile/${keycloakId}` : '/';

  return mobile ? (
    <>
      <div className='px-3 py-2 text-sm'>
        <p className='font-medium'>{displayName}</p>
        {auth.user.profile.email && (
          <p className='text-xs text-muted-foreground'>
            {auth.user.profile.email}
          </p>
        )}
      </div>
      <Button
        asChild
        variant='ghost'
        className='w-full justify-start'
        size='sm'
        onClick={onAfterAction}
      >
        <Link to={profilePath}>
          <UserCircle className='mr-2 h-4 w-4' />
          {t('auth.profile', { defaultValue: 'Hồ sơ' })}
        </Link>
      </Button>
      <Button
        asChild
        variant='ghost'
        className='w-full justify-start'
        size='sm'
        onClick={onAfterAction}
      >
        <Link to='/orders'>
          <Package className='mr-2 h-4 w-4' />
          {t('nav.orders', { defaultValue: 'Đơn hàng' })}
        </Link>
      </Button>
      <Button
        asChild
        variant='ghost'
        className='w-full justify-start'
        size='sm'
        onClick={onAfterAction}
      >
        <Link to='/wishlist'>
          <Heart className='mr-2 h-4 w-4' />
          {t('nav.wishlist', { defaultValue: 'Yêu thích' })}
        </Link>
      </Button>
      <Button
        asChild
        variant='ghost'
        className='w-full justify-start'
        size='sm'
        onClick={onAfterAction}
      >
        <Link to='/cart'>
          <ShoppingCart className='mr-2 h-4 w-4' />
          {t('nav.cart', { defaultValue: 'Giỏ hàng' })}
        </Link>
      </Button>
      <Button
        onClick={handleLogout}
        variant='outline'
        className='w-full justify-start'
        size='sm'
      >
        <LogOut className='mr-2 h-4 w-4' />
        {t('auth.logout', { defaultValue: 'Đăng xuất' })}
      </Button>
    </>
  ) : (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' size='sm' className='gap-2'>
          <User className='h-4 w-4' />
          <span className='hidden sm:inline-block'>{displayName}</span>
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
        <DropdownMenuItem asChild className='cursor-pointer'>
          <Link to={profilePath}>
            <UserCircle className='mr-2 h-4 w-4' />
            <span>{t('auth.profile', { defaultValue: 'Hồ sơ' })}</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className='cursor-pointer'>
          <Link to='/orders'>
            <Package className='mr-2 h-4 w-4' />
            <span>{t('nav.orders', { defaultValue: 'Đơn hàng' })}</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className='cursor-pointer'>
          <Link to='/wishlist'>
            <Heart className='mr-2 h-4 w-4' />
            <span>{t('nav.wishlist', { defaultValue: 'Yêu thích' })}</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className='cursor-pointer'>
          <Link to='/cart'>
            <ShoppingCart className='mr-2 h-4 w-4' />
            <span>{t('nav.cart', { defaultValue: 'Giỏ hàng' })}</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className='cursor-pointer'>
          <LogOut className='mr-2 h-4 w-4' />
          <span>{t('auth.logout', { defaultValue: 'Đăng xuất' })}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
