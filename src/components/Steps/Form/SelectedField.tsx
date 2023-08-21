import styles from "@/styles/Home.module.css";
import { MyForm, MyFormKey } from "@/types/FormTypes";
import { OptionType } from "@/types/types";
import { Control, Controller } from "react-hook-form";
import Select from "react-select";
interface SelectFieldProps {
  control: Control<MyForm, any>;
  options: OptionType[];
  name_: MyFormKey;
  placeholder?: string;
}

const SelectField = ({
  control,
  options,
  name_,
  placeholder,
}: SelectFieldProps) => {
  return (
    <Controller
      name={name_}
      control={control}
      render={({ field: { onChange, value, ref } }) => (
        <Select
          required
          placeholder={
            placeholder ? placeholder : (name_ as string).toUpperCase()
          }
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
