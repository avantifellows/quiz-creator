'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
import { FormSummary } from './sampleForms';

const PAGE_SIZE = 20;
const LANG_LABEL: Record<string, string> = { en: 'EN', hi: 'HI' };

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

const NOT_SAVED = 'Prototype: nothing is saved yet — this works once forms are stored.';

async function copyFormId(id: string) {
  try {
    await navigator.clipboard.writeText(id);
    toast.success('Form ID copied', { description: id });
  } catch {
    toast.error('Could not copy the form ID');
  }
}

/**
 * Forms list (decision D14): newest updated first, title search, details on row click, and the
 * row actions Preview / Edit (View when locked) / Duplicate / Copy form ID / Delete.
 */
export function FormsList({ forms }: { forms: FormSummary[] }) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [detailsOf, setDetailsOf] = useState<FormSummary | null>(null);
  const [deleting, setDeleting] = useState<FormSummary | null>(null);

  // The real list searches ALL forms server-side; the prototype filters the sample rows.
  const rows = useMemo(() => {
    const term = search.trim().toLowerCase();
    return [...forms]
      .filter((f) => !term || f.title.toLowerCase().includes(term))
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }, [forms, search]);
  const pageCount = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const pageRows = rows.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

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

      <p className='mb-4 rounded-md border border-dashed border-border px-3 py-2 text-sm italic text-muted-foreground'>
        Prototype: sample forms, nothing is saved.
      </p>

      <div className='relative mb-4 max-w-sm'>
        <Search className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
        <Input
          className='pl-9'
          placeholder='Search forms by title'
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
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
            {pageRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className='h-24 text-center text-muted-foreground'>
                  {search ? 'No forms match your search.' : 'No forms yet. Create your first form.'}
                </TableCell>
              </TableRow>
            ) : (
              pageRows.map((form) => (
                <TableRow
                  key={form.id}
                  className='cursor-pointer'
                  onClick={() => setDetailsOf(form)}
                >
                  <TableCell className='p-2 font-medium'>{form.title}</TableCell>
                  <TableCell className='p-2'>
                    <StatusBadge form={form} />
                  </TableCell>
                  <TableCell className='p-2'>
                    {form.languages.map((l) => LANG_LABEL[l]).join(' · ')}
                  </TableCell>
                  <TableCell className='p-2'>{formatDate(form.updatedAt)}</TableCell>
                  <TableCell className='p-2 text-muted-foreground'>{form.createdBy}</TableCell>
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

      <div className='flex items-center justify-between py-4 text-sm text-muted-foreground'>
        <span>
          {rows.length} form{rows.length === 1 ? '' : 's'}
        </span>
        <div className='flex gap-4'>
          <Button onClick={() => setPage((p) => p - 1)} disabled={page === 0}>
            Previous
          </Button>
          <Button onClick={() => setPage((p) => p + 1)} disabled={page >= pageCount - 1}>
            Next
          </Button>
        </div>
      </div>

      <FormDetails form={detailsOf} onClose={() => setDetailsOf(null)} />
      <DeleteDialog form={deleting} onClose={() => setDeleting(null)} />
    </div>
  );
}

function StatusBadge({ form }: { form: FormSummary }) {
  return form.lockedAt ? (
    <Badge variant='secondary' className='gap-1 font-medium'>
      <Lock className='h-3 w-3' /> Locked
    </Badge>
  ) : (
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
  const locked = Boolean(form.lockedAt);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon' className='h-8 w-8' aria-label='Form actions'>
          <MoreHorizontal className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem onSelect={() => onOpen(`/forms/edit?id=${form.id}&preview=1`)}>
          <Eye className='mr-2 h-4 w-4' /> Preview
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => onOpen(`/forms/edit?id=${form.id}`)}>
          {locked ? <Lock className='mr-2 h-4 w-4' /> : <Pencil className='mr-2 h-4 w-4' />}
          {locked ? 'View' : 'Edit'}
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => toast.info('Duplicate', { description: NOT_SAVED })}>
          <Copy className='mr-2 h-4 w-4' /> Duplicate
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => copyFormId(form.id)}>
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
  return (
    <Sheet open={form != null} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className='w-full overflow-y-auto sm:max-w-md'>
        {form && (
          <>
            <SheetHeader className='mr-6 border-b pb-3'>
              <SheetTitle>{form.title}</SheetTitle>
              <div className='flex items-center gap-2'>
                <StatusBadge form={form} />
                <Link
                  href={`/forms/edit?id=${form.id}`}
                  className='text-sm text-primary underline-offset-4 hover:underline'
                >
                  {form.lockedAt ? 'View' : 'Edit'}
                </Link>
                <Link
                  href={`/forms/edit?id=${form.id}&preview=1`}
                  className='text-sm text-primary underline-offset-4 hover:underline'
                >
                  Preview
                </Link>
              </div>
            </SheetHeader>
            <dl className='grid grid-cols-2 gap-x-4 gap-y-4 py-4 text-sm'>
              <Detail label='Questions'>{form.questionCount}</Detail>
              <Detail label='Conditional questions'>{form.conditionalCount}</Detail>
              <Detail label='Languages'>
                {form.languages.map((l) => LANG_LABEL[l]).join(' · ')}
              </Detail>
              <Detail label='Locked since'>
                {form.lockedAt ? formatDate(form.lockedAt) : 'Not used yet'}
              </Detail>
              <Detail label='Created by'>{form.createdBy}</Detail>
              <Detail label='Created'>{formatDate(form.createdAt)}</Detail>
              <Detail label='Last updated'>{formatDate(form.updatedAt)}</Detail>
              <Detail label='Form ID'>
                <span className='break-all font-mono text-xs'>{form.id}</span>
              </Detail>
            </dl>
            <div className='border-t pt-4'>
              <h4 className='mb-2 text-sm font-semibold'>
                Sessions using this form ({form.sessions.length})
              </h4>
              {form.sessions.length === 0 ? (
                <p className='text-sm text-muted-foreground'>
                  Not used in any session yet, so it can still be edited or deleted.
                </p>
              ) : (
                <ul className='flex flex-col gap-1 text-sm'>
                  {form.sessions.map((s) => (
                    <li key={s.id}>
                      {s.name} <span className='text-muted-foreground'>· #{s.id}</span>
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

function DeleteDialog({ form, onClose }: { form: FormSummary | null; onClose: () => void }) {
  return (
    <Dialog open={form != null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete “{form?.title}”?</DialogTitle>
          <DialogDescription>
            This permanently deletes the form. It has not been used in any session. This can&apos;t
            be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant='outline' onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant='destructive'
            onClick={() => {
              toast.info('Delete', { description: NOT_SAVED });
              onClose();
            }}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
