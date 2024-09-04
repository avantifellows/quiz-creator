'use client';

import * as SwitchPrimitives from '@radix-ui/react-switch';
import * as React from 'react';

import { cn } from '@/lib/utils';
import { MySwitchProps } from '@/types';
import { ControllerRenderProps, UseFormReturn } from 'react-hook-form';
import { FormControl, FormLabel } from './form';

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-gray-300',
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        'pointer-events-none block h-5 w-5 rounded-full bg-background shadow-2xl ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0'
      )}
    />
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

const ControlledSwitchField = React.forwardRef<
  React.ElementRef<typeof FormControl>,
  { field: ControllerRenderProps } & { schema: MySwitchProps } & { form: UseFormReturn }
>(({ field, form, schema }, ref) => {
  const { value, onChange, ...restFieldProps } = field;
  const { label, onCheckedChange, type, ...restSchemaProps } = schema;

  React.useEffect(() => {
    if (onCheckedChange) {
      const value = form.watch(field.name);
      form.setValue(field.name, value, { shouldDirty: true });
      onCheckedChange(value, form);
    }
  }, [value, onCheckedChange]);

  return (
    <span className='flex flex-row justify-between items-center gap-4 mt-2'>
      <FormLabel>{label}</FormLabel>
      <FormControl ref={ref}>
        <Switch
          {...restSchemaProps}
          {...restFieldProps}
          checked={value}
          onCheckedChange={onChange}
        />
      </FormControl>
    </span>
  );
});

ControlledSwitchField.displayName = 'ControlledSwitchField';

export { ControlledSwitchField, Switch };
