import { getFormOptions, getTracker } from '@/services/services';
import { TrackerForm } from '../TrackerForm';
import { notFound } from 'next/navigation';

export default async function EditTracker({ searchParams }: { searchParams: { id?: string } }) {
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

  return (
    <div className='container mx-auto py-4'>
      <TrackerForm formOptions={formOptions} initialData={trackerData} isEdit={true} />
    </div>
  );
}
