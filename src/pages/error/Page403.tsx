import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const Page403 = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const from =
    typeof location.state === 'object' &&
    location.state !== null &&
    'from' in location.state &&
    typeof location.state.from === 'string'
      ? location.state.from
      : undefined;

  return (
    <div className='flex min-h-screen items-center justify-center bg-background px-4'>
      <Card className='w-full max-w-xl text-center'>
        <CardHeader>
          <CardTitle className='text-4xl font-bold tracking-tight'>
            {t('error.page.403.code', '403')}
          </CardTitle>
          <CardDescription className='text-lg'>
            {t(
              'error.page.403.description',
              'You do not have permission to access this page.'
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className='flex flex-col items-center gap-4'>
          <p className='text-muted-foreground'>
            {t(
              'error.page.403.hint',
              'Try another account with the required access or go back to a page you can use.'
            )}
          </p>
          {from && (
            <p className='text-sm text-muted-foreground'>
              {t('error.page.403.from', {
                defaultValue: 'Requested page: {{path}}',
                path: from,
              })}
            </p>
          )}
          <div className='flex gap-3'>
            <Button asChild variant='outline'>
              <Link to='/'>{t('error.page.403.backHome', 'Back to home')}</Link>
            </Button>
            <Button asChild>
              <Link to='/profile'>
                {t('error.page.403.viewProfile', 'View my profile')}
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page403;
