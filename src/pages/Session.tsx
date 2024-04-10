import Stepper from '@/components/Stepper';
import StudentDetails from '@/components/Steps/StudentDetails';
import { TestDetails } from '@/components/Steps/TestDetails';
import Timeline from '@/components/Steps/Timeline';
import { getASession } from '@/services/services';
import { RowType } from '@/types/types';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export enum Step {
  STUDENT_DETAILS = 'StudentDetails',
  TEST_DETAILS = 'TestDetails',
  TIMELINE = 'Timeline',
}

const stepArr: string[] = [
  Step.STUDENT_DETAILS,
  Step.TEST_DETAILS,
  Step.TIMELINE,
];

export default function SessionCreator(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const router = useRouter();
  const [isSessionAdded, setIsSessionAdded] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [activeStep, setActiveStep] = useState<string>(Step.STUDENT_DETAILS);
  const [data, setData] = useState<RowType>({
    ...props.FormData,
  });

  useEffect(() => {
    if (isSessionAdded) {
      setShowMessage(true);

      const timeout = setTimeout(() => {
        setShowMessage(false);
        setIsSessionAdded(false);
      }, 10000);

      return () => clearTimeout(timeout);
    }
  }, [isSessionAdded]);

  const OnSubmitSession = async () => {
    let response;
    if (props.FormType == 'create') {
      response = await fetch('/api/PostFormData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
    } else if (props.FormType === 'edit') {
      response = await fetch(`/api/PostFormData?id=${props.FormData.test.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
    }

    setIsSessionAdded(true);

    setTimeout(() => {
      sessionStorage.setItem('refresh', 'true');
      router.push('/');

      setIsSessionAdded(false);
    }, 2000);
  };

  const activeForm = () => {
    if (activeStep === Step.STUDENT_DETAILS) {
      return (
        <StudentDetails
          data={data}
          setActiveStep={setActiveStep}
          setData={setData}
          isSessionAdded={isSessionAdded}
          type={props.FormType}
        />
      );
    } else if (activeStep === Step.TEST_DETAILS) {
      return (
        <TestDetails
          data={data}
          setActiveStep={setActiveStep}
          setData={setData}
          isSessionAdded={isSessionAdded}
          type={props.FormType}
        />
      );
    } else {
      return (
        <Timeline
          data={data}
          setActiveStep={setActiveStep}
          setData={setData}
          OnSubmitSession={OnSubmitSession}
          isSessionAdded={isSessionAdded}
          type={props.FormType}
        />
      );
    }
  };
  return (
    <>
      <Stepper steps={stepArr} activeStep={activeStep} />
      {activeForm()}
    </>
  );
}
export const getServerSideProps = (async ({ query: { type, sessionId } }) => {
  if (type === 'create') {
    return {
      props: {
        FormData: {
          student: {},
          test: {},
          timeline: {},
        },
        FormType: type,
      },
    };
  } else if (type === 'edit' && sessionId) {
    const FormData = await getASession(Number(sessionId));

    return {
      props: { FormData: FormData as RowType, FormType: type },
    };
  } else if (type === 'duplicate' && sessionId) {
    let FormData = await getASession(Number(sessionId));
    FormData.test.name = '';
    FormData.test.cmsId = '';
    FormData.test.id = null;

    return {
      props: { FormData: FormData as RowType, FormType: 'create' },
    };
  } else {
    return {
      //Todo:Redirect to the error page
      props: {
        FormData: {
          student: {},
          test: {},
          timeline: {},
        },
        FormType: type as string,
      },
    };
  }
}) satisfies GetServerSideProps<{ FormData: RowType; FormType: string }>;
