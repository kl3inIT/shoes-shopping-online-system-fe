import { ClipboardList, History } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DefinitionsTab } from './checks/DefinitionsTab';
import { RunHistoryTab } from './checks/RunHistoryTab';

export function AiChecksTab() {
  const { t } = useTranslation();
  const checkTabs = [
    {
      value: 'definitions',
      title: t('admin.ai.checks.tabs.definitions', 'Test Definitions'),
      description: t('admin.ai.checks.tabs.definitionsDescription', {
        defaultValue:
          'Maintain the questions and reference answers used to evaluate the assistant.',
      }),
      icon: ClipboardList,
    },
    {
      value: 'history',
      title: t('admin.ai.checks.tabs.runHistory', 'Run History'),
      description: t('admin.ai.checks.tabs.runHistoryDescription', {
        defaultValue:
          'Track evaluation runs, compare scores, and open detailed results.',
      }),
      icon: History,
    },
  ];

  return (
    <Tabs defaultValue='definitions' className='space-y-4'>
      <TabsList className='grid h-auto w-full grid-cols-1 gap-3 bg-transparent p-0 md:grid-cols-2'>
        {checkTabs.map((item) => {
          const Icon = item.icon;

          return (
            <TabsTrigger
              key={item.value}
              value={item.value}
              className='h-auto min-h-24 items-start justify-start rounded-2xl border border-border/70 bg-card px-4 py-4 text-left shadow-sm data-[state=active]:border-primary/30 data-[state=active]:bg-primary/5'
            >
              <div className='flex w-full items-start gap-3'>
                <div className='rounded-xl border bg-muted/50 p-2 text-muted-foreground'>
                  <Icon className='size-4' />
                </div>
                <div className='space-y-1'>
                  <div className='text-sm font-semibold text-foreground'>
                    {item.title}
                  </div>
                  <div className='whitespace-normal text-sm leading-5 text-muted-foreground'>
                    {item.description}
                  </div>
                </div>
              </div>
            </TabsTrigger>
          );
        })}
      </TabsList>

      <TabsContent value='definitions' className='mt-0'>
        <DefinitionsTab />
      </TabsContent>

      <TabsContent value='history' className='mt-0'>
        <RunHistoryTab />
      </TabsContent>
    </Tabs>
  );
}
