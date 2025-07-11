'use client';

import {
  CourseOptions,
  MarkingSchemeOptions,
  OptionalLimitOptions,
  StreamOptions,
  TestFormatOptions,
  TestPurposeOptions,
  TestTypeOptions,
  GurukulFormatOptions,
} from '@/Constants';
import { FormBuilder } from '@/components/FormBuilder';
import { useFormContext } from '@/hooks/useFormContext';
import {
  FieldSchema,
  MARKING_SCHEMES,
  Session,
  SessionParams,
  SessionType,
  Steps,
  quizFields,
  quizSchema,
} from '@/types';
import { useParams } from 'next/navigation';
import { useCallback, useMemo, type FC } from 'react';
import React from 'react';
import { handleNextStepFields } from '../helper';

const QuizForm: FC = () => {
  const { type } = useParams<SessionParams>();
  const { formData, updateFormData } = useFormContext();

  const currentTestType = formData.meta_data?.test_type;
  const isForm = currentTestType === 'form';

  const fieldsSchema: FieldSchema<quizFields> = useMemo(() => {
    return {
      testType: {
        type: 'select',
        options: TestTypeOptions,
        placeholder: 'Select a test type',
        label: 'Test Type',
        disabled: type === SessionType.EDIT,
        onValueChange: (value, form) => {
          const isFormType = value === 'form';

          // Set appropriate defaults when form is selected
          if (isFormType) {
            form.setValue('testFormat', 'questionnaire');
            form.setValue('gurukulFormatType', 'qa');
            form.setValue('markingScheme', MARKING_SCHEMES['1, 0']);
            form.setValue('optionalLimit', 'N/A');
            form.setValue('showAnswers', true);
            form.setValue('showScores', false);
            form.setValue('shuffle', false);
            form.setValue('stream', 'Others');
          }

          // Update field visibility and disabled states dynamically
          fieldsSchema.testFormat.disabled = isFormType || type === SessionType.EDIT;
          fieldsSchema.gurukulFormatType.disabled = isFormType; // Allow editing in edit mode
          fieldsSchema.stream.disabled = isFormType; // Allow editing in edit mode
          fieldsSchema.optionalLimit.disabled = isFormType || type === SessionType.EDIT;
          fieldsSchema.showAnswers.disabled = isFormType;
          fieldsSchema.showScores.disabled = isFormType;
          fieldsSchema.shuffle.disabled = isFormType;
          fieldsSchema.sheetName.hide = !isFormType;

          // Update CMS URL field dynamically
          const cmsUrlField = fieldsSchema.cmsUrl as any;
          cmsUrlField.label = isFormType ? 'Google Sheets Link' : 'CMS URL';
          cmsUrlField.placeholder = isFormType ? 'Enter Google Sheets link' : 'Enter CMS URL';
          cmsUrlField.helperText = isFormType
            ? 'Enter the Google Sheets link containing your form questions'
            : 'Enter the CMS URL for your quiz content';
        },
      },
      course: {
        type: 'select',
        options: CourseOptions,
        placeholder: 'Select a course',
        label: 'Course',
        hide: false,
      },
      stream: {
        type: 'select',
        options: StreamOptions,
        placeholder: 'Select a stream',
        label: 'Stream',
        hide: false,
        disabled: isForm, // Allow editing in edit mode
      },
      testFormat: {
        type: 'select',
        options: TestFormatOptions,
        placeholder: 'Select a test format',
        label: 'Test Format',
        hide: false,
        disabled: isForm || type === SessionType.EDIT,
      },
      testPurpose: {
        type: 'select',
        options: TestPurposeOptions,
        placeholder: 'Select a test purpose',
        label: 'Test Purpose',
        hide: false,
      },
      gurukulFormatType: {
        type: 'select',
        options: GurukulFormatOptions,
        placeholder: 'Select the Quiz Format to display on Gurukul',
        label: 'Quiz Display Format',
        hide: false,
        disabled: isForm, // Allow editing in edit mode
      },
      cmsUrl: {
        type: 'text',
        label: isForm ? 'Google Sheets Link' : 'CMS URL',
        placeholder: isForm ? 'Enter Google Sheets link' : 'Enter CMS URL',
        disabled: type === SessionType.EDIT,
        helperText: isForm
          ? 'Enter the Google Sheets link containing your form questions'
          : 'Enter the CMS URL for your quiz content',
      },
      sheetName: {
        type: 'text',
        label: 'Sheet Name',
        placeholder: 'Enter the sheet name within the Google Sheets',
        disabled: type === SessionType.EDIT,
        hide: !isForm,
        helperText: 'Specify which sheet/tab to use from the Google Sheets document',
      },
      markingScheme: {
        type: 'select',
        options: MarkingSchemeOptions,
        placeholder: 'Select a marking scheme',
        label: 'Marking Scheme',
        disabled: type === SessionType.EDIT,
        hide: true,
      },
      optionalLimit: {
        type: 'select',
        options: OptionalLimitOptions,
        placeholder: 'Select an optional limit',
        label: 'Optional Limit',
        disabled: isForm || type === SessionType.EDIT,
        hide: false,
      },
      showAnswers: {
        type: 'switch',
        label: 'Show Answers?',
        defaultValue: 'Yes',
        hide: false,
        disabled: isForm,
      },
      showScores: {
        type: 'switch',
        label: 'Show Scores?',
        defaultValue: 'Yes',
        hide: false,
        disabled: isForm,
      },
      shuffle: {
        type: 'switch',
        label: 'Shuffle Questions?',
        defaultValue: 'No',
        hide: false,
        disabled: isForm,
      },
      hasNextStep: {
        type: 'switch',
        label: 'Do you want to attach a next step?',
        onCheckedChange: (value, form) => handleNextStepFields(value, fieldsSchema, form),
      },
      nextStepUrl: {
        type: 'text',
        label: 'Next Step URL',
        placeholder: 'Enter the URL for the next step',
        hide: true,
      },
      nextStepText: {
        type: 'text',
        label: 'Next Step Button Text',
        placeholder: 'Enter the button text (e.g., "Proceed to Quiz")',
        hide: true,
      },
    };
  }, [type, formData.meta_data?.test_type, isForm]);

  const defaultValues: Partial<quizFields> = useMemo(
    () => ({
      testType: formData.meta_data?.test_type,
      course: formData.meta_data?.course,
      stream: formData.meta_data?.stream,
      testFormat: formData.meta_data?.test_format,
      testPurpose: formData.meta_data?.test_purpose,
      gurukulFormatType: formData.meta_data?.gurukul_format_type || 'qa',
      cmsUrl: formData.meta_data?.cms_test_id,
      sheetName: formData.meta_data?.sheet_name,
      markingScheme: formData.meta_data?.marking_scheme,
      optionalLimit: formData.meta_data?.optional_limits,
      showAnswers: formData.meta_data?.show_answers == false ? false : true,
      showScores: formData.meta_data?.show_scores == false ? false : true,
      shuffle: formData.meta_data?.shuffle == true ? true : false,
      hasNextStep: formData.meta_data?.next_step_url ? true : false,
      nextStepUrl: formData.meta_data?.next_step_url || '',
      nextStepText: formData.meta_data?.next_step_text || '',
    }),
    [formData]
  );

  const onSubmit = useCallback(
    (data: quizFields) => {
      const isHomework = data.testType === 'homework';
      const isForm = data.testType === 'form';

      // Use CMS URL for all test types (Google Sheets link for forms, CMS URL for others)
      const cmsTestId = data.cmsUrl;

      // In edit mode, preserve original values for disabled fields
      const isEditMode = type === SessionType.EDIT;

      const addedData: Session = {
        meta_data: {
          course: data.course,
          stream: data.stream, // Allow editing in edit mode
          test_format: isEditMode && !isForm ? formData.meta_data?.test_format : data.testFormat,
          test_purpose: data.testPurpose,
          test_type: data.testType,
          gurukul_format_type: data.gurukulFormatType, // Allow editing in edit mode
          marking_scheme: isHomework || isForm ? MARKING_SCHEMES['1, 0'] : MARKING_SCHEMES['4,-1'],
          optional_limits:
            isEditMode && !isForm ? formData.meta_data?.optional_limits : data.optionalLimit,
          cms_test_id: isEditMode ? formData.meta_data?.cms_test_id : cmsTestId,
          ...(isForm &&
            data.sheetName && {
              sheet_name: isEditMode ? formData.meta_data?.sheet_name : data.sheetName,
            }),
          show_answers: data.showAnswers,
          show_scores: data.showScores,
          shuffle: data.shuffle,
          next_step_url: data.hasNextStep ? data.nextStepUrl : undefined,
          next_step_text: data.hasNextStep ? data.nextStepText : undefined,
        },
      };
      updateFormData(addedData, Steps.TIMELINE);
    },
    [type, formData, isForm]
  );

  return (
    <FormBuilder
      formSchema={fieldsSchema}
      zodSchema={quizSchema}
      defaultValues={defaultValues}
      handleSubmit={onSubmit}
    />
  );
};

export default QuizForm;
