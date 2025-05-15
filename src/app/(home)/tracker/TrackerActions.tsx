import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { patchTracker } from '@/services/services';
import { type Tracker } from '@/types';
import { MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

const TrackerActions = ({ tracker }: { tracker: Tracker }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='h-8 w-8 p-0'>
          <span className='sr-only'>Open menu</span>
          <MoreHorizontal className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent onClick={(e) => e.stopPropagation()}>
        <DropdownMenuItem asChild className='cursor-pointer'>
          <Link href={`/tracker/edit?id=${tracker.id}`} prefetch={false}>
            Edit
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className='cursor-pointer'>
          <Link href={`/tracker/duplicate?id=${tracker.id}`} prefetch={false}>
            Duplicate
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { TrackerActions };
