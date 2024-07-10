import { ComponentType } from 'react';
import { Option } from './formbuilder.types';

export * from './api.types';
export * from './enums';
export * from './form.types';
export * from './formbuilder.types';

export type TableParams = {
  page?: string;
  per_page?: string;
  group?: string;
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
    component: ComponentType<any>;
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

export interface ExtendedOptions extends Option {
  [key: string]: any;
}

export interface ApiFormOptions {
  group?: ExtendedOptions[];
  batch?: ExtendedOptions[];
  popupForm?: ExtendedOptions[];
  signupForm?: ExtendedOptions[];
  formSchemas?: Option[];
}
