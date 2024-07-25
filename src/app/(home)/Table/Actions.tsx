import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { absoluteLink } from '@/lib/utils';
import { patchSession } from '@/services/services';
import type { Session } from '@/types';
import { Copy, LinkIcon, Loader, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';
import { toast } from 'sonner';

const TableActions = ({ session }: { session: Session }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent onClick={(e) => e.stopPropagation()}>
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href={`/session/edit?id=${session.id}`} prefetch={false}>
            Edit
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href={`/session/duplicate?id=${session.id}`} prefetch={false}>
            Duplicate
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer">
          <Button
            variant="ghost"
            className="w-full focus-visible:ring-0 justify-start font-normal"
            onClick={async () => {
              await patchSession(
                {
                  is_active: !session.is_active,
                },
                session.id ?? 0
              );
              toast.success(session.is_active ? 'Disabled the session' : 'Enabled the session', {
                description: 'Please refresh the page after a while.',
              });
            }}
          >
            {session.is_active ? 'Disable' : 'Enable'} Session
          </Button>
        </DropdownMenuItem>
        {/* <DropdownMenuItem asChild className="cursor-pointer">
          <Button
            variant="ghost"
            className="w-full focus-visible:ring-0 justify-start font-normal"
            onClick={() => {
              sendCreateSns(session.id);
              toast.success('Request send successfully', {
                description:
                  'The links will be available/updated shortly. Please refresh the page after a while.',
              });
            }}
          >
            Regenerate Links
          </Button>
        </DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const LinkAction = ({ value, pending }: { value: string; pending: boolean }) => {
  const memoLink = useMemo(() => absoluteLink(value), [value]);

  if (!memoLink) {
    if (pending) {
      return <Loader className="size-4 mx-auto motion-safe:animate-spin-slow" />;
    }
    return <>-</>;
  }

  return (
    <div className="flex place-content-center gap-1" onClick={(e) => e.stopPropagation()}>
      <Link
        href={memoLink}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex p-1"
        prefetch={false}
      >
        <LinkIcon className="size-4 mx-auto cursor-pointer" />
      </Link>
      <CopyBtn value={memoLink} />
    </div>
  );
};

const CopyBtn = ({ value }: { value: string }) => {
  return (
    <Button
      variant="ghost"
      className="p-1 h-auto"
      onClick={(e) => {
        navigator.clipboard.writeText(value);
        toast.success('Copied Link to clipboard', { duration: 2000 });
      }}
    >
      <Copy className="size-4" />
    </Button>
  );
};

export { CopyBtn, LinkAction, TableActions };
