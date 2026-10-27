import type { Metadata } from 'next';
import { FormsList } from './FormsList';
import { SAMPLE_FORMS } from './sampleForms';

export const metadata: Metadata = {
  title: 'Forms',
  description: 'Build forms and pick them when creating a form session',
};

export default function FormsPage() {
  // PROTOTYPE: sample rows until forms are stored in quiz-backend (decision D10).
  return <FormsList forms={SAMPLE_FORMS} />;
}
