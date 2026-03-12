import { useTranslation } from 'react-i18next';
import {
  IconUsers,
  IconShield,
  IconUserCog,
  IconUser,
} from '@tabler/icons-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface UserStatsCardsProps {
  total: number;
  admins: number;
  managers: number;
  customers: number;
}

export function UserStatsCards({
  total,
  admins,
  managers,
  customers,
}: UserStatsCardsProps) {
  const { t } = useTranslation();

  const stats = [
    {
      title: t('admin.users.stats.total'),
      value: total,
      icon: IconUsers,
      className: 'text-foreground',
    },
    {
      title: t('admin.users.stats.admins'),
      value: admins,
      icon: IconShield,
      className: 'text-red-600',
    },
    {
      title: t('admin.users.stats.managers'),
      value: managers,
      icon: IconUserCog,
      className: 'text-blue-600',
    },
    {
      title: t('admin.users.stats.customers'),
      value: customers,
      icon: IconUser,
      className: 'text-green-600',
    },
  ];

  return (
    <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.className}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stat.className}`}>
              {stat.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
