import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <section className='w-full h-[60vh] overflow-hidden flex justify-center items-center gap-2'>
      <Loader2 className='size-6 animate-spin' /> <h3 className='md:text-lg'>Loading...</h3>
    </section>
  );
}
