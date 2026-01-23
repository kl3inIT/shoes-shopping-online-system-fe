import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { useAuth } from 'react-oidc-context';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';

const Page403 = () => {
  const auth = useAuth();
  const { t } = useTranslation();
  const keycloakId = auth.user?.profile.sub as string | undefined;
  const profilePath = keycloakId ? `/profile/${keycloakId}` : '/';

  return (
    <div className='flex min-h-screen items-center justify-center bg-background px-4'>
      <Card className='max-w-xl w-full text-center'>
        <CardHeader>
          <CardTitle className='text-4xl font-bold tracking-tight'>
            {t('error.page.403.code', '403')}
          </CardTitle>
          <CardDescription className='text-lg'>
            {t(
              'error.page.403.description',
              'Bạn không có quyền truy cập trang này.'
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className='flex flex-col items-center gap-4'>
          <p className='text-muted-foreground'>
            {t(
              'error.page.403.hint',
              'Hãy đăng nhập với tài khoản có đủ quyền hoặc quay lại trang chủ.'
            )}
          </p>
          <div className='flex gap-3'>
            <Button asChild variant='outline'>
              <Link to='/'>{t('error.page.403.backHome', 'Về trang chủ')}</Link>
            </Button>
            <Button asChild>
              <Link to={profilePath}>
                {t('error.page.403.viewProfile', 'Xem hồ sơ của tôi')}
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page403;
