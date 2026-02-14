import { useLoaderData } from 'react-router';
import { User, Mail, Phone, Calendar, Image, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useUserDetailQuery } from '@/features/user/hooks';

type ProfileLoaderData = Awaited<
  ReturnType<ReturnType<typeof import('./profileLoader').profileLoader>>
>;

interface InfoRowProps {
  icon: React.ElementType;
  label: string;
  value: string | null | undefined;
}

function InfoRow({ icon: Icon, label, value }: InfoRowProps) {
  const { t } = useTranslation();
  return (
    <div className='flex items-start gap-3 py-2'>
      <Icon className='mt-0.5 h-4 w-4 text-muted-foreground' />
      <div className='flex-1'>
        <p className='text-sm font-medium text-muted-foreground'>{label}</p>
        <p className='mt-0.5 font-mono text-sm'>
          {value || t('profile.common.notAvailable', 'N/A')}
        </p>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  const loaderData = useLoaderData() as ProfileLoaderData;
  const { keycloakId } = loaderData;
  const { data: user } = useUserDetailQuery(keycloakId);
  const { t } = useTranslation();

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleString('vi-VN');
  };

  return (
    <div className='mx-auto max-w-4xl px-4 py-8'>
      <div className='mb-6'>
        <h1 className='text-3xl font-bold'>
          {t('profile.title', 'Hồ sơ của bạn')}
        </h1>
        <p className='mt-2 text-muted-foreground'>
          {t('profile.subtitle', 'Thông tin tài khoản từ hệ thống')}
        </p>
      </div>

      <div className='space-y-6'>
        {/* User Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>
              {t('profile.personalInfo.title', 'Thông tin cá nhân')}
            </CardTitle>
            <CardDescription>
              {t(
                'profile.personalInfo.description',
                'Thông tin cơ bản từ hệ thống'
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-2'>
            <InfoRow
              icon={User}
              label={t('profile.personalInfo.username', 'Tên người dùng')}
              value={user.username}
            />
            <InfoRow
              icon={Mail}
              label={t('profile.personalInfo.email', 'Email')}
              value={user.email}
            />
            <InfoRow
              icon={Phone}
              label={t('profile.personalInfo.phone', 'Số điện thoại')}
              value={user.phoneNumber}
            />
            <InfoRow
              icon={Calendar}
              label={t('profile.personalInfo.dateOfBirth', 'Ngày sinh')}
              value={user.dateOfBirth}
            />
            <InfoRow
              icon={Image}
              label={t('profile.personalInfo.avatar', 'Ảnh đại diện')}
              value={user.avatarUrl}
            />
            <InfoRow
              icon={Clock}
              label={t('profile.personalInfo.lastSeen', 'Lần cuối truy cập')}
              value={formatDate(user.lastSeenAt)}
            />
          </CardContent>
        </Card>

        {/* Keycloak ID Card */}
        <Card>
          <CardHeader>
            <CardTitle>
              {t('profile.accountInfo.title', 'Thông tin tài khoản')}
            </CardTitle>
            <CardDescription>
              {t('profile.accountInfo.description', 'ID định danh từ Keycloak')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <InfoRow
              icon={User}
              label={t('profile.accountInfo.keycloakId', 'Keycloak ID')}
              value={user.keycloakId}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
