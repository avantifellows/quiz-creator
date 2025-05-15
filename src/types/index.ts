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
  parentId?: string;
  batchId?: string;
};

export type SessionParams = {
  type: string;
};

export type SessionSearchParams = {
  step: string;
  id?: string;
};

export type FilterParams = {
  sort_order: string;
  limit: number;
  offset: number;
  is_quiz: boolean;
  group?: string;
  parent_id?: string;
  batch_id?: string;
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

export interface FilterColumnSchema {
  name: string;
  label: string;
  options: ExtendedOptions[];
  show: boolean;
  onChange: (value: string) => void;
}

export interface FilterSchema {
  [key: string]: FilterColumnSchema;
}

export type TrackerTableParams = {
  page?: string;
  per_page?: string;
  teacher_id?: string;
  school_name?: string;
  program_type?: string;
  tracker_session_type?: string;
};

export type TrackerFilterParams = {
  sort_order: string;
  limit: number;
  offset: number;
  teacher_id?: string;
  school_name?: string;
  program_type?: string;
  tracker_session_type?: string;
};

export interface TrackerFilterSchema {
  [key: string]: FilterColumnSchema;
}
