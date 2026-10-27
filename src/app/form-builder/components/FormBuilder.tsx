'use client';

import { useLayoutEffect, useReducer, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Copy, Eye, Lock, Pencil, Plus, Save } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { newForm, seedExample } from '../lib/model';
import { reducer } from '../lib/reducer';
import { FieldLabel } from './fields';
import { Preview } from './Preview';
import { SectionCard } from './SectionCard';

/**
 * `create`: a new form. `edit`: an unused form. `locked`: a form already used in a session
 * (decision D13) — shown as the student sees it, with Duplicate as the way to change it.
 * PROTOTYPE: there is no form backend yet, so edit/locked open the seeded example under the
 * listed form's title, and Save / Duplicate only explain that nothing is stored.
 */
export function FormBuilder({
  mode,
  title,
  startInPreview = false,
}: {
  mode: 'create' | 'edit' | 'locked';
  title?: string;
  startInPreview?: boolean;
}) {
  const [state, dispatch] = useReducer(reducer, undefined, () => {
    if (mode === 'create') return newForm();
    const example = seedExample();
    return title ? { ...example, name: title } : example;
  });
  const [showPreview, setShowPreview] = useState(startInPreview || mode === 'locked');
  // The one question showing its editor; all others render as the student sees them. A new
  // form opens its first (empty) question.
  const [activeId, setActiveId] = useState<string | null>(() =>
    mode === 'create' ? (state.sections[0]?.questions[0]?.id ?? null) : null
  );

  // Preview replaces the builder full-screen. Remember where the author was so "Back to
  // editing" returns them to the same spot; the preview itself starts at the top.
  const builderScrollY = useRef(0);
  const firstRender = useRef(true);
  useLayoutEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    window.scrollTo({ top: showPreview ? 0 : builderScrollY.current });
  }, [showPreview]);

  function togglePreview() {
    if (!showPreview) builderScrollY.current = window.scrollY;
    setShowPreview((v) => !v);
  }

  const heading = { create: 'Create form', edit: 'Edit form', locked: 'View form' }[mode];
  const notSaved = (what: string) =>
    toast.info(what, { description: 'Prototype: nothing is saved yet.' });

  return (
    <div>
      <Link
        href='/forms'
        className='mb-3 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground'
      >
        <ArrowLeft className='h-4 w-4' /> Forms
      </Link>
      <div className='mb-6 flex flex-wrap items-end justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-bold text-foreground'>{heading}</h1>
          <p className='text-sm text-muted-foreground'>
            {mode === 'locked'
              ? 'Shown as a student sees it — answer questions to see conditional ones appear.'
              : showPreview
                ? 'Previewing as a student — answer questions to see conditional ones appear.'
                : 'Prototype · nothing is saved. Click any question to edit it.'}
          </p>
        </div>
        <div className='flex items-center gap-2'>
          {mode === 'locked' ? (
            <Button type='button' onClick={() => notSaved('Duplicate')}>
              <Copy className='mr-1 h-4 w-4' /> Duplicate to edit
            </Button>
          ) : (
            <>
              <Button
                type='button'
                variant={showPreview ? 'default' : 'outline'}
                onClick={togglePreview}
              >
                {showPreview ? (
                  <Pencil className='mr-1 h-4 w-4' />
                ) : (
                  <Eye className='mr-1 h-4 w-4' />
                )}
                {showPreview ? 'Back to editing' : 'Preview'}
              </Button>
              <Button type='button' onClick={() => notSaved('Save')}>
                <Save className='mr-1 h-4 w-4' /> Save
              </Button>
            </>
          )}
        </div>
      </div>

      {mode === 'locked' && (
        <p className='mx-auto mb-4 flex max-w-5xl items-start gap-2 rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground'>
          <Lock className='mt-0.5 h-4 w-4 shrink-0' />
          This form was used in a session and can&apos;t be changed. Duplicate it to make changes.
        </p>
      )}

      {showPreview ? (
        // Fresh mount on every open, so each preview run starts with no answers.
        <div className='mx-auto max-w-5xl'>
          <Preview state={state} />
        </div>
      ) : (
        <div className='mx-auto max-w-4xl'>
          {/* form-level settings */}
          <div className='mb-6 rounded-xl border border-border bg-card p-5 shadow-sm'>
            <div className='max-w-xl'>
              <FieldLabel>Form name</FieldLabel>
              <Input
                value={state.name}
                onChange={(e) => dispatch({ type: 'set-name', value: e.target.value })}
                placeholder='e.g. Grade 12 Mentorship Screener'
              />
            </div>
            <div className='mt-4 flex flex-wrap items-center gap-6'>
              <div className='flex items-center gap-2'>
                <span className='text-xs font-bold uppercase tracking-wide text-muted-foreground'>
                  Languages
                </span>
                <button
                  type='button'
                  disabled
                  className='min-h-[36px] cursor-default rounded-lg border border-primary bg-primary px-3 text-sm font-bold uppercase tracking-wide text-primary-foreground'
                >
                  EN
                </button>
                <button
                  type='button'
                  onClick={() => dispatch({ type: 'toggle-hi' })}
                  className={cn(
                    'min-h-[36px] rounded-lg border px-3 text-sm font-bold uppercase tracking-wide transition-colors',
                    state.langs.hi
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-background text-muted-foreground hover:bg-muted/50'
                  )}
                >
                  HI
                </button>
              </div>
            </div>
          </div>

          {/* sections */}
          {state.sections.length === 0 ? (
            <p className='text-sm text-muted-foreground'>
              No sections yet. Click <strong>+ Add Section</strong> to start.
            </p>
          ) : (
            state.sections.map((section, i) => (
              <SectionCard
                key={section.id}
                state={state}
                section={section}
                sIndex={i}
                dispatch={dispatch}
                activeId={activeId}
                onActivate={setActiveId}
              />
            ))
          )}

          <Button type='button' onClick={() => dispatch({ type: 'add-section' })}>
            <Plus className='mr-1 h-4 w-4' /> Add Section
          </Button>
        </div>
      )}
    </div>
  );
}
