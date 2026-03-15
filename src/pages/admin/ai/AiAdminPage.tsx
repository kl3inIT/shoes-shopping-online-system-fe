import {
  Settings2,
  Database,
  MessagesSquare,
  ClipboardCheck,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AiParametersTab } from './parameters/AiParametersTab';
import { AiVectorStoreTab } from './AiVectorStoreTab';
import { AiChatLogsTab } from './AiChatLogsTab';
import { AiChecksTab } from './AiChecksTab';

export default function AiAdminPage() {
  const { t } = useTranslation();

  return (
    <div className='flex flex-col gap-4 py-4'>
      <div className='flex items-center justify-between px-4 lg:px-6'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>
            {t('admin.ai.page.title', {
              defaultValue: 'Assistant Operations',
            })}
          </h1>
          <p className='text-muted-foreground text-sm'>
            {t('admin.ai.page.description', {
              defaultValue:
                'Configure prompts, knowledge indexing, conversation logs, and assistant response testing.',
            })}
          </p>
        </div>
      </div>

      <div className='px-4 lg:px-6'>
        <Tabs defaultValue='parameters' className='space-y-4'>
          <TabsList>
            <TabsTrigger value='parameters'>
              <Settings2 className='mr-1 h-4 w-4' />
              {t('admin.ai.tabs.configuration', {
                defaultValue: 'Configuration',
              })}
            </TabsTrigger>
            <TabsTrigger value='vector'>
              <Database className='mr-1 h-4 w-4' />
              {t('admin.ai.tabs.knowledgeBase', {
                defaultValue: 'Knowledge Base',
              })}
            </TabsTrigger>
            <TabsTrigger value='chatlogs'>
              <MessagesSquare className='mr-1 h-4 w-4' />
              {t('admin.ai.tabs.conversations', {
                defaultValue: 'Conversations',
              })}
            </TabsTrigger>
            <TabsTrigger value='checks'>
              <ClipboardCheck className='mr-1 h-4 w-4' />
              {t('admin.ai.tabs.checks', {
                defaultValue: 'Checks',
              })}
            </TabsTrigger>
          </TabsList>

          <TabsContent value='parameters'>
            <AiParametersTab />
          </TabsContent>

          <TabsContent value='vector'>
            <AiVectorStoreTab />
          </TabsContent>

          <TabsContent value='chatlogs'>
            <AiChatLogsTab />
          </TabsContent>

          <TabsContent value='checks'>
            <AiChecksTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
