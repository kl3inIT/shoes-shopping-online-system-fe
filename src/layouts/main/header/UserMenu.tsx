import { LogIn, LogOut, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'react-oidc-context';

import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/useMobile';
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

export function UserMenu({ mobile, onAfterAction }: UserMenuProps) {
  const auth = useAuth();
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const isMobileView = mobile ?? isMobile;

  const handleLogin = () => {
    void auth.signinRedirect();
    onAfterAction?.();
  };

  const handleLogout = () => {
    void auth.signoutRedirect();
    onAfterAction?.();
  };

  if (auth.isLoading) {
    return isMobileView ? (
      <div className='flex items-center justify-center px-3 py-2'>
        <div className='h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent' />
      </div>
    ) : (
      <div className='h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent' />
    );
  }

  if (!auth.isAuthenticated || !auth.user) {
    return isMobileView ? (
      <Button onClick={handleLogin} className='w-full justify-start' size='sm'>
        <LogIn className='mr-2 h-4 w-4' />
        {t('auth.login', { defaultValue: 'Đăng nhập' })}
      </Button>
    ) : (
      <Button onClick={handleLogin} size='sm' className='gap-2'>
        <LogIn className='h-4 w-4' />
        <span className='hidden sm:inline-block'>
          {t('auth.login', { defaultValue: 'Đăng nhập' })}
        </span>
      </Button>
    );
  }

  const displayName = getDisplayName(auth);

  return isMobileView ? (
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
        <DropdownMenuItem onClick={handleLogout} className='cursor-pointer'>
          <LogOut className='mr-2 h-4 w-4' />
          <span>{t('auth.logout', { defaultValue: 'Đăng xuất' })}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
