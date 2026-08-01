// import type { CalendarProps } from '@/components/ui/calendar';
import { MultiSelectorProps } from '@/components/ui/multi-select';
import { CheckboxProps } from '@radix-ui/react-checkbox';
import { SelectProps } from '@radix-ui/react-select';
import { SwitchProps } from '@radix-ui/react-switch';
import type { FormEvent, InputHTMLAttributes } from 'react';
import { DayPickerDefaultProps } from 'react-day-picker';
import type { DefaultValues, FieldValues, SubmitHandler, UseFormReturn } from 'react-hook-form';
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
    disabled?: boolean;
  };
}

/**
 * Form FieldSchema type
 */
export type FieldSchema<T extends Record<string, unknown>> = Record<keyof T, Field>;

// Form field types and props
export type Field =
  | MyInputProps
  | MySelectProps
  | MySwitchProps
  | MyDateTimeProps
  | MyCheckboxProps
  | MyMultiSelectProps
  | MyFileProps;

export interface MySelectProps extends Omit<SelectProps, 'onValueChange'>, CommonFieldProps {
  type: 'select';
  options: Option[];
  onValueChange?: (value: string, form: UseFormReturn) => void;
}

export interface MyMultiSelectProps
  extends Omit<MultiSelectorProps, 'onValueChange' | 'values' | 'onValuesChange'>,
    CommonFieldProps {
  type: 'multi-select';
  options: Option[];
  // `values`/`onValuesChange` are supplied by ControlledMultiSelectField from the
  // react-hook-form field, so a field schema must not have to declare them.
  values?: string[];
  onValuesChange?: (value: string[]) => void;
  onValueChange?: (value: string[], form: UseFormReturn) => void;
}

export interface MyCheckboxProps extends Omit<CheckboxProps, 'type'>, CommonFieldProps {
  type: 'checkbox';
  options: Option[];
}

export interface MyInputProps extends InputHTMLAttributes<HTMLInputElement>, CommonFieldProps {
  onValueChange?: (value: string, form: UseFormReturn) => void;
}

export interface MySwitchProps
  extends Omit<SwitchProps, 'type' | 'ref' | 'onCheckedChange'>,
    CommonFieldProps {
  type: 'switch';
  onCheckedChange?(checked: boolean, form: UseFormReturn): void;
}

export interface MyDateTimeProps
  extends Omit<CommonFieldProps, 'label'>,
    Omit<DayPickerDefaultProps, 'disabled'> {
  type: 'datetime';
  disableRange: (date: Date) => boolean;
  label?: {
    date?: string;
    time?: string;
  };
}

export interface MyFileProps extends InputHTMLAttributes<HTMLInputElement>, CommonFieldProps {
  type: 'file';
  onValueChange?: (value: string, form: UseFormReturn) => void;
}

export interface CommonFieldProps {
  label?: string;
  helperText?: string;
  disabled?: boolean;
  hide?: boolean;
  /**
   * Compute this field's options from the form's current values, on every render.
   *
   * For options that depend on another field's live selection (Class Batch depends on
   * the chosen Quiz Batches). The field schema is memoised on type+label, so mutating
   * `.options` from an onValueChange handler never reaches the render — and doing the
   * write from an effect re-triggers that effect. Deriving here keeps it one-directional.
   */
  deriveOptions?: (values: Record<string, any>) => Option[];
}

export interface Option {
  label: string;
  value: string | number | boolean;
}
