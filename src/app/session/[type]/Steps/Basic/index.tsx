'use client';

import {
  AuthOptions,
  BatchOptions,
  GradeOptions,
  SessionTypeOptions,
  TestPlatformOptions,
} from '@/Constants';
import { FormBuilder } from '@/components/FormBuilder';
import { useFormContext } from '@/hooks/useFormContext';
import { setGroupDefaults } from '@/lib/utils';
import {
  FieldSchema,
  Session,
  SessionParams,
  SessionType,
  Steps,
  basicFields,
  basicSchema,
} from '@/types';
import { useParams } from 'next/navigation';
import { useCallback, useMemo, type FC } from 'react';

const BasicForm: FC = () => {
  const { type } = useParams<SessionParams>();
  const { formData, apiOptions, updateFormData } = useFormContext();

  const fieldsSchema: FieldSchema<basicFields> = useMemo(
    () => ({
      group: {
        type: 'select',
        options: apiOptions?.group,
        placeholder: 'Select a group',
        label: 'Group',
        disabled: type === SessionType.EDIT,
        setValueOnChange: (form) => setGroupDefaults(form, formData, updateFormData),
      },
      quizBatch: {
        type: 'select',
        options: BatchOptions,
        placeholder: 'Select a batch',
        label: 'Quiz Batch',
        disabled: type === SessionType.EDIT,
        setValueOnChange: (form) => {
          const { watch } = form;
          const groupValue = watch('quizBatch');
          console.log(groupValue);
          // TODO : show or hide the class batch
          // fieldsSchema.classBatch.hide = true;
        },
      },
      classBatch: {
        type: 'select',
        options: BatchOptions,
        placeholder: 'Select a batch',
        label: 'Class Batch',
        disabled: type === SessionType.EDIT,
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
        type: 'select',
        options: AuthOptions,
        label: 'Auth type',
        placeholder: 'Select a auth type',
      },
      activateSignUp: {
        type: 'switch',
        label: 'Activate sign up',
        helperText: 'Do you want to display sign up form?',
      },
      signupFormName: {
        type: 'text',
        label: 'Signup form name',
        placeholder: 'Enter form name',
      },
      isPopupForm: {
        type: 'switch',
        label: 'Is pop up form allowed',
        helperText: 'Do you want to display popup form?',
      },
      popupFormName: {
        type: 'text',
        label: 'Popup form name',
        placeholder: 'Enter form name',
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
        helperText: 'Do you want to allow redirection?',
      },
      isIdGeneration: {
        type: 'switch',
        label: 'Is id generation allowed',
        helperText: 'Do you want to generate IDs?',
      },
      platform: {
        type: 'select',
        options: TestPlatformOptions,
        placeholder: 'Select a platform',
        label: 'Platform',
        disabled: type === SessionType.EDIT,
      },
    }),
    []
  );

  const defaultValues: Partial<basicFields> = useMemo(
    () => ({
      group: formData?.meta_data?.group,
      quizBatch: formData?.meta_data?.quiz_batch,
      classBatch: formData?.meta_data?.class_batch,
      grade: formData?.meta_data?.grade,
      authType: formData?.auth_type,
      activateSignUp: formData?.signup_form,
      isPopupForm: formData?.popup_form,
      noOfFieldsInPopup: formData?.meta_data?.number_of_fields_in_popup_form
        ? Number(formData?.meta_data?.number_of_fields_in_popup_form)
        : '',
      isRedirection: formData?.redirection,
      isIdGeneration: formData?.id_generation,
      platform: formData?.platform,
      sessionType: formData?.type,
      signupFormName: formData?.meta_data?.signup_form_name,
      popupFormName: formData?.meta_data?.popup_form_name,
    }),
    [formData]
  );

  const onSubmit = useCallback((data: basicFields) => {
    const addedData: Session = {
      meta_data: {
        ...(formData.meta_data ?? {}),
        group: data.group,
        quiz_batch: data.quizBatch,
        class_batch: data.classBatch,
        grade: data.grade,
        number_of_fields_in_popup_form: data.noOfFieldsInPopup ?? '',
        signup_form_name: data.signupFormName,
        popup_form_name: data.popupFormName,
      },
      auth_type: data.authType,
      signup_form: data.activateSignUp,
      popup_form: data.isPopupForm,
      redirection: data.isRedirection,
      id_generation: data.isIdGeneration,
      platform: data.platform,
      type: data.sessionType,
    };
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
