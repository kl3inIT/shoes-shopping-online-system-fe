import {
  ClipboardCheck,
  Database,
  MessagesSquare,
  Settings2,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AiChatLogsTab } from './AiChatLogsTab';
import { AiChecksTab } from './AiChecksTab';
import { AiVectorStoreTab } from './AiVectorStoreTab';
import { AiParametersTab } from './parameters/AiParametersTab';

export default function AiAdminPage() {
  const { t } = useTranslation();
  const tabItems = [
    {
      value: 'parameters',
      title: t('admin.ai.tabs.configuration', {
        defaultValue: 'Configuration',
      }),
      description: t('admin.ai.tabs.configurationDescription', {
        defaultValue:
          'Manage prompt versions and activate the one the assistant should use.',
      }),
      icon: Settings2,
    },
    {
      value: 'vector',
      title: t('admin.ai.tabs.knowledgeBase', {
        defaultValue: 'Knowledge Base',
      }),
      description: t('admin.ai.tabs.knowledgeBaseDescription', {
        defaultValue:
          'Control indexing, filters, and cleanup for retrieved documents.',
      }),
      icon: Database,
    },
    {
      value: 'chatlogs',
      title: t('admin.ai.tabs.conversations', {
        defaultValue: 'Conversations',
      }),
      description: t('admin.ai.tabs.conversationsDescription', {
        defaultValue:
          'Inspect conversation traffic, latency, and token usage patterns.',
      }),
      icon: MessagesSquare,
    },
    {
      value: 'checks',
      title: t('admin.ai.tabs.checks', {
        defaultValue: 'Checks',
      }),
      description: t('admin.ai.tabs.checksDescription', {
        defaultValue:
          'Define evaluation questions and review assistant run quality over time.',
      }),
      icon: ClipboardCheck,
    },
  ];

  return (
    <div className='py-4'>
      <div className='px-4 lg:px-6'>
        <Tabs defaultValue='parameters' className='space-y-5'>
          <TabsList className='grid h-auto w-full grid-cols-1 gap-3 bg-transparent p-0 md:grid-cols-2 xl:grid-cols-4'>
            {tabItems.map((item) => {
              const Icon = item.icon;

              return (
                <TabsTrigger
                  key={item.value}
                  value={item.value}
                  className='h-auto min-h-28 items-start justify-start rounded-2xl border border-border/70 bg-card px-4 py-4 text-left shadow-sm data-[state=active]:border-primary/30 data-[state=active]:bg-primary/5'
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

          <TabsContent value='parameters' className='mt-0'>
            <AiParametersTab />
          </TabsContent>

          <TabsContent value='vector' className='mt-0'>
            <AiVectorStoreTab />
          </TabsContent>

          <TabsContent value='chatlogs' className='mt-0'>
            <AiChatLogsTab />
          </TabsContent>

          <TabsContent value='checks' className='mt-0'>
            <AiChecksTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
