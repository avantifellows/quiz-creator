'use client';

import { useLayoutEffect, useReducer, useRef, useState } from 'react';
import { Eye, Pencil, Plus, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { emptyForm, seedExample } from '../lib/model';
import { reducer } from '../lib/reducer';
import { FormState } from '../lib/types';
import { FieldLabel } from './fields';
import { EmitDialog } from './EmitDialog';
import { Preview } from './Preview';
import { SectionCard } from './SectionCard';

export function FormBuilder() {
  const [state, dispatch] = useReducer(reducer, undefined, seedExample);
  const [showPreview, setShowPreview] = useState(false);
  // The one question showing its editor; all others render as the student sees them.
  const [activeId, setActiveId] = useState<string | null>(null);

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

  function load(next: FormState) {
    dispatch({ type: 'load', state: next });
    setActiveId(null);
  }

  return (
    <div className='mx-auto max-w-[1400px] px-4 py-8 sm:px-6'>
      <div className='mb-6 flex flex-wrap items-end justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-bold text-foreground'>Form Builder</h1>
          <p className='text-sm text-muted-foreground'>
            {showPreview ? (
              'Previewing as a student — answer questions to see conditional ones appear.'
            ) : (
              <>
                Prototype · authors a <code>quiz_type=form</code> with conditional display. Nothing
                is saved. Click any question to edit it.
              </>
            )}
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <Button
            type='button'
            variant={showPreview ? 'default' : 'outline'}
            onClick={togglePreview}
          >
            {showPreview ? <Pencil className='mr-1 h-4 w-4' /> : <Eye className='mr-1 h-4 w-4' />}
            {showPreview ? 'Back to editing' : 'Preview'}
          </Button>
          {/* Form-replacing actions are editing-only, so a preview click can't wipe the form. */}
          {!showPreview && (
            <>
              <Button
                type='button'
                variant='outline'
                onClick={() => load(seedExample())}
                title='Reload the seeded example'
              >
                <RotateCcw className='mr-1 h-4 w-4' /> Reset example
              </Button>
              <Button
                type='button'
                variant='outline'
                onClick={() => load(emptyForm())}
                title='Start from an empty form'
              >
                Clear
              </Button>
            </>
          )}
          <EmitDialog state={state} />
        </div>
      </div>

      {showPreview ? (
        // Fresh mount on every open, so each preview run starts with no answers.
        <div className='mx-auto max-w-2xl'>
          <Preview state={state} />
        </div>
      ) : (
        <div className='mx-auto max-w-4xl'>
          {/* form-level settings */}
          <div className='mb-6 rounded-xl border border-border bg-card p-5 shadow-sm'>
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
              <div>
                <FieldLabel>Form name</FieldLabel>
                <Input
                  value={state.name}
                  onChange={(e) => dispatch({ type: 'set-name', value: e.target.value })}
                  placeholder='e.g. Grade 12 Mentorship Screener'
                />
              </div>
              <div>
                <FieldLabel>Single-page header text</FieldLabel>
                <Input
                  value={state.singlePageHeaderText}
                  onChange={(e) => dispatch({ type: 'set-header', value: e.target.value })}
                  placeholder='Shown above the form for respondents'
                />
              </div>
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
