import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'react-oidc-context';
import { ExternalLink, Settings, ShieldCheck, UserRound } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getAccessSnapshot } from '@/features/auth';
import { useLanguage } from '@/i18n/useLanguage';
import { useTheme } from '@/providers/ThemeProvider';

export default function AdminAccountPage() {
  const auth = useAuth();
  const { t } = useTranslation();
  const { current, languages } = useLanguage();
  const { theme } = useTheme();

  const displayName =
    auth.user?.profile.name?.toString() ||
    auth.user?.profile.preferred_username?.toString() ||
    auth.user?.profile.email?.toString() ||
    t('admin.account.fallbackName', { defaultValue: 'Admin user' });
  const avatarUrl = auth.user?.profile.picture?.toString() || '';
  const email = auth.user?.profile.email?.toString() || '-';
  const username =
    auth.user?.profile.preferred_username?.toString() ||
    auth.user?.profile.username?.toString() ||
    '-';
  const accessSnapshot = getAccessSnapshot(auth.user);
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');

  return (
    <div className='space-y-6 px-4 lg:px-6'>
      <div className='space-y-1'>
        <h1 className='text-2xl font-semibold tracking-tight'>
          {t('admin.account.title', { defaultValue: 'Account' })}
        </h1>
        <p className='text-sm text-muted-foreground'>
          {t('admin.account.subtitle', {
            defaultValue:
              'Review the admin identity currently signed in and jump to your related settings.',
          })}
        </p>
      </div>

      <div className='grid gap-6 xl:grid-cols-[1.15fr_0.85fr]'>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <UserRound className='h-5 w-5' />
              {t('admin.account.profile.title', {
                defaultValue: 'Admin profile',
              })}
            </CardTitle>
            <CardDescription>
              {t('admin.account.profile.description', {
                defaultValue:
                  'This information comes from your current authentication session.',
              })}
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-6'>
            <div className='flex flex-col gap-4 rounded-xl border p-4 sm:flex-row sm:items-center'>
              <Avatar className='h-16 w-16 rounded-2xl'>
                <AvatarImage src={avatarUrl} alt={displayName} />
                <AvatarFallback className='rounded-2xl text-lg'>
                  {initials || 'AD'}
                </AvatarFallback>
              </Avatar>
              <div className='space-y-1'>
                <p className='text-lg font-semibold'>{displayName}</p>
                <p className='text-sm text-muted-foreground'>{email}</p>
              </div>
            </div>

            <div className='grid gap-4 md:grid-cols-2'>
              <InfoCard
                label={t('admin.account.fields.name', {
                  defaultValue: 'Display name',
                })}
                value={displayName}
              />
              <InfoCard
                label={t('admin.account.fields.username', {
                  defaultValue: 'Username',
                })}
                value={username}
              />
              <InfoCard
                label={t('admin.account.fields.email', {
                  defaultValue: 'Email',
                })}
                value={email}
              />
              <InfoCard
                label={t('admin.account.fields.subject', {
                  defaultValue: 'User ID',
                })}
                value={auth.user?.profile.sub?.toString() || '-'}
              />
            </div>
          </CardContent>
        </Card>

        <div className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <ShieldCheck className='h-5 w-5' />
                {t('admin.account.access.title', {
                  defaultValue: 'Access roles',
                })}
              </CardTitle>
              <CardDescription>
                {t('admin.account.access.description', {
                  defaultValue:
                    'Roles resolved from your current Keycloak session for admin permissions.',
                })}
              </CardDescription>
            </CardHeader>
            <CardContent className='flex flex-wrap gap-2'>
              {accessSnapshot.roles.length > 0 ? (
                accessSnapshot.roles.map((role) => (
                  <Badge key={role} variant='secondary' className='capitalize'>
                    {role}
                  </Badge>
                ))
              ) : (
                <p className='text-sm text-muted-foreground'>
                  {t('admin.account.access.empty', {
                    defaultValue: 'No admin roles were resolved.',
                  })}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                {t('admin.account.preferences.title', {
                  defaultValue: 'Current preferences',
                })}
              </CardTitle>
              <CardDescription>
                {t('admin.account.preferences.description', {
                  defaultValue:
                    'A quick summary of the language and theme active in this admin browser session.',
                })}
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <InfoCard
                label={t('admin.account.preferences.language', {
                  defaultValue: 'Language',
                })}
                value={
                  languages.find((language) => language.locale === current)
                    ?.name ?? current.toUpperCase()
                }
              />
              <InfoCard
                label={t('admin.account.preferences.theme', {
                  defaultValue: 'Theme',
                })}
                value={t(`admin.settings.appearance.options.${theme}`, {
                  defaultValue: theme,
                })}
              />
              <div className='flex flex-col gap-3 sm:flex-row'>
                <Button asChild className='flex-1'>
                  <Link to='/admin/settings'>
                    <Settings className='h-4 w-4' />
                    {t('admin.account.actions.settings', {
                      defaultValue: 'Open settings',
                    })}
                  </Link>
                </Button>
                <Button asChild variant='outline' className='flex-1'>
                  <Link to='/profile'>
                    <ExternalLink className='h-4 w-4' />
                    {t('admin.account.actions.profile', {
                      defaultValue: 'Open storefront profile',
                    })}
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className='rounded-lg border p-4'>
      <p className='text-xs uppercase tracking-wide text-muted-foreground'>
        {label}
      </p>
      <p className='mt-2 break-all text-sm font-medium'>{value}</p>
    </div>
  );
}
