'use client';

import { Button } from '@/components/ui/button';
import { DateTimePicker } from '@/components/ui/date-time';
import { Form, FormDescription, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { ControlledInput } from '@/components/ui/input';
import { ControlledSelectField } from '@/components/ui/select';
import { ControlledSwitchField } from '@/components/ui/switch';
import type { Field, FormBuilderProps } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { FieldValues, Path, UseFormReturn, useForm } from 'react-hook-form';

const RenderFields = <T extends FieldValues>(
  name: string,
  fieldSchema: Field,
  form: UseFormReturn<T>
) => {
  const memoSchema = useMemo(() => fieldSchema, [fieldSchema.type, fieldSchema.label]);
  let Component: any = null;

  switch (fieldSchema.type) {
    case 'select':
      Component = ControlledSelectField;
      break;
    case 'datetime':
      Component = DateTimePicker;
      break;
    case 'switch':
      Component = ControlledSwitchField;
      break;
    default:
      Component = ControlledInput;
      break;
  }

  const { hide = false, helperText, ...restProps } = memoSchema;

  if (hide) return null;

  return (
    <FormField
      key={name}
      control={form.control}
      name={name as Path<T>}
      render={({ field }) => (
        <FormItem className="relative">
          <Component {...restProps} {...field} />
          {helperText ? <FormDescription>{helperText}</FormDescription> : null}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export const FormBuilder = <T extends FieldValues>({
  formSchema,
  defaultValues,
  zodSchema,
  buttons,
  handleSubmit,
}: FormBuilderProps<T>) => {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(zodSchema),
    defaultValues,
  });

  useEffect(() => {
    if (defaultValues) {
      form.reset(defaultValues);
    }
  }, [defaultValues]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => handleSubmit(data))}
        className="flex flex-col gap-4"
      >
        {Object.entries(formSchema).map(([name, fieldSchema]) =>
          RenderFields(name, fieldSchema, form)
        )}
        <div className="flex gap-4 flex-col-reverse md:flex-row justify-between mt-4">
          {buttons?.reset?.hidden ? null : (
            <Button
              className="min-w-32"
              variant="outline"
              type="reset"
              onClick={buttons?.reset?.onClick ?? router.back}
            >
              {buttons?.reset?.text || 'Back'}
            </Button>
          )}
          {buttons?.submit?.hidden ? null : (
            <Button className="min-w-32" type="submit">
              {buttons?.submit?.text || 'Next'}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
};
