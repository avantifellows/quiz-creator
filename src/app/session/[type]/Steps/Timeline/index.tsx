'use client';

import { ActiveDaysOptions, ALLOWED_YEARS } from '@/Constants';
import { FormBuilder } from '@/components/FormBuilder';
import { useFormContext } from '@/hooks/useFormContext';
import { FieldSchema, Session, timelineFields, timelineSchema } from '@/types';
import { addYears, startOfToday } from 'date-fns';
import { Info } from 'lucide-react';
import { useCallback, useMemo, type FC } from 'react';

const TimelineForm: FC = () => {
  const { formData, isSubmiting, updateFormData, submitForm } = useFormContext();

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
      activeDays: {
        type: 'checkbox',
        label: 'Days Active',
        options: ActiveDaysOptions,
      },
      isEnabled: {
        type: 'switch',
        label: 'Is Enabled?',
      },
    };
  }, []);

  const defaultValues: Partial<timelineFields> = useMemo(
    () => ({
      startDate: formData?.start_time && new Date(formData?.start_time),
      endDate: formData?.end_time && new Date(formData?.end_time),
      isEnabled: formData?.is_active ?? true,
      activeDays: formData?.repeat_schedule?.params ?? [1, 2, 3, 4, 5, 6, 7],
      testTakers: formData?.meta_data?.test_takers_count,
    }),
    [formData]
  );

  const onSubmit = useCallback(async (data: timelineFields) => {
    const addedData: Session = {
      meta_data: {
        test_takers_count: data.testTakers,
      },
      repeat_schedule: {
        type: 'weekly',
        params: data.activeDays.sort((a, b) => a - b),
      },
      is_active: data.isEnabled,
      start_time: new Date(data.startDate).toUTCString(),
      end_time: new Date(data.endDate).toUTCString(),
    };

    updateFormData(addedData);
    submitForm();
  }, []);

  return (
    <>
      <p className='text-sm text-muted-foreground mb-4 text-pretty'>
        <Info className='inline-block size-3.5 md:size-4 mb-1 mr-2' />
        Select the time period for this session to be active for each day.
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
