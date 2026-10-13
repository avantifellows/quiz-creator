import type { Metadata } from 'next';
import { FormBuilder } from './components/FormBuilder';

export const metadata: Metadata = {
  title: 'Form Builder (prototype)',
  description: 'Conditional-question form builder prototype',
};

export default function FormBuilderPage() {
  return <FormBuilder />;
}
