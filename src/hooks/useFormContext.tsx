'use client';

import { createSession, patchSession } from '@/services/services';
import { Session, SessionParams, SessionType, Steps } from '@/types';
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

interface IFormContext {
  formData: Session;
  isSubmiting: boolean;
  updateFormData: (formData: Session, nextStep?: Steps) => void;
  submitForm: () => void;
}

interface IFormProviderProps {
  children: ReactNode;
  sessionData: Session;
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
  updateFormData: () => {},
  submitForm: () => {},
});

/**
 * Form Context Provider
 * @param children - The children components
 * @param sessionData - The initial session data
 */
export const FormDataProvider = ({ children, sessionData = {} }: IFormProviderProps) => {
  const params = useParams<SessionParams>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [formData, setFormData] = useState<Session>(sessionData);
  const [isSubmiting, setIsSubmiting] = useState<boolean>(false);
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
        if (params.type === SessionType.EDIT) {
          await patchSession(formData, Number(id));
        } else {
          await createSession(formData);
        }

        sessionStorage.removeItem(sessionKey);
        setIsSubmiting(false);
        router.push('/');
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

  console.info('formData', { isSubmiting }, formData);

  return (
    <FormContext.Provider value={{ formData, isSubmiting, updateFormData, submitForm }}>
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
