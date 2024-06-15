'use client';

import {
  BatchOptions,
  GradeOptions,
  GroupOptions,
  SessionTypeOptions,
  TestPlatformOptions,
} from '@/Constants';
import { FormBuilder } from '@/components/FormBuilder';
import { useFormContext } from '@/hooks/useFormContext';
import {
  FieldSchema,
  PartialSession,
  SessionParams,
  Steps,
  basicFields,
  basicSchema,
} from '@/types';
import { useParams } from 'next/navigation';
import { useCallback, useMemo, type FC } from 'react';

const BasicForm: FC = () => {
  const { type } = useParams<SessionParams>();
  const { formData, updateFormData } = useFormContext();

  const fieldsSchema: FieldSchema<basicFields> = useMemo(
    () => ({
      group: {
        type: 'select',
        options: GroupOptions,
        placeholder: 'Select a group',
        label: 'Group',
      },
      batch: {
        type: 'select',
        options: BatchOptions,
        placeholder: 'Select a batch',
        label: 'Batch',
      },
      grade: {
        type: 'select',
        options: GradeOptions,
        placeholder: 'Select a grade',
        label: 'Grade',
      },
      sessionType: {
        type: 'select',
        options: SessionTypeOptions,
        placeholder: 'Select a session type',
        label: 'Session type',
      },
      authType: {
        type: 'text',
        label: 'Auth type',
        placeholder: 'Enter auth type',
      },
      activateSignUp: {
        type: 'switch',
        label: 'Activate sign up',
      },
      isPopupForm: {
        type: 'switch',
        label: 'Is pop up form allowed',
      },
      noOfFieldsInPopup: {
        type: 'number',
        label: 'No of fields in popup',
        placeholder: 'Enter no of fields in popup',
        min: 0,
        step: 1,
      },
      isRedirection: {
        type: 'switch',
        label: 'Is redirection allowed',
      },
      isIdGeneration: {
        type: 'switch',
        label: 'Is id generation allowed',
      },
      signupFormName: {
        type: 'text',
        label: 'Signup form name',
        placeholder: 'Enter form name',
      },
      platform: {
        type: 'select',
        options: TestPlatformOptions,
        placeholder: 'Select a platform',
        label: 'Platform',
      },
    }),
    []
  );

  const defaultValues = useMemo(
    () => ({
      group: formData?.meta_data?.group,
      batch: formData?.meta_data?.batch,
      grade: formData?.meta_data?.grade,
      authType: formData?.auth_type,
      activateSignUp: formData?.signup_form,
      isPopupForm: formData?.popup_form,
      noOfFieldsInPopup: formData?.meta_data?.number_of_fields_in_popup_form,
      isRedirection: formData?.redirection,
      isIdGeneration: formData?.id_generation,
      platform: formData?.platform,
      // TODO: signupFormName and sessionType key should be added
    }),
    [formData]
  );

  const onSubmit = useCallback((data: basicFields) => {
    const addedData: PartialSession = {
      meta_data: {
        group: data.group,
        batch: data.batch,
        grade: data.grade,
        number_of_fields_in_popup_form: data.noOfFieldsInPopup,
      },
      auth_type: data.authType,
      signup_form: data.activateSignUp,
      popup_form: data.isPopupForm,
      redirection: data.isRedirection,
      id_generation: data.isIdGeneration,
      platform: data.platform,
      // TODO: signupFormName and sessionType key should be added
    };
    console.log('Sumbitted data Successfully', data);

    updateFormData(addedData, Steps.PLATFORM);
  }, []);

  return (
    <FormBuilder
      formSchema={fieldsSchema}
      zodSchema={basicSchema}
      defaultValues={defaultValues}
      handleSubmit={onSubmit}
    />
  );
};

export default BasicForm;
