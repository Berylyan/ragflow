import { ButtonLoading } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  getDefaultParserIdForDatasetCreation,
  useFetchTenantInfo,
} from '@/hooks/use-user-setting-request';
import { IModalProps } from '@/interfaces/common';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { EmbeddingModelItem } from '../dataset/dataset-setting/configuration/common-item';

const FormId = 'dataset-creating-form';

export function InputForm({ onOk }: IModalProps<any>) {
  const { t } = useTranslation();
  const { data: tenantInfo } = useFetchTenantInfo();
  const defaultParserId = useMemo(() => {
    return getDefaultParserIdForDatasetCreation(tenantInfo?.parser_ids);
  }, [tenantInfo?.parser_ids]);

  const FormSchema = z.object({
    name: z
      .string()
      .min(1, {
        message: t('knowledgeList.namePlaceholder'),
      })
      .trim(),
    parseType: z.number().optional(),
    embd_id: z
      .string()
      .min(1, {
        message: t('knowledgeConfiguration.embeddingModelPlaceholder'),
      })
      .trim(),
    parser_id: z
      .string()
      .min(1, {
        message: t('knowledgeList.parserRequired'),
      })
      .trim(),
    pipeline_id: z.string().optional(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      parseType: 1,
      parser_id: defaultParserId,
      pipeline_id: '',
      embd_id: tenantInfo?.embd_id,
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    onOk?.({
      ...data,
      parseType: 1,
      parser_id: data.parser_id || defaultParserId,
      pipeline_id: '',
    });
  }

  useEffect(() => {
    form.setValue('parseType', 1, {
      shouldDirty: false,
    });
    form.setValue('pipeline_id', '', {
      shouldDirty: false,
    });
    form.setValue('parser_id', defaultParserId, {
      shouldDirty: false,
      shouldValidate: true,
    });
  }, [defaultParserId, form]);

  useEffect(() => {
    if (tenantInfo?.embd_id && !form.getValues('embd_id')) {
      form.setValue('embd_id', tenantInfo.embd_id, {
        shouldDirty: false,
      });
    }
  }, [tenantInfo?.embd_id, form]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
        id={FormId}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <span className="text-destructive mr-1"> *</span>
                {t('knowledgeList.name')}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={t('knowledgeList.namePlaceholder')}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <EmbeddingModelItem line={2} isEdit={false} />
        <input
          type="hidden"
          {...form.register('parseType', { valueAsNumber: true })}
        />
        <input type="hidden" {...form.register('parser_id')} />
        <input type="hidden" {...form.register('pipeline_id')} />
      </form>
    </Form>
  );
}

export function DatasetCreatingDialog({
  hideModal,
  onOk,
  loading,
}: IModalProps<any>) {
  const { t } = useTranslation();

  return (
    <Dialog open onOpenChange={hideModal}>
      <DialogContent
        className="sm:max-w-[425px] focus-visible:!outline-none flex flex-col"
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            const form = document.getElementById(FormId) as HTMLFormElement;
            form?.requestSubmit();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>{t('knowledgeList.createKnowledgeBase')}</DialogTitle>
        </DialogHeader>
        <DialogDescription></DialogDescription>
        <InputForm onOk={onOk}></InputForm>
        <DialogFooter>
          <ButtonLoading type="submit" form={FormId} loading={loading}>
            {t('common.save')}
          </ButtonLoading>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
