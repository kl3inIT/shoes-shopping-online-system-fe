import { useEffect, useState } from 'react';
import { CheckCircle2, CopyPlus, FileCode2, Layers3 } from 'lucide-react';
import { Link, useLoaderData, useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';

import {
  type AiTargetType,
  useActivateAiParameterMutation,
  useAiParameterDetailQuery,
  useAiParametersListQuery,
  useCopyAiParameterMutation,
  useCreateAiParameterFromDefaultMutation,
  useDeleteAiParameterMutation,
  useUpdateAiParameterMutation,
} from '@/features/ai/parameters';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import {
  OperationsMetricCard,
  OperationsMetricGrid,
  OperationsSection,
} from '../components/OperationsSection';

export function AiParametersTab() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const loaderData = useLoaderData() as {
    type: AiTargetType;
    selectedId?: string;
  };
  const currentType = loaderData.type;
  const selectedId = loaderData.selectedId;

  const { data: list } = useAiParametersListQuery(currentType);
  const { data: selected } = useAiParameterDetailQuery(selectedId ?? '');

  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (!selected) {
      setDescription('');
      setContent('');
      return;
    }

    setDescription(selected.description ?? '');
    setContent(selected.content);
  }, [selected]);

  const createFromDefaultMutation = useCreateAiParameterFromDefaultMutation();
  const updateMutation = useUpdateAiParameterMutation();
  const activateMutation = useActivateAiParameterMutation();
  const copyMutation = useCopyAiParameterMutation();
  const deleteMutation = useDeleteAiParameterMutation();

  const isSubmitting =
    createFromDefaultMutation.isPending ||
    updateMutation.isPending ||
    activateMutation.isPending ||
    copyMutation.isPending ||
    deleteMutation.isPending;

  const activeCount = list.filter((parameter) => parameter.active).length;
  const targetToLabel = (type: AiTargetType) => {
    if (type === 'SEARCH') {
      return t('admin.ai.parameters.target.search', {
        defaultValue: 'Search',
      });
    }

    return t('admin.ai.parameters.target.chat', { defaultValue: 'Chat' });
  };

  const makeTypeUrl = (type: AiTargetType) => {
    const next = new URLSearchParams(searchParams);
    next.set('type', type);
    next.delete('id');
    return `?${next.toString()}`;
  };

  const makeSelectUrl = (id: string) => {
    const next = new URLSearchParams(searchParams);
    next.set('id', id);
    return `?${next.toString()}`;
  };

  const handleCreateFromDefault = () => {
    createFromDefaultMutation.mutate(currentType);
  };

  const handleUpdate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selected) return;

    updateMutation.mutate({
      id: selected.id,
      payload: { content, description },
    });
  };

  return (
    <div className='space-y-4'>
      <OperationsMetricGrid>
        <OperationsMetricCard
          label={t('admin.ai.parameters.summary.currentTarget', {
            defaultValue: 'Current target',
          })}
          value={targetToLabel(currentType)}
          hint={t('admin.ai.parameters.summary.currentTargetHint', {
            defaultValue:
              'Switch between assistant chat behavior and retrieval behavior.',
          })}
          icon={Layers3}
        />
        <OperationsMetricCard
          label={t('admin.ai.parameters.summary.totalVersions', {
            defaultValue: 'Saved versions',
          })}
          value={String(list.length)}
          hint={t('admin.ai.parameters.summary.totalVersionsHint', {
            defaultValue:
              'Drafts and active versions available for this target.',
          })}
          icon={CopyPlus}
        />
        <OperationsMetricCard
          label={t('admin.ai.parameters.summary.activeVersion', {
            defaultValue: 'Active version',
          })}
          value={activeCount > 0 ? String(activeCount) : '0'}
          hint={t('admin.ai.parameters.summary.activeVersionHint', {
            defaultValue:
              'Exactly one version should usually be active for each target.',
          })}
          icon={CheckCircle2}
        />
      </OperationsMetricGrid>

      <div className='grid gap-4 xl:grid-cols-[minmax(0,1.25fr)_minmax(0,1.75fr)]'>
        <OperationsSection
          title={t('admin.ai.parameters.title', 'AI Parameters')}
          description={t('admin.ai.parameters.subtitle', {
            defaultValue:
              'Choose the target, review available versions, then open one record to edit or activate it.',
          })}
          className='h-full'
          contentClassName='space-y-4'
        >
          <div className='flex flex-wrap items-center justify-between gap-3'>
            <div className='inline-flex rounded-xl border bg-muted/30 p-1'>
              <Link to={makeTypeUrl('CHAT')}>
                <Button
                  size='sm'
                  variant={currentType === 'CHAT' ? 'default' : 'ghost'}
                  className='rounded-lg'
                >
                  {targetToLabel('CHAT')}
                </Button>
              </Link>
              <Link to={makeTypeUrl('SEARCH')}>
                <Button
                  size='sm'
                  variant={currentType === 'SEARCH' ? 'default' : 'ghost'}
                  className='rounded-lg'
                >
                  {targetToLabel('SEARCH')}
                </Button>
              </Link>
            </div>

            <Button
              size='sm'
              variant='outline'
              disabled={isSubmitting}
              onClick={handleCreateFromDefault}
            >
              <FileCode2 className='size-4' />
              {t(
                'admin.ai.parameters.createFromDefault',
                'Create from default'
              )}
            </Button>
          </div>

          <div className='rounded-xl border bg-muted/20 px-4 py-3 text-sm text-muted-foreground'>
            {t('admin.ai.parameters.count', '{{count}} records for {{type}}', {
              count: list.length,
              type: targetToLabel(currentType),
            })}
          </div>

          <ScrollArea className='h-[420px] rounded-xl border'>
            <Table className='table-fixed'>
              <TableHeader className='bg-muted/30'>
                <TableRow>
                  <TableHead className='w-[72%] px-4 py-3'>
                    {t('admin.ai.parameters.table.description', 'Description')}
                  </TableHead>
                  <TableHead className='w-[28%] px-4 py-3'>
                    {t('admin.ai.parameters.table.active', 'Status')}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {list.map((parameter) => {
                  const isSelected = selectedId === parameter.id;

                  return (
                    <TableRow
                      key={parameter.id}
                      className={isSelected ? 'bg-primary/5' : undefined}
                    >
                      <TableCell className='px-4 py-3 align-top whitespace-normal'>
                        <Link
                          to={makeSelectUrl(parameter.id)}
                          className='flex flex-col gap-1 rounded-lg outline-none transition hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/40'
                        >
                          <span className='text-sm font-medium leading-6'>
                            {parameter.description ||
                              t('admin.ai.parameters.noDescription', {
                                defaultValue: '(no description)',
                              })}
                          </span>
                          <span className='break-all font-mono text-xs text-muted-foreground'>
                            {parameter.id}
                          </span>
                        </Link>
                      </TableCell>
                      <TableCell className='px-4 py-3 align-top'>
                        <Badge
                          variant={parameter.active ? 'default' : 'outline'}
                          className='text-xs'
                        >
                          {parameter.active
                            ? t('admin.ai.parameters.active', 'Active')
                            : t('admin.ai.parameters.inactive', 'Draft')}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </ScrollArea>
        </OperationsSection>

        <OperationsSection
          title={
            selected
              ? t('admin.ai.parameters.editorTitle', 'Edit parameter')
              : t('admin.ai.parameters.editorEmptyTitle', 'Choose a parameter')
          }
          description={
            selected
              ? t('admin.ai.parameters.editorDescription', {
                  defaultValue:
                    'Update the description or YAML content, then activate the version you trust.',
                })
              : t('admin.ai.parameters.editorEmpty', {
                  defaultValue:
                    'Pick a record from the left or create a new draft from the default YAML template.',
                })
          }
          className='h-full'
          contentClassName='space-y-4'
        >
          {!selected ? (
            <div className='rounded-2xl border border-dashed bg-muted/15 px-6 py-16 text-center text-sm text-muted-foreground'>
              {t('admin.ai.parameters.editorEmpty', {
                defaultValue:
                  'Pick a record from the left or create a new draft from the default YAML template.',
              })}
            </div>
          ) : (
            <form className='space-y-4' onSubmit={handleUpdate}>
              <div className='space-y-2'>
                <label className='text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase'>
                  {t('admin.ai.parameters.fields.description', 'Description')}
                </label>
                <Input
                  name='description'
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder={t(
                    'admin.ai.parameters.fields.descriptionPlaceholder',
                    'For example: Chat prompt v2 for product questions'
                  )}
                />
              </div>

              <div className='space-y-2'>
                <div className='flex items-center justify-between gap-3'>
                  <label className='text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase'>
                    {t('admin.ai.parameters.fields.content', 'YAML content')}
                  </label>
                  <span className='font-mono text-xs text-muted-foreground'>
                    {selected.id}
                  </span>
                </div>
                <Textarea
                  name='content'
                  value={content}
                  onChange={(event) => setContent(event.target.value)}
                  className='min-h-[420px] font-mono text-xs leading-relaxed'
                />
              </div>

              <div className='flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-muted/20 px-4 py-3'>
                <div className='flex flex-wrap gap-2'>
                  <Button type='submit' size='sm' disabled={isSubmitting}>
                    {t('common.save', 'Save')}
                  </Button>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    disabled={isSubmitting || selected.active}
                    onClick={() => activateMutation.mutate(selected.id)}
                  >
                    {t('admin.ai.parameters.actions.activate', 'Activate')}
                  </Button>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    disabled={isSubmitting}
                    onClick={() => copyMutation.mutate(selected.id)}
                  >
                    {t('admin.ai.parameters.actions.copy', 'Duplicate')}
                  </Button>
                </div>

                <Button
                  type='button'
                  variant='destructive'
                  size='sm'
                  disabled={isSubmitting || selected.active}
                  onClick={() => deleteMutation.mutate(selected.id)}
                >
                  {t('common.delete', 'Delete')}
                </Button>
              </div>
            </form>
          )}
        </OperationsSection>
      </div>
    </div>
  );
}
