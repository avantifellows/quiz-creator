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

export const setGroupPreset = (
  value: string,
  apiOptions: ApiFormOptions,
  updateFormData: (data: Session | ((prevState: Session) => Session)) => void
) => {
  if (!value) return;

  let newDefaultData: Session = {};
  switch (value) {
    case Group.Haryana:
      newDefaultData = {
        repeat_schedule: {
          type: 'weekly',
          params: [1, 2, 3, 4, 5, 6, 7],
        },
        // type: 'sign-in',
        // auth_type: AuthType.ID,
        // signup_form: true,
        // signup_form_id:
        //   Number(apiOptions.signupForm?.find((item) => item.label.includes('Haryana'))?.value) ??
        //   null,
        id_generation: false,
        redirection: false,
        popup_form: true,
        popup_form_id:
          Number(apiOptions.popupForm?.find((item) => item.label.includes('Haryana'))?.value) ??
          null,
        meta_data: {
          number_of_fields_in_popup_form: 3,
          parent_id: '',
          batch_id: '',
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
        signup_form_id:
          Number(apiOptions.signupForm?.find((item) => item.label.includes('Enable'))?.value) ??
          null,
        id_generation: true,
        redirection: true,
        popup_form: true,
        popup_form_id:
          Number(apiOptions.popupForm?.find((item) => item.label.includes('Enable'))?.value) ??
          null,
        meta_data: {
          number_of_fields_in_popup_form: 3,
          parent_id: '',
          batch_id: '',
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
        signup_form_id: null,
        id_generation: false,
        redirection: true,
        popup_form_id: null,
        popup_form: false,
        meta_data: {
          number_of_fields_in_popup_form: '',
          parent_id: '',
          batch_id: '',
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
        signup_form_id: null,
        id_generation: false,
        redirection: true,
        popup_form_id: null,
        popup_form: false,
        meta_data: {
          number_of_fields_in_popup_form: '',
          parent_id: '',
          batch_id: '',
        },
      };
      break;

    default:
      break;
  }

  if (Object.keys(newDefaultData).length === 0) return;

  updateFormData({
    ...newDefaultData,
    meta_data: { ...newDefaultData.meta_data, group: value },
  });
  console.log('[PRESET] Applying GROUP : ', value);
};

export const setParentBatchOptions = (
  value: string,
  apiOptions: ApiFormOptions,
  fieldsSchema: FieldSchema<basicFields>
) => {
  if (!value) return;

  const authGroupId = apiOptions.group?.find((item) => item.value === value)?.id;
  const filteredQuizBatchOptions = apiOptions?.batch?.filter(
    (item) => item.groupId === authGroupId && !item.parentId
  );

  (fieldsSchema.parentBatch as MySelectProps).options = filteredQuizBatchOptions ?? [];
  (fieldsSchema.subBatch as MySelectProps).options = [];
  console.log('[OPTIONS] PARENT BATCH APPLIED : ', value);
};

export const setBatchOptions = (
  value: string,
  form: UseFormReturn,
  apiOptions: ApiFormOptions,
  fieldsSchema: FieldSchema<basicFields>
) => {
  if (!value) return;

  const quizBatchId = apiOptions.batch?.find((item) => item.value === value)?.id;
  const filteredClassBatchOptions = apiOptions?.batch?.filter(
    (item) => item.parentId === quizBatchId
  );
  form.setValue('subBatch', '');
  (fieldsSchema.subBatch as MySelectProps).options = filteredClassBatchOptions ?? [];
  console.log('[OPTIONS] SUB BATCH APPLIED : ', value);
};

export const setPlatformId = (value: string, form: UseFormReturn) => {
  if (!value) return;

  let seperator = null;
  if (value?.includes('meet.google.com')) {
    seperator = 'meet.google.com/';
  } else if (value?.includes('youtube.com')) {
    seperator = 'youtube.com/watch?v=';
  } else if (value?.includes('plio.in')) {
    seperator = 'play/';
  } else if (value?.includes('zoom')) {
    seperator = 'zoom.us/j/';
  } else {
    seperator = null;
  }

  if (seperator) {
    const urlArr = value.split(seperator);
    if (urlArr.length > 1) {
      const platformId = urlArr[urlArr.length - 1];
      form.setValue('platformId', platformId, { shouldDirty: true });
      console.log('[PLATFORM ID] Applied : ', value);
    }
  }
};

export const handleSignUpFields = (
  checked: boolean,
  formSchema: FieldSchema<basicFields>,
  form: UseFormReturn
) => {
  console.log('[SIGNUP] Applied : ', checked);
  if (checked) {
    formSchema.signupFormId.hide = false;
    form.setValue('activateSignUp', true, { shouldDirty: true });
  } else {
    formSchema.signupFormId.hide = true;
    form.setValue('signupFormId', null, { shouldDirty: true });
  }
};

export const handlePopupFields = (
  checked: boolean,
  formSchema: FieldSchema<basicFields>,
  form: UseFormReturn
) => {
  console.log('[POPUP] Applied : ', checked);
  if (checked) {
    formSchema.popupFormId.hide = false;
    formSchema.noOfFieldsInPopup.hide = false;
    form.setValue('isPopupForm', true, { shouldDirty: true });
  } else {
    formSchema.popupFormId.hide = true;
    formSchema.noOfFieldsInPopup.hide = true;
    form.setValue('popupFormId', null);
    form.setValue('noOfFieldsInPopup', '', { shouldDirty: true });
  }
};
