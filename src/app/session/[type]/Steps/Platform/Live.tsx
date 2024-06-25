'use client';

import { SubjectOptions } from '@/Constants';
import { FormBuilder } from '@/components/FormBuilder';
import { useFormContext } from '@/hooks/useFormContext';
import {
  FieldSchema,
  Session,
  SessionParams,
  SessionType,
  Steps,
  liveFields,
  liveSchema,
} from '@/types';
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
        disabled: type === SessionType.EDIT,
        onValueChange: (value, form) => setPlatformId(value, form),
      },
      platformId: {
        type: 'text',
        label: 'Platform ID',
        placeholder: 'Enter platform Id',
        disabled: type === SessionType.EDIT,
      },
      subject: {
        type: 'select',
        label: 'Subject',
        options: SubjectOptions,
        placeholder: 'Select a subject',
      },
      platform: { hide: true },
    }),
    []
  );

  const defaultValues: Partial<liveFields> = useMemo(
    () => ({
      platform: formData.platform,
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
      meta_data: { subject: data.subject },
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
