import { AuthType, Group, Session } from '@/types';
import { clsx, type ClassValue } from 'clsx';
import { UseFormReturn } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function createQueryString(params: { [key: string]: string | number }) {
  return Object.keys(params)
    .map((key) => `${key}=${params[key]}`)
    .join('&');
}

export const deleteByPath = (object: object, path: string) => {
  let currentObject = object;
  const parts = path.split('.');
  const last = parts.pop();
  for (const part of parts) {
    currentObject = currentObject[part as keyof object];
    if (!currentObject) {
      return;
    }
  }
  delete currentObject[last as keyof object];
};

export const setGroupDefaults = (
  form: UseFormReturn,
  formData: Session,
  updateFormData: (data: Session) => void
) => {
  const { watch } = form;
  const groupValue = watch('group');

  if (groupValue) {
    let newDefaultData: Session = {};

    switch (groupValue) {
      case Group.Haryana:
        newDefaultData = {
          repeat_schedule: {
            type: 'weekly',
            params: [1, 2, 3, 4, 5, 6, 7],
          },
          type: 'sign-in',
          auth_type: AuthType.ID,
          id_generation: false,
          redirection: false,
          signup_form: true,
          popup_form: true,
          meta_data: {
            ...formData.meta_data,
            number_of_fields_in_popup_form: 3,
            group: Group.Haryana,
          },
        };
        break;

      case Group.Enable:
        newDefaultData = {
          repeat_schedule: {
            type: 'weekly',
            params: [1, 2, 3, 4, 5, 6, 7],
          },
          type: 'sign-in',
          auth_type: AuthType.IDDOB,
          signup_form: true,
          id_generation: true,
          redirection: true,
          popup_form: true,
          meta_data: {
            ...formData.meta_data,
            number_of_fields_in_popup_form: 3,
            group: Group.Enable,
          },
        };
        break;

      case Group.Delhi:
      case Group.Gujarat:
      case Group.Himachal:
      case Group.FeedingIndia:
        newDefaultData = {
          repeat_schedule: {
            type: 'weekly',
            params: [1, 2, 3, 4, 5, 6, 7],
          },
          type: 'sign-in',
          auth_type: AuthType.ID,
          signup_form: false,
          id_generation: false,
          redirection: true,
          popup_form: false,
          meta_data: {
            ...formData.meta_data,
            number_of_fields_in_popup_form: '',
            group: groupValue,
          },
        };
        break;

      case Group.Uttarakhand:
        newDefaultData = {
          repeat_schedule: {
            type: 'weekly',
            params: [1, 2, 3, 4, 5, 6, 7],
          },
          type: 'sign-in',
          auth_type: AuthType.IDDOB,
          signup_form: false,
          id_generation: false,
          redirection: true,
          popup_form: false,
          meta_data: {
            ...formData.meta_data,
            number_of_fields_in_popup_form: '',
            group: Group.Uttarakhand,
          },
        };
        break;

      default:
        break;
    }
    updateFormData(newDefaultData);
  }
};
