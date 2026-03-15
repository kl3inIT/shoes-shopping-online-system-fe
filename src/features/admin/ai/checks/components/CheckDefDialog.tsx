import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import type { CheckDef, CheckDefFormValues } from '../types';

interface CheckDefDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editDef?: CheckDef | null;
  onSave: (data: CheckDefFormValues) => void;
  isSaving: boolean;
}

export function CheckDefDialog({
  open,
  onOpenChange,
  editDef,
  onSave,
  isSaving,
}: CheckDefDialogProps) {
  const { t } = useTranslation();
  const isEditMode = editDef != null;

  const [question, setQuestion] = useState('');
  const [referenceAnswer, setReferenceAnswer] = useState('');
  const [category, setCategory] = useState('');
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (open) {
      if (editDef) {
        setQuestion(editDef.question);
        setCategory(editDef.category ?? '');
        setActive(editDef.active);
        setReferenceAnswer('');
      } else {
        setQuestion('');
        setReferenceAnswer('');
        setCategory('');
        setActive(true);
      }
    }
  }, [open, editDef]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave({ question, referenceAnswer, category, active });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>
            {isEditMode
              ? t('admin.ai.checks.dialog.editTitle', 'Edit Check Definition')
              : t('admin.ai.checks.dialog.createTitle', 'Add Check Definition')}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-1'>
            <label className='text-sm font-medium'>
              {t('admin.ai.checks.dialog.categoryLabel', 'Category')}
              <span className='ml-1 text-xs text-muted-foreground'>
                {t('admin.ai.checks.dialog.optional', '(optional)')}
              </span>
            </label>
            <Input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder={t(
                'admin.ai.checks.dialog.categoryPlaceholder',
                'e.g. product, policy'
              )}
            />
          </div>
          <div className='space-y-1'>
            <label className='text-sm font-medium'>
              {t('admin.ai.checks.dialog.questionLabel', 'Question')}
              <span className='ml-1 text-destructive'>*</span>
            </label>
            <Textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={t(
                'admin.ai.checks.dialog.questionPlaceholder',
                'Enter the check question'
              )}
              required
              rows={3}
            />
          </div>
          <div className='space-y-1'>
            <label className='text-sm font-medium'>
              {t(
                'admin.ai.checks.dialog.referenceAnswerLabel',
                'Reference Answer'
              )}
              {!isEditMode && <span className='ml-1 text-destructive'>*</span>}
            </label>
            <Textarea
              value={referenceAnswer}
              onChange={(e) => setReferenceAnswer(e.target.value)}
              placeholder={
                isEditMode
                  ? t(
                      'admin.ai.checks.dialog.referenceAnswerEditPlaceholder',
                      'Enter new reference answer (optional)'
                    )
                  : t(
                      'admin.ai.checks.dialog.referenceAnswerPlaceholder',
                      'Enter the expected reference answer'
                    )
              }
              required={!isEditMode}
              rows={4}
            />
          </div>
          <div className='flex items-center gap-3'>
            <Switch
              id='check-def-active'
              checked={active}
              onCheckedChange={setActive}
            />
            <label htmlFor='check-def-active' className='text-sm font-medium'>
              {t('admin.ai.checks.dialog.activeLabel', 'Active')}
            </label>
          </div>
          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={() => onOpenChange(false)}
              disabled={isSaving}
            >
              {t('common.cancel', 'Cancel')}
            </Button>
            <Button type='submit' disabled={isSaving}>
              {isSaving ? (
                <>
                  <span className='mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent' />
                  {t('common.saving', 'Saving...')}
                </>
              ) : (
                t('common.save', 'Save')
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
