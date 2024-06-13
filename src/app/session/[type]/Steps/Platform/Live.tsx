'use client';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useFormContext } from '@/hooks/useFormContext';
import { PartialSession, Steps, liveFields, liveSchema } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';

const LiveForm = () => {
  const { formData, updateFormData, pushStep } = useFormContext();

  const form = useForm<liveFields>({
    resolver: zodResolver(liveSchema),
    defaultValues: {
      // TODO: Populate default values
    },
  });

  const onSubmit = useCallback((data: liveFields) => {
    const addedData: PartialSession = {
      // TODO: add payload here
    };

    updateFormData(addedData, Steps.TIMELINE);
  }, []);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => onSubmit(data))} className="flex flex-col gap-4">
        <div className="flex gap-4 flex-col-reverse md:flex-row justify-between mt-4">
          <Button
            className="min-w-32"
            variant="outline"
            type="reset"
            onClick={() => pushStep(Steps.BASIC)}
          >
            Back
          </Button>
          <Button className="min-w-32" type="submit">
            Next
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default LiveForm;
