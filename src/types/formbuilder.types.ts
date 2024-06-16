// import type { CalendarProps } from '@/components/ui/calendar';
import { SelectProps } from '@radix-ui/react-select';
import { SwitchProps } from '@radix-ui/react-switch';
import type { FormEvent, InputHTMLAttributes } from 'react';
import { DayPickerDefaultProps } from 'react-day-picker';
import type { DefaultValues, FieldValues, SubmitHandler } from 'react-hook-form';
import type { ZodType } from 'zod';

/**
 * Form builder Props
 * @param F - The type of the form data as defined in the zod schema
 */
export interface FormBuilderProps<F extends FieldValues> {
  formSchema: FieldSchema<F>;
  zodSchema: ZodType;
  handleSubmit: SubmitHandler<F>;
  buttons?: FormButton;
  defaultValues?: DefaultValues<F>;
}

interface FormButton {
  reset?: {
    text?: string;
    hidden?: boolean;
    onClick?: (event: FormEvent) => void;
  };
  submit?: {
    text?: string;
    hidden?: boolean;
  };
}

/**
 * Form FieldSchema type
 */
export type FieldSchema<T extends Record<string, unknown>> = Record<keyof T, Field>;

// Form field types and props
export type Field = MyInputProps | MySelectProps | MySwitchProps | MyDateTimeProps;

export interface MySelectProps extends SelectProps, CommonFieldProps {
  type: 'select';
  options: Option[];
}

export interface MyInputProps extends InputHTMLAttributes<HTMLInputElement>, CommonFieldProps {}

export interface MySwitchProps extends Omit<SwitchProps, 'type' | 'ref'>, CommonFieldProps {
  type: 'switch';
}

export interface MyDateTimeProps extends CommonFieldProps, Omit<DayPickerDefaultProps, 'disabled'> {
  type: 'datetime';
  disableRange: (date: Date) => boolean;
}

export interface CommonFieldProps {
  label?: string;
  helperText?: string;
  disabled?: boolean;
  hide?: boolean;
}

export interface Option {
  label: string;
  value: string | number | boolean;
}
