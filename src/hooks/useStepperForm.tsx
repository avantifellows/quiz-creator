'use client';

import { Session } from '@/types';
import { useRouter } from 'next/navigation';
import { ReactNode, createContext, useCallback, useContext, useEffect, useState } from 'react';

const FormContext = createContext({
  formData: {},
  addFormData: (formData: any) => {},
  submitForm: () => {},
});

const StepperFormProvider = ({
  children,
  sessionData = {},
}: {
  children: ReactNode;
  sessionData: Session | {};
}) => {
  const router = useRouter();
  const [formData, setFormData] = useState(sessionData);
  const [submit, setSubmit] = useState(false);
  const addFormData = useCallback((data: object) => {
    console.log('Added data : ', data);
    setFormData((prevFormData) => ({ ...prevFormData, ...data }));
  }, []);

  const submitForm = useCallback(() => setSubmit(true), []);

  useEffect(() => {
    if (submit) {
      // TODO: ADD API CALL
      console.info('[Stepper Context] Final Form Data : ', formData);

      router.push('/');
    }
  }, [formData, submit]);

  return (
    <FormContext.Provider
      value={{
        formData,
        addFormData,
        submitForm,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};

const useStepperForm = () => {
  if (!FormContext) {
    throw new Error('useStepperForm must be used within a StepperFormProvider');
  }
  return useContext(FormContext);
};

export { StepperFormProvider, useStepperForm };
