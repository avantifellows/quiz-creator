import { getFormOptions } from '@/services/services';
import { TrackerForm } from '../TrackerForm';

export default async function CreateTracker() {
  // Fetch form options from the API
  const formOptions = await getFormOptions();

  return (
    <div className='container mx-auto py-4'>
      <TrackerForm formOptions={formOptions} isEdit={false} />
    </div>
  );
}
