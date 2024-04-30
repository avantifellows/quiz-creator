import styles from '@/styles/Home.module.css';
import { OptionType } from '@/types';
import { QuizCreatorForm, QuizCreatorFormKey } from '@/types/form.types';
import { Control, Controller } from 'react-hook-form';
import Select from 'react-select';
interface SelectFieldProps {
  control: Control<QuizCreatorForm, any>;
  options: OptionType[];
  name_: QuizCreatorFormKey;
  placeholder?: string;
  isDisabled?: boolean;
}

const SelectField = ({ control, options, name_, placeholder, isDisabled }: SelectFieldProps) => {
  return (
    <Controller
      name={name_}
      control={control}
      render={({ field: { onChange, value, ref } }) => (
        <Select
          isDisabled={isDisabled}
          required
          isSearchable={false}
          placeholder={placeholder ? placeholder : (name_ as string).toUpperCase()}
          className={styles.custom_input}
          options={options}
          value={options.find((c) => c.value === value)}
          onChange={(val) => onChange(val!.value)}
        />
      )}
    />
  );
};

export default SelectField;
