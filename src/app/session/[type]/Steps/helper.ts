import {
  ApiFormOptions,
  AuthType,
  ExtendedOptions,
  FieldSchema,
  Group,
  MySelectProps,
  Platform,
  Session,
  basicFields,
} from '@/types';
import { UseFormReturn } from 'react-hook-form';

export const setGroupPreset = (value: string, form: UseFormReturn, apiOptions: ApiFormOptions) => {
  if (!value) return;

  let newDefaultData: Partial<basicFields> = {};
  switch (value) {
    case Group.Haryana:
      newDefaultData = {
        isIdGeneration: false,
        isRedirection: false,
        isPopupForm: true,
        popupFormId:
          Number(apiOptions.popupForm?.find((item) => item.label.includes('Haryana'))?.value) ??
          null,
        noOfFieldsInPopup: 3,
        parentBatch: '',
        subBatch: '',
      };
      break;

    case Group.Enable:
      newDefaultData = {
        sessionType: 'sign-in',
        authType: AuthType.IDDOB,
        activateSignUp: true,
        signupFormId:
          Number(apiOptions.signupForm?.find((item) => item.label.includes('Enable'))?.value) ??
          null,
        isIdGeneration: true,
        isRedirection: true,
        isPopupForm: true,
        popupFormId:
          Number(apiOptions.popupForm?.find((item) => item.label.includes('Enable'))?.value) ??
          null,
        noOfFieldsInPopup: 3,
        parentBatch: '',
        subBatch: '',
      };
      break;

    case Group.Delhi:
    case Group.Gujarat:
    case Group.Himachal:
    case Group.FeedingIndia:
      newDefaultData = {
        sessionType: 'sign-in',
        authType: AuthType.ID,
        activateSignUp: false,
        signupFormId: null,
        isIdGeneration: false,
        isRedirection: true,
        popupFormId: null,
        isPopupForm: false,
        noOfFieldsInPopup: '',
        parentBatch: '',
        subBatch: '',
      };
      break;

    case Group.Uttarakhand:
      newDefaultData = {
        sessionType: 'sign-in',
        authType: AuthType.IDDOB,
        activateSignUp: false,
        signupFormId: null,
        isIdGeneration: false,
        isRedirection: true,
        popupFormId: null,
        isPopupForm: false,
        noOfFieldsInPopup: '',
        parentBatch: '',
        subBatch: '',
      };
      break;

    default:
      break;
  }

  if (Object.keys(newDefaultData).length === 0) return;

  form.reset({ ...form.getValues(), ...newDefaultData });
};

export const setParentBatchOptions = (
  value: string,
  apiOptions: ApiFormOptions,
  fieldsSchema: FieldSchema<basicFields>
) => {
  if (!value) return;
  const authGroupSelected = apiOptions.group?.find((item) => item.value === value);
  let filteredQuizBatchOptions: ExtendedOptions[] = [];

  if (authGroupSelected?.value === Group.TNSchools) {
    const TNStudentsId = apiOptions.group?.find((item) => item.value === Group.TNStudents)?.id;

    filteredQuizBatchOptions =
      apiOptions?.batch?.filter((item) => item.groupId === TNStudentsId && !item.parentId) ?? [];
  } else {
    filteredQuizBatchOptions =
      apiOptions?.batch?.filter(
        (item) => item.groupId === authGroupSelected?.id && !item.parentId
      ) ?? [];
  }

  (fieldsSchema.parentBatch as MySelectProps).options = filteredQuizBatchOptions ?? [];
  (fieldsSchema.subBatch as MySelectProps).options = [];
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
    }
  }
};

export const handleSignUpFields = (
  checked: boolean,
  formSchema: FieldSchema<basicFields>,
  form: UseFormReturn
) => {
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

export const handleRedirectionData = (formData: Session) => {
  const { platform, meta_data } = formData;
  let newFormData: Session = {};

  if (platform === Platform.Quiz) {
    newFormData = {
      ...formData,
      meta_data: {
        ...meta_data,
        course: '',
        stream: '',
        test_format: '',
        test_purpose: '',
        test_type: '',
        marking_scheme: '',
        optional_limits: '',
        cms_test_id: '',
        show_answers: false,
      },
    };
  } else {
    newFormData = {
      ...formData,
      platform_link: '',
      platform_id: '',
      meta_data: {
        ...meta_data,
        subject: '',
      },
    };
  }

  return newFormData;
};
