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
import { handleNextStepFields } from '../helper';

const QuizForm: FC = () => {
  const { type } = useParams<SessionParams>();
  const { formData, updateFormData } = useFormContext();

  const fieldsSchema: FieldSchema<quizFields> = {
    course: {
      type: 'select',
      options: CourseOptions,
      placeholder: 'Select a course',
      label: 'Course',
    },
    stream: {
      type: 'select',
      options: StreamOptions,
      placeholder: 'Select a stream',
      label: 'Stream',
    },
    testFormat: {
      type: 'select',
      options: TestFormatOptions,
      placeholder: 'Select a test format',
      label: 'Test Format',
    },
    testPurpose: {
      type: 'select',
      options: TestPurposeOptions,
      placeholder: 'Select a test purpose',
      label: 'Test Purpose',
    },
    testType: {
      type: 'select',
      options: TestTypeOptions,
      placeholder: 'Select a test type',
      label: 'Test Type',
      disabled: type === SessionType.EDIT,
    },
    gurukulFormatType: {
      type: 'select',
      options: GurukulFormatOptions,
      placeholder: 'Select the Quiz Format to display on Gurukul',
      label: 'Quiz Display Format',
    },
    cmsUrl: {
      type: 'text',
      label: 'Cms Url',
      placeholder: 'Enter cms url',
      disabled: type === SessionType.EDIT,
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
      disabled: type === SessionType.EDIT,
    },
    showAnswers: {
      type: 'switch',
      label: 'Show Answers?',
      defaultValue: 'Yes',
    },
    showScores: {
      type: 'switch',
      label: 'Show Scores?',
      defaultValue: 'Yes',
    },
    shuffle: {
      type: 'switch',
      label: 'Shuffle Questions?',
      defaultValue: 'No',
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

  const defaultValues: Partial<quizFields> = useMemo(
    () => ({
      course: formData.meta_data?.course,
      stream: formData.meta_data?.stream,
      testFormat: formData.meta_data?.test_format,
      testPurpose: formData.meta_data?.test_purpose,
      testType: formData.meta_data?.test_type,
      gurukulFormatType: formData.meta_data?.gurukul_format_type,
      cmsUrl: formData.meta_data?.cms_test_id,
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

  const onSubmit = useCallback((data: quizFields) => {
    const isHomework = data.testType === 'homework';

    const addedData: Session = {
      meta_data: {
        course: data.course,
        stream: data.stream,
        test_format: data.testFormat,
        test_purpose: data.testPurpose,
        test_type: data.testType,
        gurukul_format_type: data.gurukulFormatType,
        marking_scheme: isHomework ? MARKING_SCHEMES['1, 0'] : MARKING_SCHEMES['4,-1'],
        optional_limits: data.optionalLimit,
        cms_test_id: data.cmsUrl,
        show_answers: data.showAnswers,
        show_scores: data.showScores,
        shuffle: data.shuffle,
        next_step_url: data.hasNextStep ? data.nextStepUrl : undefined,
        next_step_text: data.hasNextStep ? data.nextStepText : undefined,
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
