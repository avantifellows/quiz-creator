// import { Dispatch, SetStateAction } from 'react';

export interface Option {
  value: string;
  label: string;
}

// interface ActiveFormProps {
//   data: RowType;
//   setActiveStep: Dispatch<SetStateAction<string>>;
//   setData: Dispatch<SetStateAction<RowType>>;
//   OnSubmitSession?: () => void;
//   isSessionAdded: boolean;
//   type: string;
// }

// interface RowType {
//   dateCreated?: string;
//   student: {
//     [key: string]: string | number | boolean | null;
//   };
//   test: {
//     [key: string]: string | number | boolean | null;
//   };
//   timeline: {
//     [key: string]: string | number | boolean | null;
//   };
// }

// interface MessageObject {
//   action: string;
//   id: string;
//   patch_session: any;
// }
// export type { ActiveFormProps, Option, RowType, MessageObject };

export * from './api.types';
export * from './form.types';

export enum SessionType {
  CREATE = 'create',
  EDIT = 'edit',
  DUPPLICATE = 'duplicate',
}

export enum Steps {
  STUDENT = 'student',
  TEST = 'test',
  TIMELINE = 'timeline',
}

export type SessionParams = {
  type: string;
};

export type SessionSearchParams = {
  step: string;
  id?: string;
};
