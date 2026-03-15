import { startTransition } from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Check, Languages, MoonStar, Monitor, SunMedium } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useLanguage } from '@/i18n/useLanguage';
import { useTheme } from '@/providers/ThemeProvider';

const themeIcons = {
  light: SunMedium,
  dark: MoonStar,
  system: Monitor,
} as const;

const themeValues = ['light', 'dark', 'system'] as const;

export default function AdminSettingsPage() {
  const { t } = useTranslation();
  const { current, languages, changeLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();

  return (
    <div className='space-y-6 px-4 lg:px-6'>
      <div className='space-y-1'>
        <h1 className='text-2xl font-semibold tracking-tight'>
          {t('admin.settings.title', { defaultValue: 'Settings' })}
        </h1>
        <p className='text-sm text-muted-foreground'>
          {t('admin.settings.subtitle', {
            defaultValue:
              'Manage your language, appearance, and admin workspace preferences.',
          })}
        </p>
      </div>

      <div className='grid gap-6 xl:grid-cols-[1.2fr_0.8fr]'>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Languages className='h-5 w-5' />
              {t('admin.settings.language.title', {
                defaultValue: 'Language',
              })}
            </CardTitle>
            <CardDescription>
              {t('admin.settings.language.description', {
                defaultValue:
                  'Choose how labels, navigation, and messages are displayed in the admin area.',
              })}
            </CardDescription>
          </CardHeader>
          <CardContent className='grid gap-3 sm:grid-cols-2'>
            {languages.map((language) => {
              const isActive = current === language.locale;

              return (
                <Button
                  key={language.locale}
                  type='button'
                  variant={isActive ? 'default' : 'outline'}
                  className='h-auto justify-between px-4 py-4'
                  onClick={() => {
                    startTransition(() => {
                      changeLanguage(language.locale);
                    });
                  }}
                >
                  <span className='text-left'>
                    <span className='block text-sm font-medium'>
                      {language.name}
                    </span>
                    <span className='block text-xs opacity-80'>
                      {language.locale.toUpperCase()}
                    </span>
                  </span>
                  {isActive ? <Check className='h-4 w-4' /> : null}
                </Button>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {t('admin.settings.summary.title', {
                defaultValue: 'Current preferences',
              })}
            </CardTitle>
            <CardDescription>
              {t('admin.settings.summary.description', {
                defaultValue:
                  'A quick overview of the preferences currently applied to this browser.',
              })}
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4 text-sm'>
            <div className='rounded-lg border p-4'>
              <p className='text-muted-foreground'>
                {t('admin.settings.summary.language', {
                  defaultValue: 'Language',
                })}
              </p>
              <p className='mt-1 font-medium'>
                {languages.find((language) => language.locale === current)
                  ?.name ?? current.toUpperCase()}
              </p>
            </div>
            <div className='rounded-lg border p-4'>
              <p className='text-muted-foreground'>
                {t('admin.settings.summary.theme', {
                  defaultValue: 'Theme',
                })}
              </p>
              <p className='mt-1 font-medium'>
                {t(`admin.settings.appearance.options.${theme}`, {
                  defaultValue: theme,
                })}
              </p>
            </div>
            <Button asChild className='w-full'>
              <Link to='/admin/account'>
                {t('admin.settings.actions.account', {
                  defaultValue: 'Open account page',
                })}
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <MoonStar className='h-5 w-5' />
            {t('admin.settings.appearance.title', {
              defaultValue: 'Appearance',
            })}
          </CardTitle>
          <CardDescription>
            {t('admin.settings.appearance.description', {
              defaultValue:
                'Switch between light, dark, or system mode for the admin dashboard.',
            })}
          </CardDescription>
        </CardHeader>
        <CardContent className='grid gap-3 md:grid-cols-3'>
          {themeValues.map((value) => {
            const Icon = themeIcons[value];
            const isActive = theme === value;

            return (
              <Button
                key={value}
                type='button'
                variant={isActive ? 'default' : 'outline'}
                className='h-auto justify-between px-4 py-4'
                onClick={() => {
                  startTransition(() => {
                    setTheme(value);
                  });
                }}
              >
                <span className='flex items-center gap-3 text-left'>
                  <Icon className='h-4 w-4' />
                  <span>
                    <span className='block text-sm font-medium'>
                      {t(`admin.settings.appearance.options.${value}`, {
                        defaultValue: value,
                      })}
                    </span>
                    <span className='block text-xs opacity-80'>
                      {t(`admin.settings.appearance.help.${value}`, {
                        defaultValue:
                          'Apply this theme to the admin workspace.',
                      })}
                    </span>
                  </span>
                </span>
                {isActive ? <Check className='h-4 w-4' /> : null}
              </Button>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
