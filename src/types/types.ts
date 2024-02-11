import { Dispatch, SetStateAction } from "react";

interface OptionType {
  value: string | boolean;
  label: string;
}

interface ActiveFormProps {
  data: RowType;
  setActiveStep: Dispatch<SetStateAction<string>>;
  setData: Dispatch<SetStateAction<RowType>>;
  OnSubmitSession?: () => void;
  isSessionAdded: boolean;
}

interface RowType {
  dateCreated?: string;
  student: {
    [key: string]: string | number | boolean | null;
  };
  test: {
    [key: string]: string | number | boolean | null;
  };
  timeline: {
    [key: string]: string | number | boolean | null;
  };
  session: {
    [key: string]: string | number | boolean | null;
  };
}

export type { ActiveFormProps, OptionType, RowType };
