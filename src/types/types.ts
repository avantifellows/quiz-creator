import { Dispatch, SetStateAction } from "react";

interface OptionType {
  value: string | boolean;
  label: string;
}

interface ActiveFormProps {
  setActiveStep: Dispatch<SetStateAction<string>>;
  setData: Dispatch<SetStateAction<Object>>;
  createSession?: () => void;
}

interface RowType {
  studentData: {
    [key: string]: OptionType | string | number | boolean | null;
  };
  testData: {
    [key: string]: OptionType | string | number | boolean | null;
  };
  timelineData: {
    [key: string]: OptionType | string | number | boolean | null;
  };
}

export type { ActiveFormProps, OptionType, RowType };
