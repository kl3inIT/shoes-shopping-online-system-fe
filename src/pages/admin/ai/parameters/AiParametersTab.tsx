import { useEffect, useState } from 'react';
import { Link, useLoaderData, useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';

import {
  type AiTargetType,
  useAiParametersListQuery,
  useAiParameterDetailQuery,
  useCreateAiParameterFromDefaultMutation,
  useUpdateAiParameterMutation,
  useActivateAiParameterMutation,
  useCopyAiParameterMutation,
  useDeleteAiParameterMutation,
} from '@/features/ai/parameters';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

function targetToLabel(type: AiTargetType) {
  switch (type) {
    case 'SEARCH':
      return 'Search';
    case 'CHAT':
    default:
      return 'Chat';
  }
}

export function AiParametersTab() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const loaderData = useLoaderData();
  const currentType = loaderData.type;
  const selectedId = loaderData.selectedId;

  const { data: list } = useAiParametersListQuery(currentType);
  const hasSelection = !!selectedId;
  const { data: selected } = useAiParameterDetailQuery(selectedId ?? '');

  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (selected) {
      setDescription(selected.description ?? '');
      setContent(selected.content);
    } else {
      setDescription('');
      setContent('');
    }
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

  const handleActivate = () => {
    if (!selected) return;
    activateMutation.mutate(selected.id);
  };

  const handleCopy = () => {
    if (!selected) return;
    copyMutation.mutate(selected.id);
  };

  const handleDelete = () => {
    if (!selected || selected.active) return;
    deleteMutation.mutate(selected.id);
  };

  return (
    <div className='grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,2fr)]'>
      {/* Left: list + actions */}
      <Card className='h-full'>
        <CardHeader className='flex flex-row items-center justify-between gap-2'>
          <div>
            <CardTitle className='text-base'>
              {t('admin.ai.parameters.title', 'AI Parameters')}
            </CardTitle>
            <p className='text-xs text-muted-foreground'>
              {t(
                'admin.ai.parameters.subtitle',
                'Quản lý các cấu hình YAML cho CHAT và SEARCH.'
              )}
            </p>
          </div>
          <div className='flex items-center gap-2'>
            <Link to={makeTypeUrl('CHAT')}>
              <Button
                size='sm'
                variant={currentType === 'CHAT' ? 'default' : 'outline'}
              >
                {targetToLabel('CHAT')}
              </Button>
            </Link>
            <Link to={makeTypeUrl('SEARCH')}>
              <Button
                size='sm'
                variant={currentType === 'SEARCH' ? 'default' : 'outline'}
              >
                {targetToLabel('SEARCH')}
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className='space-y-3'>
          <div className='flex items-center justify-between gap-2'>
            <p className='text-xs text-muted-foreground'>
              {t(
                'admin.ai.parameters.count',
                '{{count}} bản ghi cho {{type}}',
                {
                  count: list.length,
                  type: targetToLabel(currentType),
                }
              )}
            </p>
            <Button
              size='sm'
              variant='outline'
              disabled={isSubmitting}
              onClick={handleCreateFromDefault}
            >
              {t(
                'admin.ai.parameters.createFromDefault',
                'Tạo từ default YAML'
              )}
            </Button>
          </div>

          <ScrollArea className='h-[360px]'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    {t('admin.ai.parameters.table.description', 'Mô tả')}
                  </TableHead>
                  <TableHead>
                    {t('admin.ai.parameters.table.active', 'Trạng thái')}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {list.map((p) => {
                  const isActive = p.active;
                  const isSelected = selectedId === p.id;
                  return (
                    <TableRow
                      key={p.id}
                      className={`cursor-pointer ${isSelected ? 'bg-muted' : ''}`}
                    >
                      <TableCell>
                        <Link
                          to={makeSelectUrl(p.id)}
                          className='flex flex-col gap-1'
                        >
                          <span className='text-sm font-medium'>
                            {p.description || '(no description)'}
                          </span>
                          <span className='text-xs text-muted-foreground'>
                            {p.id}
                          </span>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={isActive ? 'default' : 'outline'}
                          className='text-xs'
                        >
                          {isActive
                            ? t('admin.ai.parameters.active', 'Đang dùng')
                            : t('admin.ai.parameters.inactive', 'Nháp')}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Right: editor */}
      <Card className='h-full'>
        <CardHeader>
          <CardTitle className='text-base'>
            {hasSelection
              ? t('admin.ai.parameters.editorTitle', 'Chỉnh sửa parameter')
              : t(
                  'admin.ai.parameters.editorEmptyTitle',
                  'Chọn hoặc tạo parameter'
                )}
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-3'>
          {!hasSelection || !selected ? (
            <p className='text-sm text-muted-foreground'>
              {t(
                'admin.ai.parameters.editorEmpty',
                'Chọn một bản ghi ở bên trái hoặc tạo mới từ default YAML.'
              )}
            </p>
          ) : (
            <form className='space-y-3' onSubmit={handleUpdate}>
              <div className='space-y-1'>
                <label className='text-xs font-medium text-muted-foreground'>
                  {t('admin.ai.parameters.fields.description', 'Mô tả')}
                </label>
                <Input
                  name='description'
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t(
                    'admin.ai.parameters.fields.descriptionPlaceholder',
                    'VD: Prompt cho Chat / Search'
                  )}
                />
              </div>

              <div className='space-y-1'>
                <label className='text-xs font-medium text-muted-foreground'>
                  {t('admin.ai.parameters.fields.content', 'Nội dung YAML')}
                </label>
                <Textarea
                  name='content'
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className='font-mono text-xs leading-relaxed'
                  rows={18}
                />
              </div>

              <div className='flex flex-wrap items-center justify-between gap-2 pt-1'>
                <div className='flex gap-2'>
                  <Button type='submit' size='sm' disabled={isSubmitting}>
                    {t('common.save', 'Lưu')}
                  </Button>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    disabled={isSubmitting || selected.active}
                    onClick={handleActivate}
                  >
                    {t('admin.ai.parameters.actions.activate', 'Kích hoạt')}
                  </Button>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    disabled={isSubmitting}
                    onClick={handleCopy}
                  >
                    {t('admin.ai.parameters.actions.copy', 'Nhân bản')}
                  </Button>
                </div>
                <Button
                  type='button'
                  variant='destructive'
                  size='sm'
                  disabled={isSubmitting || selected.active}
                  onClick={handleDelete}
                >
                  {t('common.delete', 'Xóa')}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
