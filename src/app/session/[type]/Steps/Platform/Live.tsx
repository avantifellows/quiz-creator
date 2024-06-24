'use client';

import { SubjectOptions } from '@/Constants';
import { FormBuilder } from '@/components/FormBuilder';
import { useFormContext } from '@/hooks/useFormContext';
import { FieldSchema, Session, SessionParams, Steps, liveFields, liveSchema } from '@/types';
import { useParams } from 'next/navigation';
import { useCallback, useMemo, type FC } from 'react';
import { setPlatformId } from '../helper';

const QuizForm: FC = () => {
  const { type } = useParams<SessionParams>();
  const { formData, updateFormData } = useFormContext();

  const fieldsSchema: FieldSchema<liveFields> = useMemo(
    () => ({
      name: {
        type: 'text',
        label: 'Name',
        placeholder: 'Enter session name',
      },
      platformLink: {
        type: 'text',
        label: 'Platform link',
        placeholder: 'Enter platform link',
        onValueChange: (value, form) => setPlatformId(value, formData, updateFormData),
      },
      platformId: {
        type: 'text',
        label: 'Platform ID',
        placeholder: 'Enter platform Id',
      },
      subject: {
        type: 'select',
        label: 'Subject',
        options: SubjectOptions,
        placeholder: 'Select a subject',
      },
    }),
    []
  );

  const defaultValues: Partial<liveFields> = useMemo(
    () => ({
      name: formData.name,
      platformLink: formData.platform_link,
      platformId: formData.platform_id,
      subject: formData.meta_data?.subject,
    }),
    [formData]
  );

  const onSubmit = useCallback((data: liveFields) => {
    const addedData: Session = {
      name: data.name,
      platform_link: data.platformLink,
      platform_id: data.platformId,
      meta_data: {
        ...(formData.meta_data ?? {}),
        subject: data.subject,
      },
    };
    updateFormData(addedData, Steps.TIMELINE);
  }, []);

  return (
    <FormBuilder
      formSchema={fieldsSchema}
      zodSchema={liveSchema}
      defaultValues={defaultValues}
      handleSubmit={onSubmit}
    />
  );
};

export default QuizForm;
