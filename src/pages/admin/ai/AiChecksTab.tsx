import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DefinitionsTab } from './checks/DefinitionsTab';
import { RunHistoryTab } from './checks/RunHistoryTab';

export function AiChecksTab() {
  const { t } = useTranslation();

  return (
    <Tabs defaultValue='definitions' className='space-y-4'>
      <TabsList>
        <TabsTrigger value='definitions'>
          {t('admin.ai.checks.tabs.definitions', 'Test Definitions')}
        </TabsTrigger>
        <TabsTrigger value='history'>
          {t('admin.ai.checks.tabs.runHistory', 'Run History')}
        </TabsTrigger>
      </TabsList>

      <TabsContent value='definitions'>
        <DefinitionsTab />
      </TabsContent>

      <TabsContent value='history'>
        <RunHistoryTab />
      </TabsContent>
    </Tabs>
  );
}
