'use client';

import { AuthOptions, GradeOptions, SessionTypeOptions, TestPlatformOptions } from '@/Constants';
import { FormBuilder } from '@/components/FormBuilder';
import { useFormContext } from '@/hooks/useFormContext';
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
import { useCallback, useEffect, useMemo, useRef, type FC } from 'react';
import {
  handlePopupFields,
  handleRedirectionData,
  handleSignUpFields,
  setBatchOptions,
  setGroupPreset,
  setParentBatchOptions,
} from '../helper';

const BasicForm: FC = () => {
  const { type } = useParams<SessionParams>();
  const { formData, apiOptions = {}, updateFormData } = useFormContext();
  const isMounted = useRef(false);

  let fieldsSchema: FieldSchema<basicFields> = useMemo(
    () => ({
      name: {
        type: 'text',
        label: 'Session Name',
        placeholder: 'Enter session name',
      },
      platform: {
        type: 'select',
        options: TestPlatformOptions,
        placeholder: 'Select a platform',
        label: 'Platform',
        disabled: type === SessionType.EDIT,
      },
      group: {
        type: 'select',
        options: apiOptions?.group,
        placeholder: 'Select a group',
        label: 'Group',
        disabled: type === SessionType.EDIT,
        onValueChange: (value, form) => {
          setParentBatchOptions(value, apiOptions, fieldsSchema);
          if (isMounted.current) {
            setGroupPreset(value, form, apiOptions);
          }
        },
      },
      parentBatch: {
        required: true,
        type: 'select',
        placeholder: 'Select a quiz batch',
        label: 'Quiz Batch',
        disabled: type === SessionType.EDIT,
        onValueChange: (value, form) => {
          setBatchOptions(value, form, apiOptions, fieldsSchema);
        },
      },
      subBatch: {
        type: 'select',
        placeholder: 'Select a class batch',
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
        label: 'Session Type',
      },
      authType: {
        type: 'select',
        options: AuthOptions,
        label: 'Auth Type',
        placeholder: 'Select a auth type',
      },
      activateSignUp: {
        type: 'switch',
        label: 'Do you want to display sign up form?',
        onCheckedChange: (value, form) => handleSignUpFields(value, fieldsSchema, form),
      },
      signupFormId: {
        type: 'select',
        label: 'Signup Form Name',
        placeholder: 'Enter form name',
        options: apiOptions.signupForm,
      },
      isPopupForm: {
        type: 'switch',
        label: 'Do you want to display popup form?',
        onCheckedChange: (value, form) => handlePopupFields(value, fieldsSchema, form),
      },
      popupFormId: {
        type: 'select',
        label: 'Popup Form Name',
        placeholder: 'Enter form name',
        options: apiOptions.popupForm,
      },
      noOfFieldsInPopup: {
        type: 'number',
        label: 'No Of Fields In Popup',
        placeholder: 'Enter no of fields in popup',
        min: 0,
        step: 1,
      },
      isRedirection: {
        type: 'switch',
        label: 'Do you want to allow redirection?',
      },
      isIdGeneration: {
        type: 'switch',
        label: 'Do you want to generate IDs?',
      },
    }),
    []
  );

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const defaultValues: Partial<basicFields> = useMemo(
    () => ({
      group: formData?.meta_data?.group,
      parentBatch: formData?.meta_data?.parent_id,
      subBatch: formData?.meta_data?.batch_id,
      grade: formData?.meta_data?.grade,
      authType: formData?.auth_type,
      activateSignUp: formData?.signup_form,
      isPopupForm: formData?.popup_form,
      noOfFieldsInPopup: formData?.meta_data?.number_of_fields_in_popup_form
        ? Number(formData?.meta_data?.number_of_fields_in_popup_form)
        : '',
      isRedirection: formData?.redirection ?? true,
      isIdGeneration: formData?.id_generation,
      platform: formData?.platform,
      sessionType: formData?.type,
      signupFormId: formData?.signup_form_id,
      popupFormId: formData?.popup_form_id,
      name: formData.name,
    }),
    [formData]
  );

  const onSubmit = useCallback((data: basicFields) => {
    const addedData: Session = {
      meta_data: {
        group: data.group,
        parent_id: data.parentBatch,
        batch_id: data.subBatch,
        grade: data.grade,
        number_of_fields_in_popup_form: data.isPopupForm ? data.noOfFieldsInPopup ?? '' : '',
      },
      signup_form_id: data.activateSignUp ? data.signupFormId || null : null,
      popup_form_id: data.isPopupForm ? data.popupFormId || null : null,
      auth_type: data.authType,
      signup_form: data.activateSignUp,
      popup_form: data.isPopupForm,
      redirection: data.isRedirection,
      id_generation: data.isIdGeneration,
      platform: data.platform,
      type: data.sessionType,
      name: data.name,
    };

    if (!addedData.redirection) {
      const finalData = handleRedirectionData(addedData);
      updateFormData(finalData, Steps.TIMELINE);
    } else {
      updateFormData(addedData, Steps.PLATFORM);
    }
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
