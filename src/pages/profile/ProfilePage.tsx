import { useAuth } from 'react-oidc-context';
import { User, Mail, AtSign, KeyRound, Clock, Shield } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function ProfilePage() {
  const auth = useAuth();
  const user = auth.user;

  const InfoRow = ({
    icon: Icon,
    label,
    value,
  }: {
    icon: React.ElementType;
    label: string;
    value: string | undefined;
  }) => (
    <div className='flex items-start gap-3 py-2'>
      <Icon className='mt-0.5 h-4 w-4 text-muted-foreground' />
      <div className='flex-1'>
        <p className='text-sm font-medium text-muted-foreground'>{label}</p>
        <p className='mt-0.5 font-mono text-sm'>{value || 'N/A'}</p>
      </div>
    </div>
  );

  return (
    <div className='mx-auto max-w-4xl px-4 py-8'>
      <div className='mb-6'>
        <h1 className='text-3xl font-bold'>Hồ sơ của bạn</h1>
        <p className='mt-2 text-muted-foreground'>
          Thông tin tài khoản và xác thực
        </p>
      </div>

      <div className='space-y-6'>
        {/* User Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>Thông tin cá nhân</CardTitle>
            <CardDescription>
              Thông tin cơ bản từ nhà cung cấp xác thực
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-2'>
            <InfoRow icon={User} label='Tên' value={user?.profile.name} />
            <InfoRow icon={Mail} label='Email' value={user?.profile.email} />
            <InfoRow
              icon={AtSign}
              label='Username'
              value={user?.profile.preferred_username}
            />
            <InfoRow
              icon={KeyRound}
              label='User ID'
              value={user?.profile.sub}
            />
          </CardContent>
        </Card>

        {/* Token Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>Thông tin Token</CardTitle>
            <CardDescription>
              Chi tiết về phiên đăng nhập hiện tại
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-2'>
            <InfoRow
              icon={Clock}
              label='Hết hạn lúc'
              value={
                user?.expires_at
                  ? new Date(user.expires_at * 1000).toLocaleString('vi-VN')
                  : undefined
              }
            />
            <InfoRow
              icon={Shield}
              label='Token type'
              value={user?.token_type}
            />
            <div className='flex items-start gap-3 py-2'>
              <Shield className='mt-0.5 h-4 w-4 text-muted-foreground' />
              <div className='flex-1'>
                <p className='text-sm font-medium text-muted-foreground'>
                  Scopes
                </p>
                <p className='mt-0.5 text-sm'>{user?.scope || 'N/A'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Debug Info (only in dev) */}
        {import.meta.env.DEV && (
          <Card>
            <CardHeader>
              <CardTitle>Debug: Full User Object</CardTitle>
              <CardDescription>Chỉ hiển thị ở môi trường dev</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className='overflow-auto rounded-lg bg-muted p-4 text-xs'>
                {JSON.stringify(user, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
