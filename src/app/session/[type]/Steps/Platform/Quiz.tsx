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

          // No need to hide fields - just update labels via schema
          fieldsSchema.testFormat.disabled = isFormType || type === SessionType.EDIT;
          fieldsSchema.gurukulFormatType.disabled = isFormType || type === SessionType.EDIT;
          fieldsSchema.stream.disabled = isFormType || type === SessionType.EDIT;
          fieldsSchema.optionalLimit.disabled = isFormType || type === SessionType.EDIT;
          fieldsSchema.showAnswers.disabled = isFormType;
          fieldsSchema.showScores.disabled = isFormType;
          fieldsSchema.shuffle.disabled = isFormType;
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
        disabled: isForm || type === SessionType.EDIT,
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
        disabled: isForm || type === SessionType.EDIT,
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
    };
  }, [type, formData.meta_data?.test_type, isForm]);

  const defaultValues: Partial<quizFields> = useMemo(
    () => ({
      testType: formData.meta_data?.test_type,
      course: formData.meta_data?.course,
      stream: formData.meta_data?.stream,
      testFormat: formData.meta_data?.test_format,
      testPurpose: formData.meta_data?.test_purpose,
      gurukulFormatType: formData.meta_data?.gurukul_format_type,
      cmsUrl: formData.meta_data?.cms_test_id,
      markingScheme: formData.meta_data?.marking_scheme,
      optionalLimit: formData.meta_data?.optional_limits,
      showAnswers: formData.meta_data?.show_answers == false ? false : true,
      showScores: formData.meta_data?.show_scores == false ? false : true,
      shuffle: formData.meta_data?.shuffle == true ? true : false,
    }),
    [formData]
  );

  const onSubmit = useCallback((data: quizFields) => {
    const isHomework = data.testType === 'homework';
    const isForm = data.testType === 'form';

    // Use CMS URL for all test types (Google Sheets link for forms, CMS URL for others)
    const cmsTestId = data.cmsUrl;

    const addedData: Session = {
      meta_data: {
        course: data.course,
        stream: data.stream,
        test_format: data.testFormat,
        test_purpose: data.testPurpose,
        test_type: data.testType,
        gurukul_format_type: data.gurukulFormatType,
        marking_scheme: isHomework || isForm ? MARKING_SCHEMES['1, 0'] : MARKING_SCHEMES['4,-1'],
        optional_limits: data.optionalLimit,
        cms_test_id: cmsTestId,
        show_answers: data.showAnswers,
        show_scores: data.showScores,
        shuffle: data.shuffle,
      },
    };
    updateFormData(addedData, Steps.TIMELINE);
  }, []);

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
