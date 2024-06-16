'use client';

import {
  CourseOptions,
  MarkingSchemeOptions,
  OptionalLimitOptions,
  StreamOptions,
  TestFormatOptions,
  TestPurposeOptions,
  TestTypeOptions,
} from '@/Constants';
import { FormBuilder } from '@/components/FormBuilder';
import { useFormContext } from '@/hooks/useFormContext';
import {
  FieldSchema,
  Session,
  SessionParams,
  SessionType,
  Steps,
  quizFields,
  quizSchema,
} from '@/types';
import { useParams } from 'next/navigation';
import { useCallback, useMemo, type FC } from 'react';

const QuizForm: FC = () => {
  const { type } = useParams<SessionParams>();
  const { formData, updateFormData } = useFormContext();

  const fieldsSchema: FieldSchema<quizFields> = useMemo(
    () => ({
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
        label: 'Test format',
      },
      testPurpose: {
        type: 'select',
        options: TestPurposeOptions,
        placeholder: 'Select a test purpose',
        label: 'Test purpose',
      },
      name: {
        type: 'text',
        label: 'Quiz name',
        placeholder: 'Enter quiz name',
      },
      testType: {
        type: 'select',
        options: TestTypeOptions,
        placeholder: 'Select a test type',
        label: 'Test type',
        disabled: type === SessionType.EDIT,
      },
      cmsUrl: {
        type: 'text',
        label: 'Cms url',
        placeholder: 'Enter cms url',
        disabled: type === SessionType.EDIT,
      },
      markingScheme: {
        type: 'select',
        options: MarkingSchemeOptions,
        placeholder: 'Select a marking scheme',
        label: 'Marking scheme',
        disabled: type === SessionType.EDIT,
      },
      optionalLimit: {
        type: 'select',
        options: OptionalLimitOptions,
        placeholder: 'Select an optional limit',
        label: 'Optional limit',
        disabled: type === SessionType.EDIT,
      },
    }),
    []
  );

  const defaultValues: Partial<quizFields> = useMemo(
    () => ({
      name: formData.name,
      course: formData.meta_data?.course,
      stream: formData.meta_data?.stream,
      testFormat: formData.meta_data?.test_format,
      testPurpose: formData.meta_data?.test_purpose,
      testType: formData.meta_data?.test_type,
      cmsUrl: formData.meta_data?.cms_test_id,
      markingScheme: formData.meta_data?.marking_scheme,
      optionalLimit: formData.meta_data?.optional_limits,
    }),
    [formData]
  );

  const onSubmit = useCallback((data: quizFields) => {
    const addedData: Session = {
      name: data.name,
      meta_data: {
        ...(formData.meta_data ?? {}),
        course: data.course,
        stream: data.stream,
        test_format: data.testFormat,
        test_purpose: data.testPurpose,
        test_type: data.testType,
        marking_scheme: data.markingScheme,
        optional_limits: data.optionalLimit,
        cms_test_id: data.cmsUrl,
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
