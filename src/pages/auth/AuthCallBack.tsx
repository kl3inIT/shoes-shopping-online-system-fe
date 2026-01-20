import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from 'react-oidc-context';

export default function AuthCallback() {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // react-oidc-context tự động xử lý callback khi có code/state params
    // Chờ quá trình xử lý hoàn tất
    if (!auth.isLoading) {
      if (auth.isAuthenticated) {
        // Đăng nhập thành công, redirect về home
        navigate('/', { replace: true });
      } else if (auth.error) {
        // Có lỗi, redirect về home với thông báo lỗi
        console.error('[Auth] Signin callback error:', auth.error);
        navigate('/', { replace: true });
      }
    }
  }, [auth.isLoading, auth.isAuthenticated, auth.error, navigate]);

  // Hiển thị loading state trong khi xử lý callback
  return (
    <div className='flex min-h-screen items-center justify-center'>
      <div className='text-center'>
        <div className='mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent' />
        <p className='text-muted-foreground'>Đang xử lý đăng nhập...</p>
      </div>
    </div>
  );
}
