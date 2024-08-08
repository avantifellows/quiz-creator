import { PlatformPatterns } from '@/Constants';
import {
  ApiFormOptions,
  AuthType,
  ExtendedOptions,
  FieldSchema,
  Group,
  GroupShortName,
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
        activateSignUp: false,
        signupFormId: null,
        isPopupForm: false,
        popupFormId: null,
        noOfFieldsInPopup: '',
        isRedirection: true,
        isIdGeneration: false,
        parentBatch: '',
        subBatch: [],
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
        isPopupForm: false,
        popupFormId: null,
        noOfFieldsInPopup: '',
        isRedirection: true,
        isIdGeneration: true,
        parentBatch: '',
        subBatch: [],
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
        isPopupForm: false,
        popupFormId: null,
        noOfFieldsInPopup: '',
        isRedirection: true,
        isIdGeneration: false,
        parentBatch: '',
        subBatch: [],
      };
      break;

    case Group.Uttarakhand:
      newDefaultData = {
        sessionType: 'sign-in',
        authType: AuthType.IDDOB,
        activateSignUp: false,
        signupFormId: null,
        isPopupForm: false,
        popupFormId: null,
        noOfFieldsInPopup: '',
        isRedirection: true,
        isIdGeneration: false,
        parentBatch: '',
        subBatch: [],
      };
      break;

    default:
      newDefaultData = {
        activateSignUp: false,
        signupFormId: null,
        isPopupForm: false,
        popupFormId: null,
        noOfFieldsInPopup: '',
        isRedirection: true,
        isIdGeneration: false,
        parentBatch: '',
        subBatch: [],
      };
      break;
  }

  if (Object.keys(newDefaultData).length === 0) return;

  form.reset({ ...form.getValues(), ...newDefaultData });
};

export const setParentBatchOptions = (
  value: string,
  form: UseFormReturn,
  apiOptions: ApiFormOptions,
  fieldsSchema: FieldSchema<basicFields>
) => {
  if (!value) return;
  const selectedPlatform = form.getValues('platform');
  form.trigger('platform');
  const isQuizSession = selectedPlatform === Platform.Quiz;
  const authGroupSelected = apiOptions.group?.find((item) => item.value === value);
  let filteredQuizBatchOptions: ExtendedOptions[] = [];

  if (authGroupSelected?.value === Group.TNSchools) {
    const TNStudentsId = apiOptions.group?.find((item) => item.value === Group.TNStudents)?.id;

    filteredQuizBatchOptions =
      apiOptions?.batch?.filter(
        (item) => item.groupId === TNStudentsId && !item.parentId === isQuizSession
      ) ?? [];
  } else {
    filteredQuizBatchOptions =
      apiOptions?.batch?.filter(
        (item) => item.groupId === authGroupSelected?.id && !item.parentId === isQuizSession
      ) ?? [];
  }

  if (isQuizSession) {
    (fieldsSchema.parentBatch as MySelectProps).options = filteredQuizBatchOptions ?? [];
    (fieldsSchema.subBatch as MySelectProps).options = [];
  } else {
    (fieldsSchema.subBatch as MySelectProps).options = filteredQuizBatchOptions ?? [];
  }
  setPopupSignUpOptions(apiOptions, fieldsSchema, authGroupSelected);
};

export const setPopupSignUpOptions = (
  apiOptions: ApiFormOptions,
  fieldsSchema: FieldSchema<basicFields>,
  authGroupSelected?: ExtendedOptions
) => {
  let options: Record<'popup' | 'signUp', ExtendedOptions[]> = {
    popup: [],
    signUp: [],
  };

  options.popup =
    apiOptions.popupForm?.filter((item) =>
      item.label.includes(GroupShortName[authGroupSelected?.value as Group])
    ) ?? [];

  options.signUp =
    apiOptions.signupForm?.filter((item) =>
      item.label.includes(GroupShortName[authGroupSelected?.value as Group])
    ) ?? [];

  (fieldsSchema.signupFormId as MySelectProps).options = options.signUp ?? [];
  (fieldsSchema.popupFormId as MySelectProps).options = options.popup ?? [];
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
  form.setValue('subBatch', []);
  (fieldsSchema.subBatch as MySelectProps).options = filteredClassBatchOptions ?? [];
};

export const setPlatformId = (value: string, form: UseFormReturn) => {
  if (!value) return;

  let platformId = null;
  for (const pattern of PlatformPatterns) {
    const match = value.match(pattern);
    if (match?.[1]) {
      platformId = match[1];
      break;
    }
  }

  if (platformId) {
    form.setValue('platformId', platformId, { shouldDirty: true });
  } else {
    const platform = form.watch('platform');
    if (platform === Platform.Others) {
      const platformId = new Date().getTime().toString();
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

export const handleBatchFields = (
  value: string,
  form: UseFormReturn,
  apiOptions: ApiFormOptions,
  fieldsSchema: FieldSchema<basicFields>
) => {
  if (value !== Platform.Quiz) {
    fieldsSchema.parentBatch.hide = true;
    form.setValue('parentBatch', '');
  } else {
    fieldsSchema.parentBatch.hide = false;
  }

  const selectedGroup = form.watch('group');
  if (selectedGroup) {
    setParentBatchOptions(selectedGroup, form, apiOptions, fieldsSchema);
  }
};
