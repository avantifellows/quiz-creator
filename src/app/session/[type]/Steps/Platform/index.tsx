'use client';

import { useFormContext } from '@/hooks/useFormContext';
import { Platform } from '@/types';
import { FC, useMemo } from 'react';
import LiveForm from './Live';
import QuizForm from './Quiz';

const PlatformComponents = {
  [Platform.Quiz]: QuizForm,
  [Platform.Live]: LiveForm,
  [Platform.Meet]: LiveForm,
  [Platform.Zoom]: LiveForm,
  [Platform.Plio]: LiveForm,
  [Platform.SPlio]: LiveForm,
  [Platform.Others]: LiveForm,
};

const PlatformForm: FC = () => {
  const { formData } = useFormContext();

  const platform = useMemo(() => formData?.platform ?? Platform.Quiz, [formData]);

  const Component = useMemo(
    () => PlatformComponents[platform as keyof typeof PlatformComponents],
    [platform]
  );
  return <Component />;
};

export default PlatformForm;
