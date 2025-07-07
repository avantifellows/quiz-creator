import * as React from 'react';
import { cn } from '@/lib/utils';
import { MyInputProps, MyFileProps } from '@/types';
import { ControllerRenderProps, UseFormReturn } from 'react-hook-form';
import { FormControl, FormLabel } from './form';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground/80 placeholder:italic focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

const ControlledInput = React.forwardRef<
  HTMLInputElement,
  { field: ControllerRenderProps } & { schema: MyInputProps } & { form: UseFormReturn }
>(({ field, form, schema }, ref) => {
  const { value = '', ...restFieldProps } = field;
  const { label, onValueChange, ...restSchemaProps } = schema;

  React.useEffect(() => {
    if (onValueChange) {
      const value = form.watch(field.name);
      form.setValue(field.name, value, { shouldDirty: true });
      onValueChange(value, form);
    }
  }, [value, onValueChange]);

  return (
    <>
      <FormLabel>{label}</FormLabel>
      <FormControl ref={ref}>
        <Input {...restSchemaProps} {...restFieldProps} value={value} />
      </FormControl>
    </>
  );
});

ControlledInput.displayName = 'ControlledInput';

const ControlledFileInput = React.forwardRef<
  HTMLInputElement,
  { field: ControllerRenderProps } & { schema: MyFileProps } & { form: UseFormReturn }
>(({ field, form, schema }, ref) => {
  const { label, onValueChange, type, ...restSchemaProps } = schema;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Store the file name in the form field
      field.onChange(file.name);
      if (onValueChange) {
        onValueChange(file.name, form);
      }
    }
  };

  return (
    <>
      <FormLabel>{label}</FormLabel>
      <FormControl ref={ref}>
        <Input
          type='file'
          accept='.csv'
          onChange={handleFileChange}
          disabled={schema.disabled}
          {...restSchemaProps}
        />
      </FormControl>
    </>
  );
});

ControlledFileInput.displayName = 'ControlledFileInput';

export { ControlledInput, ControlledFileInput, Input };
