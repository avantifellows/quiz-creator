import {
  ApiFormOptions,
  AuthType,
  FieldSchema,
  Group,
  MySelectProps,
  Session,
  basicFields,
} from '@/types';
import { UseFormReturn } from 'react-hook-form';

export const setGroupDefaults = (
  value: string,
  apiOptions: ApiFormOptions,
  fieldsSchema: FieldSchema<basicFields>,
  updateFormData: (data: Session | ((prevState: Session) => Session)) => void,
  form?: UseFormReturn
) => {
  if (value) {
    let newDefaultData: Session = {};

    switch (value) {
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
            number_of_fields_in_popup_form: 3,
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
            number_of_fields_in_popup_form: 3,
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
            number_of_fields_in_popup_form: '',
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
            number_of_fields_in_popup_form: '',
          },
        };
        break;

      default:
        break;
    }

    const authGroupId = apiOptions.group?.find((item) => item.value === value)?.id;

    const filteredQuizBatchOptions = apiOptions?.batch?.filter(
      (item) => item.groupId === authGroupId && !item.parentId
    );

    (fieldsSchema.quizBatch as MySelectProps).options = filteredQuizBatchOptions ?? [];
    (fieldsSchema.classBatch as MySelectProps).options = [];

    updateFormData((prev) => {
      return {
        ...prev,
        ...newDefaultData,
        meta_data: {
          ...prev.meta_data,
          ...newDefaultData.meta_data,
          group: value,
        },
      };
    });
  }
};

export const setBatchOptions = (
  value: string,
  apiOptions: ApiFormOptions,
  fieldsSchema: FieldSchema<basicFields>,
  updateFormData: (data: Session | ((prevState: Session) => Session)) => void,
  form?: UseFormReturn
) => {
  const quizBatchId = apiOptions.batch?.find((item) => item.value === value)?.id;

  const filteredClassBatchOptions = apiOptions?.batch?.filter(
    (item) => item.parentId === quizBatchId
  );
  form?.setValue('classBatch', '');
  (fieldsSchema.classBatch as MySelectProps).options = filteredClassBatchOptions ?? [];
};
