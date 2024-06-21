'use client';

import { createSession, patchSession } from '@/services/services';
import { ApiFormOptions, Session, SessionParams, SessionType, Steps } from '@/types';
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
  updateFormData: (formData: Session, nextStep?: Steps) => void;
  submitForm: () => void;
}

interface IFormProviderProps {
  children: ReactNode;
  sessionData: Session;
  options?: ApiFormOptions;
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
 */
export const FormDataProvider = ({
  children,
  sessionData = {},
  options = {},
}: IFormProviderProps) => {
  const params = useParams<SessionParams>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [formData, setFormData] = useState<Session>(sessionData);
  const [isSubmiting, setIsSubmiting] = useState<boolean>(false);
  const apiOptions = useMemo<ApiFormOptions>(() => options, [options]);
  const id = useMemo(() => searchParams.get('id'), [searchParams]);
  const sessionKey = useMemo(() => `formData_${params.type}${id ? '_' + id : ''}`, [params, id]);

  useEffect(() => {
    const sessionFormData = sessionStorage.getItem(sessionKey);
    if (sessionFormData) {
      updateFormData(JSON.parse(sessionFormData));
    }
  }, []);

  useEffect(() => {
    if (isSubmiting) {
      (async () => {
        let toastId: string | number | null = null;
        let success: boolean | undefined = false;
        if (params.type === SessionType.EDIT) {
          toastId = toast.loading('Updating session...');
          const { isSuccess } = await patchSession(formData, Number(id));
          success = isSuccess;
        } else {
          toastId = toast.loading('Creating session...');
          const { isSuccess } = await createSession(formData);
          success = isSuccess;
        }
        setIsSubmiting(false);
        toast.dismiss(toastId);
        if (success) {
          sessionStorage.removeItem(sessionKey);
          toast.success('Session created successfully', {
            description:
              'The links will be available/updated shortly. Please refresh the page after a while.',
            duration: 5000,
          });
          router.push('/');
        } else {
          toast.error('Failed to create session', {
            description: 'Please try again later.',
            duration: 5000,
          });
        }
      })();
    }
  }, [isSubmiting]);

  const updateFormData = useCallback(
    (data: Session, nextStep?: Steps) => {
      setFormData((prevFormData) => {
        const updatedData = { ...prevFormData, ...data };
        sessionStorage.setItem(sessionKey, JSON.stringify(updatedData));
        return updatedData;
      });

      if (nextStep) {
        pushStep(nextStep);
      }
    },
    [params, searchParams]
  );

  const pushStep = useCallback(
    (step: Steps | string) => {
      const route = `/session/${params.type}?step=${step}${id ? `&id=${id}` : ''}`;
      router.push(route);
    },
    [router, params, searchParams]
  );

  const submitForm = useCallback(() => setIsSubmiting(true), []);

  console.info('Form Data : ', { isSubmiting, formData });

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
