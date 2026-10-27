'use client';

import { useEffect, useState, useTransition } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Copy, Eye, Lock, MoreHorizontal, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { deleteForm, getFormSessions } from '@/services/forms';
import type { FormSession, FormSummary } from '@/app/form-builder/lib/definition';

const LANG_LABEL: Record<string, string> = { en: 'EN', hi: 'HI' };

const formatDate = (iso: string | null) =>
  iso
    ? new Date(iso).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : '—';

async function copyFormId(id: string) {
  try {
    await navigator.clipboard.writeText(id);
    toast.success('Form ID copied', { description: id });
  } catch {
    toast.error('Could not copy the form ID');
  }
}

/**
 * Forms list (decision D14): newest updated first, title search (all forms, server-side),
 * details on row click, and the row actions Preview / Edit (View when locked) / Duplicate /
 * Copy form ID / Delete. Search and page live in the URL, so the server page refetches.
 */
export function FormsList({
  forms,
  search,
  page,
  hasMore,
  failed,
}: {
  forms: FormSummary[];
  search: string;
  page: number;
  hasMore: boolean;
  failed: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [term, setTerm] = useState(search);
  const [detailsOf, setDetailsOf] = useState<FormSummary | null>(null);
  const [deleting, setDeleting] = useState<FormSummary | null>(null);

  const go = (nextSearch: string, nextPage: number) => {
    const params = new URLSearchParams();
    if (nextSearch.trim()) params.set('search', nextSearch.trim());
    if (nextPage > 0) params.set('page', String(nextPage));
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  };

  // Search as the author types, without a request per keystroke.
  useEffect(() => {
    if (term.trim() === search.trim()) return;
    const timer = setTimeout(() => go(term, 0), 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [term]);

  return (
    <div>
      <div className='mb-4 flex flex-wrap items-end justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-bold text-foreground'>Forms</h1>
          <p className='text-sm text-muted-foreground'>
            Build a form once, then pick it when you create a form session.
          </p>
        </div>
        <Button asChild>
          <Link href='/forms/create'>
            <Plus className='mr-1 h-4 w-4' /> Create form
          </Link>
        </Button>
      </div>

      <div className='relative mb-4 max-w-sm'>
        <Search className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
        <Input
          className='pl-9'
          placeholder='Search forms by title'
          value={term}
          onChange={(e) => setTerm(e.target.value)}
        />
      </div>

      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Languages</TableHead>
              <TableHead>Last updated</TableHead>
              <TableHead>Created by</TableHead>
              <TableHead className='w-12'>
                <span className='sr-only'>Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {forms.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className='h-24 text-center text-muted-foreground'>
                  {failed
                    ? 'Could not load forms. Please refresh in a moment.'
                    : search
                      ? 'No forms match your search.'
                      : 'No forms yet. Create your first form.'}
                </TableCell>
              </TableRow>
            ) : (
              forms.map((form) => (
                <TableRow
                  key={form._id}
                  className='cursor-pointer'
                  onClick={() => setDetailsOf(form)}
                >
                  <TableCell className='p-2 font-medium'>{form.title || 'Untitled form'}</TableCell>
                  <TableCell className='p-2'>
                    <StatusBadge form={form} />
                  </TableCell>
                  <TableCell className='p-2'>
                    {form.languages.map((l) => LANG_LABEL[l] ?? l).join(' · ')}
                  </TableCell>
                  <TableCell className='p-2'>{formatDate(form.updated_at)}</TableCell>
                  <TableCell className='p-2 text-muted-foreground'>{form.created_by}</TableCell>
                  <TableCell className='p-2' onClick={(e) => e.stopPropagation()}>
                    <RowActions
                      form={form}
                      onOpen={(path) => router.push(path)}
                      onDelete={() => setDeleting(form)}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className='flex items-center justify-end gap-4 py-4'>
        <Button onClick={() => go(search, page - 1)} disabled={page === 0}>
          Previous
        </Button>
        <Button onClick={() => go(search, page + 1)} disabled={!hasMore}>
          Next
        </Button>
      </div>

      <FormDetails form={detailsOf} onClose={() => setDetailsOf(null)} />
      <DeleteDialog
        form={deleting}
        onClose={() => setDeleting(null)}
        onDeleted={() => router.refresh()}
      />
    </div>
  );
}

/** Locked (used by a session) / Draft (not complete yet, so not offered for sessions) / Ready. */
function StatusBadge({ form }: { form: FormSummary }) {
  if (form.locked_at)
    return (
      <Badge variant='secondary' className='gap-1 font-medium'>
        <Lock className='h-3 w-3' /> Locked
      </Badge>
    );
  if (!form.ready)
    return (
      <Badge
        variant='outline'
        className='font-medium text-muted-foreground'
        title='Not complete yet, so it is not offered when creating a session'
      >
        Draft
      </Badge>
    );
  return (
    <Badge variant='outline' className='font-medium'>
      Editable
    </Badge>
  );
}

function RowActions({
  form,
  onOpen,
  onDelete,
}: {
  form: FormSummary;
  onOpen: (path: string) => void;
  onDelete: () => void;
}) {
  const locked = Boolean(form.locked_at);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon' className='h-8 w-8' aria-label='Form actions'>
          <MoreHorizontal className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem onSelect={() => onOpen(`/forms/edit?id=${form._id}&preview=1`)}>
          <Eye className='mr-2 h-4 w-4' /> Preview
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => onOpen(`/forms/edit?id=${form._id}`)}>
          {locked ? <Lock className='mr-2 h-4 w-4' /> : <Pencil className='mr-2 h-4 w-4' />}
          {locked ? 'View' : 'Edit'}
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => onOpen(`/forms/create?from=${form._id}`)}>
          <Copy className='mr-2 h-4 w-4' /> Duplicate
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => copyFormId(form._id)}>
          <Copy className='mr-2 h-4 w-4' /> Copy form ID
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          disabled={locked}
          className='text-destructive focus:text-destructive'
          onSelect={onDelete}
        >
          <Trash2 className='mr-2 h-4 w-4' />
          <span className='flex flex-col'>
            Delete
            {locked && (
              <span className='text-xs text-muted-foreground'>
                Used in a session, can&apos;t be deleted
              </span>
            )}
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function FormDetails({ form, onClose }: { form: FormSummary | null; onClose: () => void }) {
  const [sessions, setSessions] = useState<FormSession[] | null | undefined>(undefined);

  useEffect(() => {
    setSessions(undefined);
    if (!form) return;
    let cancelled = false;
    getFormSessions(form._id).then((rows) => {
      if (!cancelled) setSessions(rows);
    });
    return () => {
      cancelled = true;
    };
  }, [form]);

  return (
    <Sheet open={form != null} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className='w-full overflow-y-auto sm:max-w-md'>
        {form && (
          <>
            <SheetHeader className='mr-6 border-b pb-3'>
              <SheetTitle>{form.title || 'Untitled form'}</SheetTitle>
              <div className='flex items-center gap-2'>
                <StatusBadge form={form} />
                <Link
                  href={`/forms/edit?id=${form._id}`}
                  className='text-sm text-primary underline-offset-4 hover:underline'
                >
                  {form.locked_at ? 'View' : 'Edit'}
                </Link>
                <Link
                  href={`/forms/edit?id=${form._id}&preview=1`}
                  className='text-sm text-primary underline-offset-4 hover:underline'
                >
                  Preview
                </Link>
              </div>
            </SheetHeader>
            <dl className='grid grid-cols-2 gap-x-4 gap-y-4 py-4 text-sm'>
              <Detail label='Questions'>{form.question_count}</Detail>
              <Detail label='Conditional questions'>{form.conditional_count}</Detail>
              <Detail label='Languages'>
                {form.languages.map((l) => LANG_LABEL[l] ?? l).join(' · ')}
              </Detail>
              <Detail label='Locked since'>
                {form.locked_at ? formatDate(form.locked_at) : 'Not used yet'}
              </Detail>
              <Detail label='Created by'>{form.created_by ?? '—'}</Detail>
              <Detail label='Created'>{formatDate(form.created_at)}</Detail>
              <Detail label='Last updated'>{formatDate(form.updated_at)}</Detail>
              <Detail label='Form ID'>
                <span className='break-all font-mono text-xs'>{form._id}</span>
              </Detail>
            </dl>
            <div className='border-t pt-4'>
              <h4 className='mb-2 text-sm font-semibold'>
                Sessions using this form{sessions ? ` (${sessions.length})` : ''}
              </h4>
              {sessions === undefined ? (
                <p className='text-sm text-muted-foreground'>Loading…</p>
              ) : sessions === null ? (
                <p className='text-sm text-muted-foreground'>Could not load the sessions.</p>
              ) : sessions.length === 0 ? (
                <p className='text-sm text-muted-foreground'>
                  Not used in any session yet, so it can still be edited or deleted.
                </p>
              ) : (
                <ul className='flex flex-col gap-1 text-sm'>
                  {sessions.map((s) => (
                    <li key={s.quiz_id}>
                      {s.title || 'Untitled session'}{' '}
                      <span className='text-muted-foreground'>· {formatDate(s.created_at)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className='font-semibold'>{label}</dt>
      <dd className='text-muted-foreground'>{children}</dd>
    </div>
  );
}

function DeleteDialog({
  form,
  onClose,
  onDeleted,
}: {
  form: FormSummary | null;
  onClose: () => void;
  onDeleted: () => void;
}) {
  const [pending, startTransition] = useTransition();
  const remove = () =>
    startTransition(async () => {
      if (!form) return;
      const result = await deleteForm(form._id);
      if (result.isSuccess) {
        toast.success('Form deleted', { description: form.title });
        onDeleted();
      } else {
        toast.error(result.locked ? 'This form is used in a session' : 'Could not delete', {
          description: result.locked ? "It can't be deleted." : result.error,
        });
      }
      onClose();
    });

  return (
    <Dialog open={form != null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete “{form?.title || 'Untitled form'}”?</DialogTitle>
          <DialogDescription>
            This permanently deletes the form. It has not been used in any session. This can&apos;t
            be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant='outline' onClick={onClose} disabled={pending}>
            Cancel
          </Button>
          <Button variant='destructive' onClick={remove} disabled={pending}>
            {pending ? 'Deleting…' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
