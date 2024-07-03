'use client';

import { ActiveDaysOptions } from '@/Constants';
import { FormBuilder } from '@/components/FormBuilder';
import { useFormContext } from '@/hooks/useFormContext';
import { FieldSchema, Session, timelineFields, timelineSchema } from '@/types';
import { addYears, startOfToday } from 'date-fns';
import { useCallback, useMemo, type FC } from 'react';

const TimelineForm: FC = () => {
  const { formData, isSubmiting, updateFormData, submitForm } = useFormContext();

  const fieldsSchema: FieldSchema<timelineFields> = useMemo(() => {
    return {
      startDate: {
        type: 'datetime',
        label: 'Start Date And Time',
        placeholder: 'Select start date and time',
        pagedNavigation: true,
        disableRange: (date: Date) => date < startOfToday() || date > addYears(startOfToday(), 1),
      },
      endDate: {
        type: 'datetime',
        label: 'End Date And Time',
        placeholder: 'Select end date and time',
        disableRange: (date: Date) => date < startOfToday() || date > addYears(startOfToday(), 1),
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
      start_time: new Date(data.startDate).toISOString(),
      end_time: new Date(data.endDate).toISOString(),
    };

    updateFormData(addedData);
    submitForm();
  }, []);

  return (
    <FormBuilder
      formSchema={fieldsSchema}
      zodSchema={timelineSchema}
      defaultValues={defaultValues}
      handleSubmit={onSubmit}
      buttons={{ submit: { disabled: isSubmiting } }}
    />
  );
};

export default TimelineForm;
