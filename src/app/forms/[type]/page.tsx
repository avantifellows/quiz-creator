import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { FormBuilder } from '@/app/form-builder/components/FormBuilder';
import { findSampleForm } from '../sampleForms';

export const metadata: Metadata = {
  title: 'Form builder',
  description: 'Create or edit a form with conditional questions',
};

interface Props {
  params: { type: string };
  searchParams: { id?: string; preview?: string };
}

/** `/forms/create` and `/forms/edit?id=…` (`&preview=1` opens straight in the preview). */
export default function FormBuilderPage({ params: { type }, searchParams }: Props) {
  if (type === 'create') return <FormBuilder mode='create' />;
  if (type !== 'edit') notFound();

  const form = findSampleForm(searchParams.id);
  if (!form) notFound();
  return (
    <FormBuilder
      // Remount when switching between forms or between edit and preview.
      key={`${form.id}-${searchParams.preview ?? ''}`}
      mode={form.lockedAt ? 'locked' : 'edit'}
      title={form.title}
      startInPreview={searchParams.preview === '1'}
    />
  );
}
