import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from 'react-oidc-context';
import { AlertCircle, RefreshCw } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

export default function AuthCallback() {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.isAuthenticated) {
      const returnTo =
        (auth.user?.state as { returnTo?: string })?.returnTo || '/';
      void navigate(returnTo, { replace: true });
    }
  }, [auth.isAuthenticated, auth.user?.state, navigate]);

  // Loading state - đang xử lý callback
  if (auth.isLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-muted/20'>
        <Card className='w-full max-w-md'>
          <CardContent className='pt-6 text-center'>
            <div className='mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent' />
            <p className='text-lg font-medium'>Đang xử lý đăng nhập...</p>
            <p className='mt-2 text-sm text-muted-foreground'>
              Vui lòng chờ trong giây lát
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state - có lỗi khi callback
  if (auth.error) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-muted/20 p-4'>
        <Card className='w-full max-w-md'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <AlertCircle className='h-5 w-5 text-destructive' />
              Lỗi xác thực
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <Alert variant='destructive'>
              <AlertCircle className='h-4 w-4' />
              <AlertTitle>Không thể đăng nhập</AlertTitle>
              <AlertDescription>{auth.error.message}</AlertDescription>
            </Alert>

            <div className='flex gap-2'>
              <Button
                onClick={() => void auth.signinRedirect()}
                className='flex-1'
              >
                <RefreshCw className='mr-2 h-4 w-4' />
                Thử lại
              </Button>
              <Button
                onClick={() => {
                  void navigate('/', { replace: true });
                }}
                variant='outline'
                className='flex-1'
              >
                Về trang chủ
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Fallback - không nên đến đây vì useEffect sẽ redirect
  return null;
}
