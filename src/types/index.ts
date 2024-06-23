import { type FC } from 'react';
import { Option } from './formbuilder.types';

export * from './api.types';
export * from './enums';
export * from './form.types';
export * from './formbuilder.types';

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
    component: FC<any>;
    hide?: boolean;
  };
}

interface DataItem {
  label: string;
  value: any;
  isLink?: boolean;
}

export interface DataSection {
  title: string;
  data: DataItem[];
}

interface ExtenedOptions extends Option {
  [key: string]: any;
}

export interface ApiFormOptions {
  group?: ExtenedOptions[];
  batch?: ExtenedOptions[];
  popupForm?: ExtenedOptions[];
  signupForm?: ExtenedOptions[];
}
