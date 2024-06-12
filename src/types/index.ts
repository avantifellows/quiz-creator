export * from './api.types';
export * from './form.types';

export interface Option {
  value: string;
  label: string;
}

export enum SessionType {
  CREATE = 'create',
  EDIT = 'edit',
  DUPPLICATE = 'duplicate',
}

export enum Steps {
  BASIC = 'basic',
  PLATFORM = 'platform',
  TIMELINE = 'timeline',
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

export enum Status {
  Processing = 'processing',
  Success = 'success',
  Failed = 'failed',
}

export enum Platform {
  Quiz = 'quiz',
  Live = 'live',
}
