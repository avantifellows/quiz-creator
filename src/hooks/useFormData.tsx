'use client';

import { Session, SessionParams, Steps } from '@/types';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { ReactNode, createContext, useCallback, useContext, useEffect, useState } from 'react';

interface FormContextValue {
  formData: {};
  addFormData: (formData: object, step?: Steps) => void;
  submitForm: () => void;
  pushStep: (step: Steps) => void;
}

const FormContext = createContext<FormContextValue>({
  formData: {},
  addFormData: () => {},
  submitForm: () => {},
  pushStep: () => {},
});

const FormDataProvider = ({
  children,
  sessionData = {},
}: {
  children: ReactNode;
  sessionData: Session | {};
}) => {
  const params = useParams<SessionParams>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [formData, setFormData] = useState(sessionData);
  const [submit, setSubmit] = useState(false);

  const addFormData = useCallback(
    (data: object, step?: Steps) => {
      console.info('[Form Context] Data : ', data);
      setFormData((prevFormData) => {
        const updatedData = { ...prevFormData, ...data };
        sessionStorage.setItem(`formData_${params.type}`, JSON.stringify(updatedData));
        return updatedData;
      });

      if (step) {
        pushStep(step);
      }
    },
    [params, searchParams]
  );

  useEffect(() => {
    const sessionFormData = sessionStorage.getItem(`formData_${params.type}`);
    if (sessionFormData) {
      setFormData(JSON.parse(sessionFormData));
    }
  }, []);

  const pushStep = useCallback(
    (step: Steps) => {
      const id = searchParams.get('id');
      const route = `/session/${params.type}?step=${step}${id ? `&id=${id}` : ''}`;
      router.push(route);
    },
    [router, params, searchParams]
  );

  const submitForm = useCallback(() => setSubmit(true), []);

  return (
    <FormContext.Provider
      value={{
        formData,
        addFormData,
        submitForm,
        pushStep,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};

const useFormData = () => {
  if (!FormContext) {
    throw new Error('useFormData must be used within a FormDataProvider');
  }
  return useContext(FormContext);
};

export { FormDataProvider, useFormData };
