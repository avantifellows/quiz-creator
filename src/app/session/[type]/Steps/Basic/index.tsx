'use client';

import { AuthOptions, GradeOptions, SessionTypeOptions, TestPlatformOptions } from '@/Constants';
import { FormBuilder } from '@/components/FormBuilder';
import { useFormContext } from '@/hooks/useFormContext';
import {
  FieldSchema,
  Platform,
  Session,
  SessionParams,
  SessionType,
  Steps,
  basicFields,
  basicSchema,
  Group,
} from '@/types';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, type FC } from 'react';
import {
  handleBatchFields,
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

  // Helper function to get batch options based on group and platform
  const getBatchOptions = useCallback(
    (group: string, platform: string) => {
      if (!group || !platform || !apiOptions?.batch || !apiOptions?.group) {
        return { parentBatchOptions: [], subBatchOptions: [] };
      }

      const isQuizSession = platform === Platform.Quiz;
      const authGroupSelected = apiOptions.group?.find((item) => item.value === group);

      if (!authGroupSelected) {
        return { parentBatchOptions: [], subBatchOptions: [] };
      }

      let filteredBatchOptions: any[] = [];

      // Apply the same filtering logic as setParentBatchOptions
      if (authGroupSelected.value === Group.TNSchools) {
        const TNStudentsId = apiOptions.group?.find((item) => item.value === Group.TNStudents)?.id;
        filteredBatchOptions =
          apiOptions?.batch?.filter(
            (item) =>
              item.groupId === TNStudentsId && (isQuizSession ? !item.parentId : !!item.parentId)
          ) ?? [];
      } else if (authGroupSelected.value === Group.GujaratSchools) {
        const GujaratStudentsId = apiOptions.group?.find(
          (item) => item.value === Group.GujaratStudents
        )?.id;
        filteredBatchOptions =
          apiOptions?.batch?.filter(
            (item) =>
              item.groupId === GujaratStudentsId &&
              (isQuizSession ? !item.parentId : !!item.parentId)
          ) ?? [];
      } else if (authGroupSelected.value === Group.PunjabSchools) {
        const PunjabStudentsId = apiOptions.group?.find(
          (item) => item.value === Group.PunjabStudents
        )?.id;
        filteredBatchOptions =
          apiOptions?.batch?.filter(
            (item) =>
              item.groupId === PunjabStudentsId &&
              (isQuizSession ? !item.parentId : !!item.parentId)
          ) ?? [];
      } else if (authGroupSelected.value === Group.EnableSchools) {
        const EnableStudentsId = apiOptions.group?.find((item) => item.value === Group.Enable)?.id;
        filteredBatchOptions =
          apiOptions?.batch?.filter(
            (item) =>
              item.groupId === EnableStudentsId &&
              (isQuizSession ? !item.parentId : !!item.parentId)
          ) ?? [];
      } else {
        filteredBatchOptions =
          apiOptions?.batch?.filter(
            (item) =>
              item.groupId === authGroupSelected?.id &&
              (isQuizSession ? !item.parentId : !!item.parentId)
          ) ?? [];
      }

      if (isQuizSession) {
        const parentBatchOptions = filteredBatchOptions;
        let subBatchOptions: any[] = [];

        // If there's a parentBatch, also set subBatch options
        if (formData?.meta_data?.parent_id) {
          const quizBatchId = apiOptions.batch?.find(
            (item) => item.value === formData.meta_data?.parent_id
          )?.id;
          subBatchOptions =
            apiOptions?.batch?.filter((item) => item.parentId === quizBatchId) ?? [];
        }

        return { parentBatchOptions, subBatchOptions };
      } else {
        return { parentBatchOptions: [], subBatchOptions: filteredBatchOptions };
      }
    },
    [apiOptions?.batch, apiOptions?.group, formData?.meta_data?.parent_id]
  );

  // Get current batch options reactively
  const currentBatchOptions = useMemo(() => {
    return getBatchOptions(formData?.meta_data?.group || '', formData?.platform || '');
  }, [formData?.meta_data?.group, formData?.platform, getBatchOptions]);

  let fieldsSchema: FieldSchema<basicFields> = useMemo(() => {
    return {
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
        onValueChange: (value, form) => handleBatchFields(value, form, apiOptions, fieldsSchema),
        helperText: `Sessions where the platform is anything other than '${Platform.Quiz}' are listed under the 'Live Classes' tab.`,
      },
      group: {
        type: 'select',
        options: apiOptions?.group,
        placeholder: 'Select a group',
        label: 'Group',
        disabled: type === SessionType.EDIT,
        onValueChange: (value, form) => {
          setParentBatchOptions(value, form, apiOptions, fieldsSchema);
          if (isMounted.current) {
            setGroupPreset(value, form, apiOptions);
          }
        },
      },
      parentBatch: {
        type: 'select',
        placeholder: 'Select a quiz batch',
        label: 'Quiz Batch',
        disabled: type === SessionType.EDIT,
        options: currentBatchOptions.parentBatchOptions,
        onValueChange: (value, form) => {
          setBatchOptions(value, form, apiOptions, fieldsSchema);
        },
      },
      subBatch: {
        type: 'multi-select',
        placeholder: 'Select a class batch',
        label: 'Class Batch',
        disabled: type === SessionType.EDIT,
        options: currentBatchOptions.subBatchOptions,
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
        onValueChange: (value, form) => {
          if (value === 'sign-up') {
            form.setValue('activateSignUp', true);
            handleSignUpFields(true, fieldsSchema, form);
          }
        },
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
    };
  }, [
    formData?.meta_data?.group,
    formData?.platform,
    formData?.meta_data?.parent_id,
    apiOptions?.batch,
    apiOptions?.group,
    currentBatchOptions,
  ]);

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
      subBatch: formData?.meta_data?.batch_id ? formData?.meta_data?.batch_id?.split(',') : [],
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
        parent_id: data.parentBatch ?? '',
        batch_id: data.subBatch ? data.subBatch.join(',') : '',
        grade: data.grade,
        number_of_fields_in_popup_form: data.isPopupForm ? (data.noOfFieldsInPopup ?? '') : '',
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
