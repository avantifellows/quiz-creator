'use client';

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
        label: 'Start Date and Time',
        placeholder: 'Select start date and time',
        pagedNavigation: true,
        disableRange: (date: Date) => date < startOfToday() || date > addYears(startOfToday(), 1),
      },
      endDate: {
        type: 'datetime',
        label: 'End Date and Time',
        placeholder: 'Select end date and time',
        disableRange: (date: Date) => date < startOfToday() || date > addYears(startOfToday(), 1),
      },
      testTakers: {
        type: 'number',
        label: 'Test Takers',
        placeholder: 'Enter number of test takers',
        min: 0,
        step: 1,
      },
      // activeDays: {
      //   type: 'checkbox',
      //   label: 'Days Active',
      //   options: ActiveDaysOptions,
      // },
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
      isEnabled: formData?.meta_data?.enabled ? true : false,
      // activeDays: formData?.meta_data.acti ? 'all' : 'none',
      testTakers: formData?.meta_data?.test_takers_count,
    }),
    [formData]
  );

  const onSubmit = useCallback(async (data: timelineFields) => {
    const addedData: Session = {
      meta_data: {
        ...(formData.meta_data ?? {}),
        test_takers_count: data.testTakers,
        enabled: data.isEnabled ? 1 : 0,
      },
      start_time: data.startDate,
      end_time: data.endDate,
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
    />
  );
};

export default TimelineForm;
