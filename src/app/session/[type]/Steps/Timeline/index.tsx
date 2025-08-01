'use client';

import { ActiveDaysOptions, SessionPatternOptions, ALLOWED_YEARS } from '@/Constants';
import { FormBuilder } from '@/components/FormBuilder';
import { useFormContext } from '@/hooks/useFormContext';
import { FieldSchema, Session, timelineFields, timelineSchema } from '@/types';
import { addYears, startOfToday } from 'date-fns';
import { Info } from 'lucide-react';
import { useCallback, useMemo, type FC } from 'react';

const TimelineForm: FC = () => {
  const { formData, isSubmiting, updateFormData, submitForm } = useFormContext();

  const currentSessionPattern = formData?.repeat_schedule?.type ?? 'continuous';
  const isContinuous = currentSessionPattern === 'continuous';

  const fieldsSchema: FieldSchema<timelineFields> = useMemo(() => {
    return {
      startDate: {
        type: 'datetime',
        label: {
          date: 'Start Date',
          time: 'Start Time',
        },
        placeholder: 'Select start date and time',
        disableRange: (date: Date) =>
          date < startOfToday() || date > addYears(startOfToday(), ALLOWED_YEARS),
      },
      endDate: {
        type: 'datetime',
        label: {
          date: 'End Date',
          time: 'End Time',
        },
        placeholder: 'Select end date and time',
        disableRange: (date: Date) =>
          date < startOfToday() || date > addYears(startOfToday(), ALLOWED_YEARS),
      },
      testTakers: {
        type: 'number',
        label: 'Expected Session Attendance',
        placeholder: 'Enter expected session attendance',
        min: 0,
        step: 1,
      },
      sessionPattern: {
        type: 'select',
        label: 'Session Pattern',
        placeholder: 'Choose session pattern',
        options: SessionPatternOptions,
        onValueChange: (value: string, form: any) => {
          const isContinuousPattern = value === 'continuous';

          // Set default values based on pattern type
          if (isContinuousPattern) {
            form.setValue('activeDays', [1, 2, 3, 4, 5, 6, 7]);
          }

          // Update field properties directly (similar to Quiz form pattern)
          fieldsSchema.activeDays.disabled = isContinuousPattern;

          // Update form data to trigger re-render
          const updatedData: Session = {
            repeat_schedule: {
              type: value,
              params: isContinuousPattern
                ? [1, 2, 3, 4, 5, 6, 7]
                : (formData?.repeat_schedule?.params ?? [1, 2, 3, 4, 5, 6, 7]),
            },
          };
          updateFormData(updatedData);
        },
      },
      isEnabled: {
        type: 'switch',
        label: 'Is Enabled?',
      },
      activeDays: {
        type: 'checkbox',
        label: 'Days Active',
        options: ActiveDaysOptions,
        disabled: isContinuous,
      },
    };
  }, [currentSessionPattern, isContinuous, formData, updateFormData]);

  const defaultValues: Partial<timelineFields> = useMemo(() => {
    return {
      startDate: formData?.start_time && new Date(formData?.start_time),
      endDate: formData?.end_time && new Date(formData?.end_time),
      isEnabled: formData?.is_active ?? true,
      testTakers: formData?.meta_data?.test_takers_count,
      sessionPattern: currentSessionPattern,
      // Always include activeDays - all days for continuous, selected days for weekly
      activeDays: isContinuous
        ? [1, 2, 3, 4, 5, 6, 7] // All days for continuous
        : (formData?.repeat_schedule?.params ?? [1, 2, 3, 4, 5, 6, 7]), // Selected days for weekly
    };
  }, [formData, currentSessionPattern, isContinuous]);

  const onSubmit = useCallback(
    async (data: timelineFields) => {
      // Convert dates to ISO string format instead of UTC to preserve local timezone context
      const startDate = new Date(data.startDate);
      const endDate = new Date(data.endDate);

      const addedData: Session = {
        meta_data: {
          test_takers_count: data.testTakers,
        },
        repeat_schedule: {
          type: data.sessionPattern,
          // For continuous sessions, use all days; for weekly, use selected days
          params:
            data.sessionPattern === 'continuous'
              ? [1, 2, 3, 4, 5, 6, 7]
              : (data.activeDays || []).sort((a, b) => a - b),
        },
        is_active: data.isEnabled,
        start_time: startDate.toISOString(),
        end_time: endDate.toISOString(),
      };

      updateFormData(addedData);
      submitForm();
    },
    [updateFormData, submitForm]
  );

  return (
    <>
      <p className='text-sm text-muted-foreground mb-4 text-pretty'>
        <Info className='inline-block size-3.5 md:size-4 mb-1 mr-2' />
        Configure when this session is available. Choose Continuous for 24/7 availability between
        start and end times or Weekly for specific days and times.
      </p>
      <FormBuilder
        formSchema={fieldsSchema}
        zodSchema={timelineSchema}
        defaultValues={defaultValues}
        handleSubmit={onSubmit}
        buttons={{ submit: { disabled: isSubmiting, text: 'Save & Submit' } }}
      />
    </>
  );
};

export default TimelineForm;
