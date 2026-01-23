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

const Page500 = () => {
  const { t } = useTranslation();

  return (
    <div className='flex min-h-screen items-center justify-center bg-background px-4'>
      <Card className='max-w-xl w-full text-center'>
        <CardHeader>
          <CardTitle className='text-4xl font-bold tracking-tight'>
            {t('error.page.500.title', 'Đã xảy ra lỗi')}
          </CardTitle>
          <CardDescription className='text-lg'>
            {t(
              'error.page.500.description',
              'Có lỗi không mong muốn xảy ra khi xử lý yêu cầu của bạn.'
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className='flex flex-col items-center gap-4'>
          <p className='text-muted-foreground'>
            {t(
              'error.page.500.hint',
              'Vui lòng thử tải lại trang hoặc quay lại trang chủ. Nếu lỗi vẫn tiếp diễn, hãy liên hệ bộ phận hỗ trợ.'
            )}
          </p>
          <div className='flex gap-3'>
            <Button variant='outline' onClick={() => window.location.reload()}>
              {t('error.page.500.reload', 'Tải lại trang')}
            </Button>
            <Button asChild>
              <Link to='/'>{t('error.page.500.backHome', 'Về trang chủ')}</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page500;
