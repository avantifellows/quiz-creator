import { KeysToDeleteBeforeDuplicate } from '@/Constants';
import StepsController from '@/app/session/[type]/Steps';
import { deleteByPath } from '@/lib/utils';
import { getASession, getAllOptions } from '@/services/services';
import { Session, SessionParams, SessionSearchParams, SessionType, Steps } from '@/types';
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

  let sessionData: Session = {};

  if (id) {
    if (params.type === SessionType.EDIT) {
      sessionData = await getASession(Number(id));
    } else if (params.type === SessionType.DUPLICATE) {
      sessionData = await getASession(Number(id));
      KeysToDeleteBeforeDuplicate.forEach((key) => deleteByPath(sessionData, key));
    }
  } else {
    sessionData = {};
  }

  const options = await getAllOptions();

  return <StepsController sessionData={sessionData} options={options} />;
}
