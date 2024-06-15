import * as React from 'react';

import { cn } from '@/lib/utils';
import { MyInputProps } from '@/types';
import { FormControl, FormLabel } from './form';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

const ControlledInput = React.forwardRef<HTMLInputElement, MyInputProps>(({ ...props }, ref) => {
  const { onChange, value = '', label, ...restProps } = props;

  return (
    <>
      <FormLabel>{label}</FormLabel>
      <FormControl ref={ref}>
        <Input onChange={onChange} value={value ?? ''} {...restProps} />
      </FormControl>
    </>
  );
});

ControlledInput.displayName = 'ControlledInput';

export { ControlledInput, Input };
