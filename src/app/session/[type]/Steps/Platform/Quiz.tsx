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
  QuizLanguageOptions,
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
import { formBuilderMarker, formIdFromMarker } from '@/app/form-builder/lib/definition';
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
            form.setValue('requireAllQuestions', false);
            form.setValue('shuffle', false);
            form.setValue('stream', 'Others');
          }

          // Update field visibility and disabled states dynamically
          fieldsSchema.gurukulFormatType.disabled = isFormType || type === SessionType.EDIT;
          fieldsSchema.stream.disabled = isFormType || type === SessionType.EDIT;
          fieldsSchema.stream.disabled = isFormType; // Allow editing in edit mode
          fieldsSchema.optionalLimit.disabled = isFormType || type === SessionType.EDIT;
          fieldsSchema.isAdvancedFormat.disabled = isFormType || type === SessionType.EDIT;
          if (isFormType) {
            form.setValue('isAdvancedFormat', false);
          }
          fieldsSchema.showAnswers.disabled = isFormType;
          fieldsSchema.showScores.disabled = isFormType;
          fieldsSchema.requireAllQuestions.hide = !isFormType;
          fieldsSchema.shuffle.disabled = isFormType;
          fieldsSchema.sheetName.hide = !isFormType;
          fieldsSchema.quizLanguage.hide = isFormType;
          fieldsSchema.singlePageHeaderText.hide = !isFormType;

          // Update CMS URL field dynamically
          const cmsUrlField = fieldsSchema.cmsUrl as any;
          cmsUrlField.label = isFormType ? 'Google Sheets Link' : 'CMS URL';
          cmsUrlField.placeholder = isFormType ? 'Enter Google Sheets link' : 'Enter CMS URL';
          cmsUrlField.helperText = isFormType
            ? 'Enter the Google Sheets link containing your form questions'
            : 'Enter a legacy or new CMS test URL';
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
      // Form sessions: a form built in the Forms page (default) or a Google Sheet (legacy,
      // decision D17). These three only show for forms; see deriveHide.
      formSource: {
        type: 'select',
        options: [
          { label: 'Form builder', value: 'builder' },
          { label: 'Google Sheet (legacy)', value: 'sheet' },
        ],
        label: 'Form Source',
        placeholder: 'Where the form comes from',
        disabled: type === SessionType.EDIT,
        deriveHide: (values) => values.testType !== 'form',
      },
      formId: {
        type: 'form-picker',
        label: 'Form',
        placeholder: 'Search your saved forms',
        disabled: type === SessionType.EDIT,
        helperText:
          'Only complete forms are listed. Once a session uses a form, the form can no longer be edited.',
        deriveHide: (values) => values.testType !== 'form' || values.formSource === 'sheet',
      },
      // the picked form's languages, kept by the picker (decides which languages are offered)
      formLanguages: { type: 'text', hide: true },
      // Same choice and labels as the new-CMS "Quiz Language", limited to the languages the
      // picked form has (decision D21: English, or English + one more, shown stacked).
      formLanguage: {
        type: 'select',
        options: QuizLanguageOptions,
        deriveOptions: (values) =>
          QuizLanguageOptions.filter(
            (option) =>
              option.value === 'en' || (values.formLanguages ?? []).includes(option.value as string)
          ),
        placeholder: 'Select the form language',
        label: 'Form Language',
        disabled: type === SessionType.EDIT,
        helperText:
          'Lists the languages this form has. English is always shown; another language appears below it.',
        deriveHide: (values) => values.testType !== 'form' || values.formSource === 'sheet',
      },
      cmsUrl: {
        type: 'text',
        deriveHide: (values) => values.testType === 'form' && values.formSource !== 'sheet',
        label: isForm ? 'Google Sheets Link' : 'CMS URL',
        placeholder: isForm ? 'Enter Google Sheets link' : 'Enter CMS URL',
        disabled: type === SessionType.EDIT,
        helperText: isForm
          ? 'Enter the Google Sheets link containing your form questions'
          : 'Enter a legacy or new CMS test URL',
      },
      quizLanguage: {
        type: 'select',
        options: QuizLanguageOptions,
        placeholder: 'Select the quiz language',
        label: 'Quiz Language (bilingual, if available)',
        disabled: type === SessionType.EDIT,
        hide: isForm,
        helperText:
          'New CMS tests only. Shows the chosen language under the English for questions translated in the CMS; the rest stay in English.',
      },
      sheetName: {
        type: 'text',
        label: 'Sheet Name',
        placeholder: 'Enter the sheet name within the Google Sheets',
        disabled: type === SessionType.EDIT,
        hide: !isForm,
        deriveHide: (values) => values.formSource !== 'sheet',
        helperText: 'Specify which sheet/tab to use from the Google Sheets document',
      },
      singlePageHeaderText: {
        type: 'text',
        label: 'Single Page Header Text',
        placeholder: 'Enter the header text to display on the form',
        hide: !isForm,
        helperText: 'This text will appear as a header on the single page form',
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
      isAdvancedFormat: {
        type: 'switch',
        label: 'Advanced Format?',
        defaultValue: 'No',
        hide: false,
        disabled: isForm || type === SessionType.EDIT,
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
      requireAllQuestions: {
        type: 'switch',
        label: 'Require all questions?',
        defaultValue: 'No',
        hide: !isForm,
        // a form-builder form sets Required per question itself
        deriveHide: (values) => values.formSource !== 'sheet',
      },
      hideInGurukul: {
        type: 'switch',
        label: 'Hide from Gurukul home screen?',
        defaultValue: 'No',
        hide: false,
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
      // A form-builder session stores "form-builder:<id>" in cms_test_id; any other form
      // session with a cms_test_id is a Google Sheet one.
      formSource:
        formData.meta_data?.test_type === 'form' &&
        formData.meta_data?.cms_test_id &&
        !formIdFromMarker(formData.meta_data.cms_test_id)
          ? 'sheet'
          : 'builder',
      formId: formIdFromMarker(formData.meta_data?.cms_test_id) ?? undefined,
      formLanguages: [],
      formLanguage:
        (formData.meta_data?.test_type === 'form' && formData.meta_data?.lang_code) || 'en',
      cmsUrl: formIdFromMarker(formData.meta_data?.cms_test_id)
        ? ''
        : formData.meta_data?.cms_test_id,
      quizLanguage: formData.meta_data?.lang_code || 'en',
      sheetName: formData.meta_data?.sheet_name,
      singlePageHeaderText: formData.meta_data?.single_page_header_text || '',
      markingScheme: formData.meta_data?.marking_scheme,
      optionalLimit: formData.meta_data?.optional_limits,
      isAdvancedFormat: formData.meta_data?.is_advanced_format == true ? true : false,
      showAnswers: formData.meta_data?.show_answers == false ? false : true,
      showScores: formData.meta_data?.show_scores == false ? false : true,
      requireAllQuestions: formData.meta_data?.require_all_questions == true ? true : false,
      hideInGurukul: formData.meta_data?.hide_in_gurukul == true ? true : false,
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
      const isBuilderForm = isForm && data.formSource !== 'sheet';

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
          is_advanced_format: isForm ? false : data.isAdvancedFormat,
          cms_test_id: isEditMode
            ? formData.meta_data?.cms_test_id
            : isBuilderForm
              ? formBuilderMarker(data.formId!)
              : cmsTestId,
          // Language can't change after create: regenerate is blocked for new-CMS sessions.
          // A form-builder form shows English, plus the chosen language (decision D21).
          lang_code: isEditMode
            ? formData.meta_data?.lang_code
            : isBuilderForm
              ? data.formLanguage && data.formLanguage !== 'en'
                ? data.formLanguage
                : undefined
              : !isForm && data.quizLanguage && data.quizLanguage !== 'en'
                ? data.quizLanguage
                : undefined,
          ...(isForm &&
            !isBuilderForm &&
            data.sheetName && {
              sheet_name: isEditMode ? formData.meta_data?.sheet_name : data.sheetName,
            }),
          ...(isForm &&
            data.singlePageHeaderText && {
              single_page_header_text: data.singlePageHeaderText,
            }),
          require_all_questions:
            isForm && !isBuilderForm ? data.requireAllQuestions == true : false,
          hide_in_gurukul: data.hideInGurukul == true,
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
