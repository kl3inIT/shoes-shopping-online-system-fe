import { useAuth } from 'react-oidc-context';
import { Outlet, useLocation } from 'react-router';
import { Loader2, ShieldAlert } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function ProtectedRoute() {
  const auth = useAuth();
  const location = useLocation();

  // Loading state
  if (auth.isLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-muted/20'>
        <Card className='w-full max-w-md'>
          <CardContent className='pt-6 text-center'>
            <Loader2 className='mx-auto mb-4 h-12 w-12 animate-spin text-primary' />
            <p className='text-lg font-medium'>Đang tải...</p>
            <p className='mt-2 text-sm text-muted-foreground'>
              Đang kiểm tra quyền truy cập
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
              <AlertTitle>Lỗi xác thực</AlertTitle>
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
              Đang chuyển đến trang đăng nhập...
            </p>
            <p className='mt-2 text-sm text-muted-foreground'>
              Bạn sẽ quay lại trang này sau khi đăng nhập
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Authenticated - render nested routes
  return <Outlet />;
}
