import {
  ArrowRight,
  ClipboardCheck,
  Database,
  MessagesSquare,
  Settings2,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
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
    <div className='flex flex-col gap-6 py-4'>
      <div className='px-4 lg:px-6'>
        <Card className='overflow-hidden border-border/70 shadow-sm'>
          <CardContent className='grid gap-6 bg-[linear-gradient(135deg,rgba(15,23,42,0.02),rgba(59,130,246,0.07))] p-5 md:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)] md:p-6'>
            <div className='space-y-4'>
              <div className='space-y-2'>
                <Badge variant='outline' className='w-fit bg-background/70'>
                  {t('admin.ai.page.badge', {
                    defaultValue: 'AI Operations Console',
                  })}
                </Badge>
                <h1 className='text-3xl font-bold tracking-tight'>
                  {t('admin.ai.page.title', {
                    defaultValue: 'Assistant Operations',
                  })}
                </h1>
                <p className='max-w-3xl text-sm leading-6 text-muted-foreground md:text-base'>
                  {t('admin.ai.page.description', {
                    defaultValue:
                      'Configure assistant behavior, keep the knowledge base healthy, audit real conversations, and validate answer quality from one place.',
                  })}
                </p>
              </div>

              <div className='grid gap-3 sm:grid-cols-2'>
                {tabItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.value}
                      className='rounded-2xl border border-border/70 bg-background/75 p-4 shadow-sm'
                    >
                      <div className='flex items-start justify-between gap-3'>
                        <div className='space-y-1'>
                          <p className='text-sm font-semibold'>{item.title}</p>
                          <p className='text-sm leading-5 text-muted-foreground'>
                            {item.description}
                          </p>
                        </div>
                        <div className='rounded-xl border bg-muted/50 p-2 text-muted-foreground'>
                          <Icon className='size-4' />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className='flex flex-col justify-between rounded-2xl border border-border/70 bg-background/85 p-5 shadow-sm'>
              <div className='space-y-2'>
                <p className='text-xs font-medium tracking-[0.24em] text-muted-foreground uppercase'>
                  {t('admin.ai.page.workflowLabel', {
                    defaultValue: 'Suggested workflow',
                  })}
                </p>
                <div className='space-y-3'>
                  {[
                    t('admin.ai.page.workflow.configuration', {
                      defaultValue:
                        '1. Update or activate the right prompt version.',
                    }),
                    t('admin.ai.page.workflow.knowledge', {
                      defaultValue:
                        '2. Re-ingest or inspect documents when retrieval changes.',
                    }),
                    t('admin.ai.page.workflow.logs', {
                      defaultValue:
                        '3. Review live conversations to understand failure patterns.',
                    }),
                    t('admin.ai.page.workflow.checks', {
                      defaultValue:
                        '4. Run checks to confirm the assistant still answers correctly.',
                    }),
                  ].map((step) => (
                    <div
                      key={step}
                      className='flex items-start gap-2 text-sm text-muted-foreground'
                    >
                      <ArrowRight className='mt-0.5 size-4 shrink-0 text-foreground/60' />
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className='mt-6 rounded-xl border bg-muted/30 p-4 text-sm text-muted-foreground'>
                {t('admin.ai.page.tip', {
                  defaultValue:
                    'Use the tabs below as a workflow, not separate tools. Each area should answer a different operational question clearly.',
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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
