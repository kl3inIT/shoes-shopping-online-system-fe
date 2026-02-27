import { Settings2, Database, MessagesSquare, Beaker } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AiParametersTab } from './parameters/AiParametersTab';
import { AiVectorStoreTab } from './AiVectorStoreTab';
import { AiChatLogsTab } from './AiChatLogsTab';
import { AiTestChatTab } from './AiTestChatTab';

export default function AiAdminPage() {
  return (
    <div className='flex flex-col gap-4 py-4'>
      <div className='flex items-center justify-between px-4 lg:px-6'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>
            AI Assistant Configuration
          </h1>
          <p className='text-muted-foreground text-sm'>
            Quản lý system prompt, tools, vector store, chat logs và thử nghiệm
            trả lời của trợ lý AI.
          </p>
        </div>
      </div>

      <div className='px-4 lg:px-6'>
        <Tabs defaultValue='parameters' className='space-y-4'>
          <TabsList>
            <TabsTrigger value='parameters'>
              <Settings2 className='mr-1 h-4 w-4' />
              Parameters
            </TabsTrigger>
            <TabsTrigger value='vector'>
              <Database className='mr-1 h-4 w-4' />
              Vector Store
            </TabsTrigger>
            <TabsTrigger value='chatlogs'>
              <MessagesSquare className='mr-1 h-4 w-4' />
              Chat Logs
            </TabsTrigger>
            <TabsTrigger value='test'>
              <Beaker className='mr-1 h-4 w-4' />
              Test Chat
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

          <TabsContent value='test'>
            <AiTestChatTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
