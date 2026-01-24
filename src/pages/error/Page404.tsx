import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';

const Page404 = () => {
  const { t } = useTranslation();

  return (
    <div className='flex min-h-screen items-center justify-center bg-background px-4'>
      <Card className='max-w-xl w-full text-center'>
        <CardHeader>
          <CardTitle className='text-4xl font-bold tracking-tight'>
            {t('error.page.404.code', '404')}
          </CardTitle>
          <CardDescription className='text-lg'>
            {t(
              'error.page.404.description',
              'Trang bạn tìm kiếm không tồn tại hoặc đã bị di chuyển.'
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className='flex flex-col items-center gap-4'>
          <p className='text-muted-foreground'>
            {t(
              'error.page.404.hint',
              'Hãy kiểm tra lại đường dẫn hoặc quay về trang chủ để tiếp tục mua sắm.'
            )}
          </p>
          <Button asChild size='lg' className='rounded-lg text-base'>
            <Link to='/'>{t('error.page.404.backHome', 'Về trang chủ')}</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page404;
