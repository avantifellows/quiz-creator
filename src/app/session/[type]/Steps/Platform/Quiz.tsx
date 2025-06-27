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

// Custom FormBuilder that watches form values
const DynamicFormBuilder = ({ formSchema, zodSchema, defaultValues, handleSubmit }: any) => {
  const [watchedTestType, setWatchedTestType] = React.useState('');

  // Create a modified schema based on the watched test type
  const dynamicSchema = useMemo(() => {
    const isForm = watchedTestType === 'form';

    return Object.keys(formSchema).reduce((acc, key) => {
      const field = { ...formSchema[key] };

      // Apply dynamic disabling based on test type
      if (
        isForm &&
        [
          'testFormat',
          'gurukulFormatType',
          'stream',
          'optionalLimit',
          'showAnswers',
          'showScores',
          'shuffle',
        ].includes(key)
      ) {
        field.disabled = true;
      }

      // Add onValueChange for testType to track changes
      if (key === 'testType') {
        const originalOnValueChange = field.onValueChange;
        field.onValueChange = (value: string, form: any) => {
          setWatchedTestType(value);
          if (originalOnValueChange) {
            originalOnValueChange(value, form);
          }
        };
      }

      acc[key] = field;
      return acc;
    }, {} as any);
  }, [formSchema, watchedTestType]);

  // Set initial watched type from default values
  React.useEffect(() => {
    if (defaultValues?.testType) {
      setWatchedTestType(defaultValues.testType);
    }
  }, [defaultValues?.testType]);

  return (
    <FormBuilder
      formSchema={dynamicSchema}
      zodSchema={zodSchema}
      defaultValues={defaultValues}
      handleSubmit={handleSubmit}
    />
  );
};

const QuizForm: FC = () => {
  const { type } = useParams<SessionParams>();
  const { formData, updateFormData } = useFormContext();

  const fieldsSchema: FieldSchema<quizFields> = useMemo(() => {
    return {
      testType: {
        type: 'select',
        options: TestTypeOptions,
        placeholder: 'Select a test type',
        label: 'Test Type',
        disabled: type === SessionType.EDIT,
        onValueChange: (value, form) => {
          console.log('Test type changed to:', value);
          // Set appropriate defaults when form is selected
          if (value === 'form') {
            form.setValue('testFormat', 'questionnaire');
            form.setValue('gurukulFormatType', 'qa');
            form.setValue('markingScheme', MARKING_SCHEMES['1, 0']);
            form.setValue('optionalLimit', 'N/A');
            form.setValue('showAnswers', false);
            form.setValue('showScores', false);
            form.setValue('shuffle', false);
            form.setValue('stream', 'Others');
            // Clear CMS URL when switching to form
            form.setValue('cmsUrl', '');
          } else {
            // Clear CSV file when switching away from form
            form.setValue('csvFile', '');
          }
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
      },
      testFormat: {
        type: 'select',
        options: TestFormatOptions,
        placeholder: 'Select a test format',
        label: 'Test Format',
        hide: false,
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
      },
      cmsUrl: {
        type: 'text',
        label: 'CMS URL (for Assessment/Homework)',
        placeholder: 'Enter CMS URL',
        disabled: type === SessionType.EDIT,
        helperText: 'Enter the CMS URL for your quiz content (leave empty for forms)',
      },
      csvFile: {
        type: 'file',
        label: 'CSV File (for Forms only)',
        disabled: type === SessionType.EDIT,
        helperText: 'Upload a CSV file containing your form questions (only required for forms)',
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
        hide: false,
      },
      showAnswers: {
        type: 'switch',
        label: 'Show Answers?',
        defaultValue: 'Yes',
        hide: false,
      },
      showScores: {
        type: 'switch',
        label: 'Show Scores?',
        defaultValue: 'Yes',
        hide: false,
      },
      shuffle: {
        type: 'switch',
        label: 'Shuffle Questions?',
        defaultValue: 'No',
        hide: false,
      },
    };
  }, [type, formData.meta_data?.test_type]);

  const defaultValues: Partial<quizFields> = useMemo(
    () => ({
      testType: formData.meta_data?.test_type,
      course: formData.meta_data?.course,
      stream: formData.meta_data?.stream,
      testFormat: formData.meta_data?.test_format,
      testPurpose: formData.meta_data?.test_purpose,
      gurukulFormatType: formData.meta_data?.gurukul_format_type,
      cmsUrl: formData.meta_data?.cms_test_id,
      csvFile: '', // Initialize empty for file upload
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

    // Use CSV file name if it's a form, otherwise use CMS URL
    const cmsTestId = isForm ? data.csvFile : data.cmsUrl;

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
    <DynamicFormBuilder
      formSchema={fieldsSchema}
      zodSchema={quizSchema}
      defaultValues={defaultValues}
      handleSubmit={onSubmit}
    />
  );
};

export default QuizForm;
