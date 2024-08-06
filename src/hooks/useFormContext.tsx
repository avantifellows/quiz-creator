'use client';

import { createSession, patchSession } from '@/services/services';
import { ApiFormOptions, Platform, Session, SessionParams, SessionType, Steps } from '@/types';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { toast } from 'sonner';

interface IFormContext {
  formData: Session;
  isSubmiting: boolean;
  apiOptions?: ApiFormOptions;
  updateFormData: (
    formData: Session | ((prevSession: Session) => Session),
    nextStep?: Steps
  ) => void;
  submitForm: () => void;
}

interface IFormProviderProps {
  children: ReactNode;
  sessionData: Session;
  apiOptions?: ApiFormOptions;
}

/**
 * Form Context
 * - formData : The current form data
 * - updateFormData : Function to update the form data and push a new step
 * - isSubmiting : Boolean indicating if the form is submitting
 * - submitForm : Function to submit the form
 */
const FormContext = createContext<IFormContext>({
  formData: {},
  isSubmiting: false,
  apiOptions: {},
  updateFormData: () => {},
  submitForm: () => {},
});

/**
 * Form Context Provider
 * @param children - The children components
 * @param sessionData - The initial session data
 * @param apiOptions - The dropdown options fetched from the API
 */
export const FormDataProvider = ({
  children,
  sessionData = {},
  apiOptions = {},
}: IFormProviderProps) => {
  const params = useParams<SessionParams>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = useMemo(() => searchParams.get('id'), [searchParams]);
  const sessionKey = useMemo(() => `formData_${params.type}${id ? '_' + id : ''}`, [params, id]);
  const [isSubmiting, setIsSubmiting] = useState<boolean>(false);
  const getSessionData = useCallback(() => {
    if (typeof window !== 'undefined') {
      const sessionStorageData = sessionStorage.getItem(sessionKey);
      if (sessionStorageData) {
        return JSON.parse(sessionStorageData);
      }
      return sessionData;
    }
    return {};
  }, []);
  const [formData, setFormData] = useState<Session>(getSessionData);

  useEffect(() => {
    if (isSubmiting) {
      (async () => {
        let toastId: string | number | null = null;
        let success: boolean | undefined = false;
        let message = '';
        if (params.type === SessionType.EDIT) {
          toastId = toast.loading('Updating session...');
          const { isSuccess } = await patchSession(formData, Number(id), sessionData);
          success = isSuccess;
          message = 'Session updated successfully';
        } else {
          toastId = toast.loading('Creating session...');
          const { isSuccess } = await createSession(formData);
          success = isSuccess;
          message = 'Session created successfully';
        }
        setIsSubmiting(false);
        toast.dismiss(toastId);
        if (success) {
          sessionStorage.removeItem(sessionKey);
          toast.success(message, {
            description:
              'The links will be available/updated shortly. Please refresh the page after a while.',
            duration: 5000,
          });
          router.push(formData.platform === Platform.Quiz ? '/' : '/live');
        } else {
          toast.error('Something went wrong', {
            description: 'Please try again later.',
            duration: 5000,
          });
        }
      })();
    }
  }, [isSubmiting]);

  const updateFormData = useCallback(
    (data: Session | ((prevState: Session) => Session), nextStep?: Steps) => {
      setFormData((prevFormData) => {
        const newData = typeof data === 'function' ? data(prevFormData) : data;
        const updatedData: Session = {
          ...prevFormData,
          ...newData,
          meta_data: { ...(prevFormData.meta_data ?? {}), ...(newData.meta_data ?? {}) },
        };
        sessionStorage.setItem(sessionKey, JSON.stringify(updatedData));
        return updatedData;
      });

      if (nextStep) {
        pushStep(nextStep);
      }
    },
    [params, searchParams, formData]
  );

  const pushStep = useCallback(
    (step: Steps | string) => {
      window.history.pushState(null, '', `?step=${step}${id ? `&id=${id}` : ''}`);
    },
    [id]
  );

  const submitForm = useCallback(() => setIsSubmiting(true), []);

  return (
    <FormContext.Provider value={{ formData, isSubmiting, apiOptions, updateFormData, submitForm }}>
      {children}
    </FormContext.Provider>
  );
};

/**
 * Custom hook to access the form data
 *
 * @returns {IFormContext}
 * - formData : The current form data
 * - updateFormData : Function to update the form data and push a new step
 * - isSubmiting : Boolean indicating if the form is submitting
 * - submitForm : Function to submit the form
 */
export const useFormContext = () => {
  if (!FormContext) {
    throw new Error('useFormData must be used within a FormDataProvider');
  }
  return useContext(FormContext);
};
