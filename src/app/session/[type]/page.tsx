import StepsController from '@/app/session/[type]/Steps';
import { getASession } from '@/services/services';
import { SessionParams, SessionSearchParams, SessionType, Steps } from '@/types';
import { notFound } from 'next/navigation';

interface Props {
  params: SessionParams;
  searchParams: SessionSearchParams;
}

export function generateStaticParams() {
  return Object.values(SessionType).map((item) => ({ type: item }));
}

export default async function SessionCreator({
  params,
  searchParams: { step = Steps.BASIC, id },
}: Props) {
  if (
    !Object.values(SessionType).includes(params.type as SessionType) ||
    !Object.values(Steps).includes(step as Steps)
  ) {
    notFound();
  }

  const sessionData = await getASession(Number(id) || null);

  return <StepsController activeStep={step as Steps} sessionData={sessionData} />;
}
