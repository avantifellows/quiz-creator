import { Dispatch, SetStateAction } from "react";

interface ActiveFormProps {
  setActiveStep: Dispatch<SetStateAction<string>>;
  setData: Dispatch<SetStateAction<Object>>;
  createSession?: () => void;
}

export type { ActiveFormProps };
