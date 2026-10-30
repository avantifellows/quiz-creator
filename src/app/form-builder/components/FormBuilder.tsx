'use client';

import { useLayoutEffect, useMemo, useReducer, useRef, useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  AlertCircle,
  ArrowLeft,
  Copy,
  Eye,
  FileClock,
  Lock,
  Pencil,
  Plus,
  Save,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { createForm, saveForm } from '@/services/forms';
import { toDefinition } from '../lib/definition';
import { FormProblem, formProblems, newForm } from '../lib/model';
import { reducer } from '../lib/reducer';
import { FormState } from '../lib/types';
import { FieldLabel } from './fields';
import { Preview } from './Preview';
import { SectionCard } from './SectionCard';

/**
 * `create`: a new form (empty, or a Duplicate's copy in `initial`). `edit`: a saved form no
 * session has used. `locked`: a form already used in a session (decision D13) — shown as the
 * student sees it, with Duplicate as the way to change it. Forms are stored by quiz-backend
 * (services/forms.ts); a draft may be saved incomplete, it is just not offered for sessions.
 */
export function FormBuilder({
  mode,
  formId,
  initial,
  startInPreview = false,
}: {
  mode: 'create' | 'edit' | 'locked';
  formId?: string;
  initial?: FormState;
  startInPreview?: boolean;
}) {
  const router = useRouter();
  const [saving, startSaving] = useTransition();
  const [state, dispatch] = useReducer(reducer, undefined, () => initial ?? newForm());
  const [showPreview, setShowPreview] = useState(startInPreview || mode === 'locked');
  // The one question showing its editor; all others render as the student sees them. A new
  // form opens its first (empty) question.
  const [activeId, setActiveId] = useState<string | null>(() =>
    mode === 'create' && !initial ? (state.sections[0]?.questions[0]?.id ?? null) : null
  );
  // What is still missing. Highlighted on the cards once a "Save" found problems, and kept
  // up to date as the author fixes them (each fixed problem disappears).
  const problems = useMemo(() => formProblems(state), [state]);
  const [showProblems, setShowProblems] = useState(false);
  const [problemsOpen, setProblemsOpen] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const shownProblems = showProblems ? problems : [];

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

  /**
   * "Save" (`asDraft` false) only stores a complete form, so it can be picked for sessions;
   * if anything is missing it lists and highlights it instead. "Save as draft" stores the form
   * as it is (decision D22) — it just isn't offered for sessions until complete.
   */
  function save(asDraft: boolean) {
    if (!state.name.trim()) {
      setShowProblems(true);
      toast.error('Give the form a name before saving');
      nameRef.current?.focus();
      return;
    }
    if (!asDraft && problems.length > 0) {
      setShowProblems(true);
      setProblemsOpen(true);
      return;
    }
    startSaving(async () => {
      const content = toDefinition(state);
      const result = formId ? await saveForm(formId, content) : await createForm(content);
      if (!result.isSuccess) {
        if (result.locked) {
          toast.error('This form was just used in a session', {
            description: "It can't be changed any more. Duplicate it to make changes.",
          });
          router.refresh();
        } else {
          toast.error('Could not save the form', { description: result.error });
        }
        return;
      }
      if (asDraft) {
        toast.success('Saved as draft', {
          description: problems.length
            ? 'It will be offered for sessions once it is complete.'
            : 'Nothing is missing; use Save to mark it complete.',
        });
      } else {
        setShowProblems(false);
        toast.success('Form saved', {
          description: 'It can now be picked when creating a session.',
        });
      }
      if (!formId && result.id) router.replace(`/forms/edit?id=${result.id}`);
      else router.refresh();
    });
  }

  /** Jump from the problems list to the question (or the form name) it is about. */
  function goTo(problem: FormProblem) {
    setProblemsOpen(false);
    if (problem.qid) setActiveId(problem.qid);
    else if (problem.where === 'Form name') nameRef.current?.focus();
  }

  return (
    <div>
      <Link
        href='/forms'
        className='mb-3 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground'
      >
        <ArrowLeft className='h-4 w-4' /> Form Builder
      </Link>
      <div className='mb-6 flex flex-wrap items-end justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-bold text-foreground'>{heading}</h1>
          <p className='text-sm text-muted-foreground'>
            {mode === 'locked'
              ? 'Shown as a student sees it — answer questions to see conditional ones appear.'
              : showPreview
                ? 'Previewing as a student — answer questions to see conditional ones appear.'
                : 'Click any question to edit it. Not finished? Save as draft and come back later.'}
          </p>
        </div>
        <div className='flex items-center gap-2'>
          {mode === 'locked' ? (
            <Button asChild>
              <Link href={`/forms/create?from=${formId}`}>
                <Copy className='mr-1 h-4 w-4' /> Duplicate to edit
              </Link>
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
              <Button
                type='button'
                variant='outline'
                onClick={() => save(true)}
                disabled={saving}
                title='Store the form as it is; it is not offered for sessions until complete'
              >
                <FileClock className='mr-1 h-4 w-4' /> Save as draft
              </Button>
              <Button
                type='button'
                onClick={() => save(false)}
                disabled={saving}
                title='Check the form and save it so it can be picked for sessions'
              >
                <Save className='mr-1 h-4 w-4' /> {saving ? 'Saving…' : 'Save'}
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
                ref={nameRef}
                value={state.name}
                onChange={(e) => dispatch({ type: 'set-name', value: e.target.value })}
                placeholder='e.g. Grade 12 Mentorship Screener'
                className={cn(showProblems && !state.name.trim() && 'border-destructive')}
              />
              {showProblems && !state.name.trim() && (
                <p className='mt-1 text-sm font-medium text-destructive'>The form has no name.</p>
              )}
            </div>
            <div className='mt-4 max-w-xl'>
              <FieldLabel>Single Page Header Text</FieldLabel>
              <Input
                value={state.header}
                onChange={(e) => dispatch({ type: 'set-header', value: e.target.value })}
                placeholder='Enter the header text to display on the form'
              />
              <p className='mt-1 text-sm text-muted-foreground'>
                This text will appear as a header on the single page form
              </p>
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
                problems={shownProblems.filter((p) => p.sectionId === section.id)}
              />
            ))
          )}

          <Button type='button' onClick={() => dispatch({ type: 'add-section' })}>
            <Plus className='mr-1 h-4 w-4' /> Add Section
          </Button>
        </div>
      )}

      <Dialog open={problemsOpen} onOpenChange={setProblemsOpen}>
        <DialogContent className='max-h-[80vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>Some things are missing</DialogTitle>
            <DialogDescription>
              Fix these to save the form, or use Save as draft to keep working on it later. Click
              one to go to it.
            </DialogDescription>
          </DialogHeader>
          <ul className='flex flex-col gap-1'>
            {problems.map((p, i) => (
              <li key={`${p.where}-${p.message}-${i}`}>
                <button
                  type='button'
                  onClick={() => goTo(p)}
                  className='flex w-full items-start gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-muted'
                >
                  <AlertCircle className='mt-0.5 h-4 w-4 shrink-0 text-destructive' />
                  <span>
                    <span className='font-semibold'>{p.where}:</span> {p.message}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </DialogContent>
      </Dialog>
    </div>
  );
}
