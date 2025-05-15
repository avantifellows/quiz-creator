import { getFormOptions, getTracker } from '@/services/services';
import { TrackerForm } from '../TrackerForm';
import { notFound } from 'next/navigation';

// Define keys to delete before duplicating
const KeysToDeleteBeforeDuplicate = ['id', 'created_at', 'updated_at'];

export default async function DuplicateTracker({
  searchParams,
}: {
  searchParams: { id?: string };
}) {
  // Check if ID exists
  if (!searchParams.id) {
    notFound();
  }

  const id = parseInt(searchParams.id, 10);

  // Fetch form options and tracker data from the API
  const [formOptions, trackerData] = await Promise.all([getFormOptions(), getTracker(id)]);

  // Handle case where tracker data is not found
  if (!trackerData) {
    notFound();
  }

  // Remove fields that shouldn't be duplicated
  const duplicateData = { ...trackerData };
  KeysToDeleteBeforeDuplicate.forEach((key) => {
    if (key in duplicateData) {
      delete duplicateData[key as keyof typeof duplicateData];
    }
  });

  return (
    <div className='container mx-auto py-4'>
      <TrackerForm formOptions={formOptions} initialData={duplicateData} isEdit={false} />
    </div>
  );
}
