import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { FormBuilder } from '@/app/form-builder/components/FormBuilder';
import { duplicateForm, fromDefinition } from '@/app/form-builder/lib/definition';
import { getForm } from '@/services/forms';

export const metadata: Metadata = {
  title: 'Form builder',
  description: 'Create or edit a form with conditional questions',
};

interface Props {
  params: { type: string };
  searchParams: { id?: string; from?: string; preview?: string };
}

/**
 * `/forms/create` (empty, or `?from=<id>`: a copy of that form, stored only when saved — D20)
 * and `/forms/edit?id=<id>` (`&preview=1` opens straight in the preview; a form used by a
 * session opens read-only — D13).
 */
export default async function FormBuilderPage({ params: { type }, searchParams }: Props) {
  if (type === 'create') {
    if (!searchParams.from) return <FormBuilder mode='create' />;
    const source = await getForm(searchParams.from);
    if (!source) notFound();
    return (
      <FormBuilder
        key={`copy-${source._id}`}
        mode='create'
        initial={duplicateForm(fromDefinition(source))}
      />
    );
  }
  if (type !== 'edit' || !searchParams.id) notFound();

  const form = await getForm(searchParams.id);
  if (!form) notFound();
  return (
    <FormBuilder
      // Remount when switching forms, between edit and preview, or when the form gets locked
      // — but not after an ordinary save, which would close the question being edited.
      key={`${form._id}-${form.locked_at ? 'locked' : 'open'}-${searchParams.preview ?? ''}`}
      mode={form.locked_at ? 'locked' : 'edit'}
      formId={form._id}
      initial={fromDefinition(form)}
      startInPreview={searchParams.preview === '1'}
    />
  );
}
