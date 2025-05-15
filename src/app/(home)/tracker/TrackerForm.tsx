'use client';

import { FormBuilder } from '@/components/FormBuilder';
import { createTracker, patchTracker } from '@/services/services';
import { Field, Tracker } from '@/types';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

// Define zodSchema for form validation
// Import the schema from form.types.ts
import { trackerFormSchema } from '@/types/form.types';

// Type for form values
type TrackerFormValues = z.infer<typeof trackerFormSchema>;

// Add the session field to the form values type
interface FormDataWithSession extends Partial<TrackerFormValues> {
  session?: string;
}

interface TrackerFormProps {
  initialData?: Partial<Tracker>;
  formOptions: {
    programTypes: string[];
    sessions: string[];
    subjects: string[];
    grades: string[];
    schools: Record<string, string[]>; // Mapped by program_type
    sessionTypes: Record<string, string[]>; // Mapped by session
    chapters: Record<string, Record<string, string[]>>; // Mapped by subject and grade
    topics: Record<string, Record<string, string[]>>; // Mapped by subject and chapter
  };
  isEdit?: boolean;
}

export function TrackerForm({ initialData, formOptions, isEdit = false }: TrackerFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<FormDataWithSession>({
    sub_session: 'main',
    // Default session for the session type filter
    session: 'regular',
  });

  // Initialize formData with initialData when available
  useEffect(() => {
    if (initialData) {
      const preparedData = {
        ...initialData,
        session_date: initialData.session_date ? new Date(initialData.session_date) : undefined,
        // Ensure topic is an array
        topic: Array.isArray(initialData.topic) ? initialData.topic : [],
      };
      setFormData(preparedData);
    }
  }, [initialData]);

  // Handler for form submission
  const handleSubmit = async (values: TrackerFormValues) => {
    try {
      const formattedValues = {
        ...values,
        session_date: format(values.session_date, 'yyyy-MM-dd'),
      };

      if (isEdit && initialData?.id) {
        await patchTracker(formattedValues, initialData.id);
        toast.success('Tracking updated successfully');
      } else {
        // For both new creation and duplication
        await createTracker(formattedValues);
        toast.success(
          initialData?.id ? 'Tracking duplicated successfully' : 'Tracking created successfully'
        );
      }

      router.push('/tracker');
    } catch (error) {
      toast.error('Failed to save tracking');
      console.error(error);
    }
  };

  // Create dynamic form schema based on current form data
  const getFormSchema = () => {
    const schema: Record<string, Field> = {
      teacher_id: {
        type: 'text',
        label: 'Teacher ID',
        placeholder: 'Enter teacher ID',
        required: true,
      },
      program_type: {
        type: 'select',
        label: 'Program Type',
        placeholder: 'Select program type',
        required: true,
        options: formOptions.programTypes.map((type) => ({
          label: type,
          value: type,
        })),
      },
      school_name: {
        type: 'select',
        label: 'School',
        placeholder: formData.program_type ? 'Select school' : 'Select program type first',
        required: true,
        options: formData.program_type
          ? (formOptions.schools[formData.program_type] || []).map((school) => ({
              label: school,
              value: school,
            }))
          : [],
        disabled: !formData.program_type,
      },
      tracker_session_type: {
        type: 'select',
        label: 'Tracker Session Type',
        placeholder: 'Select session type',
        required: true,
        options: (formOptions.sessionTypes[formData.session || 'regular'] || []).map((type) => ({
          label: type,
          value: type,
        })),
      },
      subject: {
        type: 'select',
        label: 'Subject',
        placeholder: 'Select subject',
        required: true,
        options: formOptions.subjects.map((subject) => ({
          label: subject,
          value: subject,
        })),
      },
      grade: {
        type: 'select',
        label: 'Grade',
        placeholder: formData.subject ? 'Select grade' : 'Select subject first',
        required: false,
        options: formOptions.grades.map((grade) => ({
          label: grade,
          value: grade,
        })),
        disabled: !formData.subject,
      },
      batch_year: {
        type: 'text',
        label: 'Batch Year',
        placeholder: 'Enter batch year',
        required: false,
      },
      chapter: {
        type: 'select',
        label: 'Chapter',
        placeholder: !formData.subject
          ? 'Select subject first'
          : !formData.grade
            ? 'Select grade first'
            : 'Select chapter',
        required: false,
        options:
          formData.subject && formData.grade
            ? (
                formOptions.chapters[formData.subject as string]?.[formData.grade as string] || []
              ).map((chapter) => ({
                label: chapter,
                value: chapter,
              }))
            : [],
        disabled: !formData.subject || !formData.grade,
      },
      session_date: {
        type: 'datetime',
        label: 'Session Date',
        placeholder: 'Select date',
        required: true,
      },
      session_duration: {
        type: 'text',
        label: 'Duration (minutes)',
        placeholder: 'Enter duration in minutes',
        required: true,
        pattern: '[0-9]*',
      },
      topic: {
        type: 'multi-select',
        label: 'Topics',
        placeholder: !formData.subject
          ? 'Select subject first'
          : !formData.chapter
            ? 'Select chapter first'
            : 'Select topics',
        required: false,
        options:
          formData.subject && formData.chapter
            ? (
                formOptions.topics[formData.subject as string]?.[formData.chapter as string] || []
              ).map((topic) => ({
                label: topic,
                value: topic,
              }))
            : [],
        disabled: !formData.subject || !formData.chapter,
      },
      // Hidden fields with default values
      tracker_type: {
        type: 'text',
        label: 'Tracker Type',
        defaultValue: 'regular',
        hide: true,
      },
      sub_session: {
        type: 'text',
        label: 'Sub Session',
        defaultValue: 'main',
        hide: true,
      },
    };

    return schema;
  };

  // Determine if this is a duplicate operation - initialData exists but we're not editing
  const isDuplicate = !isEdit && initialData && Object.keys(initialData).length > 0;

  return (
    <div className='container mx-auto py-8'>
      <h1 className='text-2xl font-bold mb-6'>
        {isEdit ? 'Edit Tracking' : isDuplicate ? 'Duplicate Tracking' : 'Add Tracking'}
      </h1>

      <div className='max-w-2xl mx-auto'>
        <FormBuilder
          formSchema={getFormSchema() as any}
          zodSchema={trackerFormSchema}
          defaultValues={formData as TrackerFormValues}
          handleSubmit={handleSubmit}
          buttons={{
            submit: {
              text: isEdit
                ? 'Update Tracking'
                : isDuplicate
                  ? 'Duplicate Tracking'
                  : 'Create Tracking',
            },
            reset: {
              text: 'Cancel',
              onClick: () => router.push('/tracker'),
            },
          }}
        />
      </div>
    </div>
  );
}
