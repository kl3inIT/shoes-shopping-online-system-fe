import { useAuth } from 'react-oidc-context';
import { Outlet, useLocation } from 'react-router';
import { Loader2, ShieldAlert } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useTranslation } from 'react-i18next';

export function ProtectedRoute() {
  const auth = useAuth();
  const location = useLocation();
  const { t } = useTranslation();

  // Loading state
  if (auth.isLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-muted/20'>
        <Card className='w-full max-w-md'>
          <CardContent className='pt-6 text-center'>
            <Loader2 className='mx-auto mb-4 h-12 w-12 animate-spin text-primary' />
            <p className='text-lg font-medium'>
              {t('auth.protected.loadingTitle', 'Đang tải...')}
            </p>
            <p className='mt-2 text-sm text-muted-foreground'>
              {t(
                'auth.protected.loadingSubtitle',
                'Đang kiểm tra quyền truy cập'
              )}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (auth.error) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-muted/20 p-4'>
        <Card className='w-full max-w-md'>
          <CardContent className='pt-6'>
            <Alert variant='destructive'>
              <ShieldAlert className='h-4 w-4' />
              <AlertTitle>
                {t('auth.protected.errorTitle', 'Lỗi xác thực')}
              </AlertTitle>
              <AlertDescription>{auth.error.message}</AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Not authenticated - redirect to login with returnTo
  if (!auth.isAuthenticated) {
    void auth.signinRedirect({
      state: { returnTo: location.pathname + location.search },
    });

    return (
      <div className='flex min-h-screen items-center justify-center bg-muted/20'>
        <Card className='w-full max-w-md'>
          <CardContent className='pt-6 text-center'>
            <Loader2 className='mx-auto mb-4 h-12 w-12 animate-spin text-primary' />
            <p className='text-lg font-medium'>
              {t(
                'auth.protected.redirectTitle',
                'Đang chuyển đến trang đăng nhập...'
              )}
            </p>
            <p className='mt-2 text-sm text-muted-foreground'>
              {t(
                'auth.protected.redirectSubtitle',
                'Bạn sẽ quay lại trang này sau khi đăng nhập'
              )}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Authenticated - render nested routes
  return <Outlet />;
}
