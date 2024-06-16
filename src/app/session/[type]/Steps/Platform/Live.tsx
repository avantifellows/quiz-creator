'use client';

import { FormBuilder } from '@/components/FormBuilder';
import { useFormContext } from '@/hooks/useFormContext';
import { FieldSchema, Session, SessionParams, Steps, liveFields, liveSchema } from '@/types';
import { useParams } from 'next/navigation';
import { useCallback, useMemo, type FC } from 'react';

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
      },
    }),
    []
  );

  const defaultValues: Partial<liveFields> = useMemo(
    () => ({
      name: formData.name,
      platformLink: formData.platform_link,
    }),
    [formData]
  );

  const onSubmit = useCallback((data: liveFields) => {
    const addedData: Session = {
      name: data.name,
      platform_link: data.platformLink,
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
