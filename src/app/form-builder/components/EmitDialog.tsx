'use client';

import { useMemo, useState } from 'react';
import { Check, Copy, TriangleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toQuizPayload, validate } from '../lib/model';
import { FormState } from '../lib/types';

/**
 * Read-only emit. Shows the exact POST /quiz payload the builder would send (with
 * display_condition resolved to {source_position, option_indices}) plus any authoring
 * problems. Deliberately performs NO network call — persistence is a deferred decision.
 */
export function EmitDialog({ state }: { state: FormState }) {
  const [copied, setCopied] = useState(false);
  const payload = useMemo(() => toQuizPayload(state), [state]);
  const problems = useMemo(() => validate(state), [state]);
  const json = useMemo(() => JSON.stringify(payload, null, 2), [payload]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(json);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard may be unavailable; ignore in the prototype */
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type='button'>View POST /quiz payload</Button>
      </DialogTrigger>
      <DialogContent className='max-h-[85vh] max-w-3xl overflow-hidden'>
        <DialogHeader>
          <DialogTitle>POST /quiz payload</DialogTitle>
          <DialogDescription>
            quiz_type=form, with display_condition resolved to positions + option indices. This
            prototype does not send it — persistence is deferred.
          </DialogDescription>
        </DialogHeader>

        {problems.length > 0 && (
          <div className='rounded-md border border-destructive/40 bg-destructive/10 p-3'>
            <p className='mb-1 flex items-center gap-2 text-sm font-semibold text-destructive'>
              <TriangleAlert className='h-4 w-4' /> {problems.length} issue
              {problems.length > 1 ? 's' : ''} to fix before this form would be valid
            </p>
            <ul className='list-inside list-disc text-sm text-destructive'>
              {problems.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </div>
        )}

        <div className='relative overflow-auto rounded-md border border-border bg-muted/40'>
          <Button
            type='button'
            variant='outline'
            size='sm'
            className='absolute right-2 top-2 z-10'
            onClick={copy}
          >
            {copied ? <Check className='h-4 w-4' /> : <Copy className='h-4 w-4' />}
            <span className='ml-1'>{copied ? 'Copied' : 'Copy'}</span>
          </Button>
          <pre className='max-h-[55vh] overflow-auto p-4 text-xs leading-relaxed'>
            <code>{json}</code>
          </pre>
        </div>
      </DialogContent>
    </Dialog>
  );
}
