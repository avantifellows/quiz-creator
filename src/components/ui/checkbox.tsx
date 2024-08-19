'use client';

import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';
import { MyCheckboxProps } from '@/types';
import { ControllerRenderProps, UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel } from './form';

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      'peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className={cn('flex items-center justify-center text-current')}>
      <Check className='h-4 w-4' />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

const ControlledCheckbox = React.forwardRef<
  React.ElementRef<typeof FormControl>,
  { field: ControllerRenderProps } & { schema: MyCheckboxProps } & { form: UseFormReturn }
>(({ field, form, schema }, ref) => {
  const { value, onChange, ...restFieldProps } = field;
  const { label, options = [], type, ...restSchemaProps } = schema;

  return (
    <>
      <FormLabel>{label}</FormLabel>
      {options.map((option) => (
        <FormField
          key={option.value as React.Key}
          control={form.control}
          name={field.name}
          render={({ field }) => (
            <FormItem
              key={option.value as React.Key}
              className='flex flex-row items-start space-x-3 space-y-0'
            >
              <FormControl ref={ref}>
                <Checkbox
                  {...restSchemaProps}
                  {...restFieldProps}
                  value={option.value.toString()}
                  checked={(field.value ?? [])?.includes(option.value)}
                  onCheckedChange={(checked) => {
                    return checked
                      ? field.onChange([...(field.value ?? []), option.value])
                      : field.onChange(
                          (field.value ?? [])?.filter(
                            (value: string | number | boolean) => value !== option.value
                          )
                        );
                  }}
                />
              </FormControl>
              <FormLabel className='text-sm font-normal'>{option.label}</FormLabel>
            </FormItem>
          )}
        />
      ))}
    </>
  );
});

ControlledCheckbox.displayName = 'ControlledCheckbox';

export { Checkbox, ControlledCheckbox };
