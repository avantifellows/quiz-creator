import { type FC } from 'react';

export * from './api.types';
export * from './enums';
export * from './form.types';

export interface Option {
  value: string;
  label: string;
}

export type TablePrams = {
  page?: string;
  per_page?: string;
};

export type SessionParams = {
  type: string;
};

export type SessionSearchParams = {
  step: string;
  id?: string;
};

export interface StepperSteps {
  [key: string]: {
    label: string;
    component: FC;
    hide?: boolean;
  };
}
