'use client';

import { PartialSession, SessionParams, Steps } from '@/types';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { ReactNode, createContext, useCallback, useContext, useEffect, useState } from 'react';

interface FormContextValue {
  formData: PartialSession;
  updateFormData: (formData: PartialSession, nextStep?: Steps) => void;
  pushStep: (step: Steps | string) => void;
}

const FormContext = createContext<FormContextValue>({
  formData: {},
  updateFormData: () => {},
  pushStep: () => {},
});

export const FormDataProvider = ({
  children,
  sessionData = {},
}: {
  children: ReactNode;
  sessionData: PartialSession;
}) => {
  const params = useParams<SessionParams>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [formData, setFormData] = useState<PartialSession>(sessionData);

  const updateFormData = useCallback(
    (data: PartialSession, nextStep?: Steps) => {
      console.info('[Form Context] Data : ', data);
      setFormData((prevFormData) => {
        const updatedData = { ...prevFormData, ...data };
        sessionStorage.setItem(`formData_${params.type}`, JSON.stringify(updatedData));
        return updatedData;
      });

      if (nextStep) {
        pushStep(nextStep);
      }
    },
    [params, searchParams]
  );

  useEffect(() => {
    const sessionFormData = sessionStorage.getItem(`formData_${params.type}`);
    if (sessionFormData) {
      updateFormData(JSON.parse(sessionFormData));
    }
  }, []);

  const pushStep = useCallback(
    (step: Steps | string) => {
      const id = searchParams.get('id');
      const route = `/session/${params.type}?step=${step}${id ? `&id=${id}` : ''}`;
      router.push(route);
    },
    [router, params, searchParams]
  );

  return (
    <FormContext.Provider value={{ formData, updateFormData, pushStep }}>
      {children}
    </FormContext.Provider>
  );
};

export const useFormContext = () => {
  if (!FormContext) {
    throw new Error('useFormData must be used within a FormDataProvider');
  }
  return useContext(FormContext);
};
