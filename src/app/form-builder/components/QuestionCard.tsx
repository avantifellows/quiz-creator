'use client';

import { Dispatch, useEffect, useRef } from 'react';
import {
  Circle,
  Copy,
  CornerDownRight,
  GitBranch,
  Keyboard,
  Square,
  Trash2,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import {
  cloneQuestion,
  conditionSummary,
  isOtherOption,
  newFollowUp,
  OTHER_OPTION_TEXT,
  possibleSources,
  questionById,
} from '../lib/model';
import type { Action } from '../lib/reducer';
import { CHOICE_TYPES, FormState, Question, QuestionType } from '../lib/types';
import { FieldLabel, PairedInput } from './fields';
import { StudentQuestion } from './StudentQuestion';

const QUESTION_TYPES: { value: QuestionType; label: string }[] = [
  { value: 'single-choice', label: 'Single choice' },
  { value: 'single-choice-other', label: 'Single choice + Other' },
  { value: 'multi-choice', label: 'Multiple choice' },
  { value: 'subjective', label: 'Free text' },
  { value: 'matrix-rating', label: 'Rating grid' },
];

// Option/row inputs look like plain text until hovered or focused, so the open editor reads
// like the question itself rather than a wall of boxes.
const QUIET_INPUT =
  'border-transparent bg-muted/40 shadow-none hover:border-border focus-visible:border-input';

interface Props {
  state: FormState;
  q: Question;
  index: number;
  dispatch: Dispatch<Action>;
  /** Only the active question shows the editor; every other one renders as the student sees it. */
  active: boolean;
  onActivate: () => void;
  /** Open another question for editing (a new follow-up or a duplicate). */
  openQuestion: (qid: string) => void;
  /** Display-only nesting under the trigger (see model `nestingDepths`). */
  nested: boolean;
}

export function QuestionCard({
  state,
  q,
  index,
  dispatch,
  active,
  onActivate,
  openQuestion,
  nested,
}: Props) {
  const hi = state.langs.hi;
  const isChoice = CHOICE_TYPES.includes(q.type);
  const ref = useRef<HTMLDivElement>(null);

  // Opening a card above the viewport (or adding one at the bottom) can push the editor
  // off-screen as the layout changes height; bring it back into view.
  useEffect(() => {
    if (active) ref.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [active]);

  if (!active) {
    return (
      <CollapsedQuestion
        state={state}
        q={q}
        index={index}
        nested={nested}
        onActivate={onActivate}
      />
    );
  }

  const sources = possibleSources(state, q.id);

  function addCondition() {
    dispatch({ type: 'cond-toggle', qid: q.id, value: true });
    // Most conditions hang off the nearest choice question above, so preselect it.
    if (!q.cond.src && sources.length > 0)
      dispatch({ type: 'cond-src', qid: q.id, src: sources[sources.length - 1].id });
  }

  function addFollowUp() {
    // Goes after this question's existing follow-ups; it opens with "Show only if <this> is …"
    // so the author picks the revealing option(s) right away.
    const fu = newFollowUp(q);
    dispatch({ type: 'add-follow-up', qid: q.id, question: fu });
    openQuestion(fu.id);
  }

  function duplicate() {
    const copy = cloneQuestion(q);
    dispatch({ type: 'dup-question', qid: q.id, question: copy });
    openQuestion(copy.id);
  }

  return (
    <div
      ref={ref}
      className='mb-4 rounded-lg border border-border border-l-4 border-l-primary bg-background shadow-md'
    >
      <div className='p-5'>
        {/* question text + answer type on one line */}
        <div className='flex flex-col gap-3 sm:flex-row sm:items-start'>
          <span className='mt-2 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary font-mono text-xs font-bold text-primary-foreground'>
            {index + 1}
          </span>
          <PairedInput
            className='flex-1'
            inputClassName='text-base font-medium'
            text={q.text}
            hiEnabled={hi}
            onChange={(lang, value) => dispatch({ type: 'set-qtext', qid: q.id, lang, value })}
            enPlaceholder='Question'
            hiPlaceholder='प्रश्न (Hindi)'
          />
          <Select
            value={q.type}
            onValueChange={(value) =>
              dispatch({ type: 'set-qtype', qid: q.id, value: value as QuestionType })
            }
          >
            <SelectTrigger className='sm:w-44' aria-label='Answer type'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {QUESTION_TYPES.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {q.cond.on && <ConditionSentence state={state} q={q} dispatch={dispatch} />}

        {isChoice && <OptionsEditor q={q} hi={hi} dispatch={dispatch} />}
        {q.type === 'matrix-rating' && <MatrixEditor q={q} hi={hi} dispatch={dispatch} />}
        {q.type === 'subjective' && (
          <p className='mt-4 flex items-center gap-2 text-sm italic text-muted-foreground'>
            <Keyboard className='h-4 w-4' /> Student types a free-text answer.
          </p>
        )}
      </div>

      {/* settings bar */}
      <div className='flex flex-wrap items-center justify-between gap-2 border-t border-border px-5 py-2'>
        <div className='flex flex-wrap items-center gap-1'>
          {!q.cond.on && (
            <Button
              type='button'
              variant='ghost'
              size='sm'
              className='text-muted-foreground'
              disabled={sources.length === 0}
              title={
                sources.length === 0
                  ? 'Needs a single/multiple-choice question above this one'
                  : 'Show this question only for certain answers to an earlier question'
              }
              onClick={addCondition}
            >
              <GitBranch className='mr-1.5 h-4 w-4' /> Show only if…
            </Button>
          )}
          {isChoice && (
            <Button
              type='button'
              variant='ghost'
              size='sm'
              className='text-muted-foreground'
              title='Add a question below that is shown only for certain answers to this one'
              onClick={addFollowUp}
            >
              <CornerDownRight className='mr-1.5 h-4 w-4' /> Add follow-up question
            </Button>
          )}
        </div>
        <div className='flex items-center gap-1'>
          <label
            className='flex cursor-pointer items-center gap-2 pr-2'
            title={
              q.cond.on
                ? 'Conditional: only required while the question is shown'
                : 'Student must answer this question before submitting'
            }
          >
            <span className='text-sm text-foreground'>Required</span>
            <Switch
              checked={q.required}
              onCheckedChange={(v) => dispatch({ type: 'set-required', qid: q.id, value: v })}
            />
          </label>
          <span className='mx-1 h-6 w-px bg-border' aria-hidden />
          <Button
            type='button'
            variant='ghost'
            size='icon'
            className='h-8 w-8 text-muted-foreground'
            title='Duplicate question'
            onClick={duplicate}
          >
            <Copy className='h-4 w-4' />
          </Button>
          <Button
            type='button'
            variant='ghost'
            size='icon'
            className='h-8 w-8 text-muted-foreground hover:text-destructive'
            title='Remove question'
            onClick={() => dispatch({ type: 'del-question', qid: q.id })}
          >
            <Trash2 className='h-4 w-4' />
          </Button>
        </div>
      </div>
    </div>
  );
}

/** Read-only student view of a question; clicking (or Enter/Space) opens it for editing. */
function CollapsedQuestion({
  state,
  q,
  index,
  nested,
  onActivate,
}: {
  state: FormState;
  q: Question;
  index: number;
  nested: boolean;
  onActivate: () => void;
}) {
  const summary = conditionSummary(state, q, { nested });
  return (
    <div
      role='button'
      tabIndex={0}
      aria-label={`Edit question ${index + 1}`}
      title='Click to edit'
      onClick={onActivate}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onActivate();
        }
      }}
      className='mb-4 cursor-pointer rounded-lg border border-border bg-background p-5 transition-colors hover:border-primary/50 hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
    >
      <div className='mb-3 flex flex-wrap items-center gap-2'>
        <span className='inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted font-mono text-xs font-bold text-muted-foreground'>
          {index + 1}
        </span>
        {summary && (
          <span className='inline-flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-[11px] font-semibold text-accent-foreground'>
            <CornerDownRight className='h-3 w-3' /> {summary}
          </span>
        )}
        {q.cond.on && !summary && (
          <span className='rounded-full bg-destructive/10 px-2 py-0.5 text-[11px] font-semibold text-destructive'>
            Condition incomplete
          </span>
        )}
      </div>
      <StudentQuestion q={q} lang='en' compact />
    </div>
  );
}

/** `Show only if [question ▾] is (opt) (opt) …  ✕` — the whole condition on one line. */
function ConditionSentence({
  state,
  q,
  dispatch,
}: {
  state: FormState;
  q: Question;
  dispatch: Dispatch<Action>;
}) {
  const sources = possibleSources(state, q.id);
  const src = questionById(state, q.cond.src);

  return (
    <div className='mt-3 flex flex-wrap items-center gap-2 rounded-md bg-accent/60 px-3 py-2 text-sm text-accent-foreground'>
      <GitBranch className='h-4 w-4 shrink-0' />
      <span className='font-medium'>Show only if</span>
      {sources.length === 0 ? (
        <span className='text-destructive'>
          — add a single/multiple-choice question above this one first.
        </span>
      ) : (
        <Select
          value={q.cond.src ?? ''}
          onValueChange={(value) => dispatch({ type: 'cond-src', qid: q.id, src: value })}
        >
          <SelectTrigger
            className='h-8 w-auto max-w-[260px] bg-background'
            aria-label='Trigger question'
          >
            <SelectValue placeholder='pick a question…' />
          </SelectTrigger>
          <SelectContent>
            {sources.map((s) => {
              const lbl = s.text.en || '(untitled question)';
              return (
                <SelectItem key={s.id} value={s.id}>
                  {lbl.length > 60 ? lbl.slice(0, 60) + '…' : lbl}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      )}
      {src && (
        <>
          <span className='font-medium'>is</span>
          {src.options.map((o, i) => {
            const on = q.cond.opts.includes(o.id);
            return (
              <button
                key={o.id}
                type='button'
                aria-pressed={on}
                onClick={() => dispatch({ type: 'cond-opt', qid: q.id, oid: o.id, checked: !on })}
                className={cn(
                  'rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
                  on
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-background text-muted-foreground hover:bg-muted'
                )}
              >
                {o.text.en || `Option ${i + 1}`}
              </button>
            );
          })}
          {q.cond.opts.length === 0 && (
            <span className='text-xs text-destructive'>pick at least one option</span>
          )}
        </>
      )}
      <Button
        type='button'
        variant='ghost'
        size='icon'
        className='ml-auto h-7 w-7'
        title='Remove condition (always show this question)'
        onClick={() => dispatch({ type: 'cond-toggle', qid: q.id, value: false })}
      >
        <X className='h-4 w-4' />
      </Button>
    </div>
  );
}

function OptionsEditor({
  q,
  hi,
  dispatch,
}: {
  q: Question;
  hi: boolean;
  dispatch: Dispatch<Action>;
}) {
  const Glyph = q.type === 'multi-choice' ? Square : Circle;

  return (
    <div className='mt-4 flex flex-col gap-2'>
      {q.options.map((opt) => {
        const isOther = isOtherOption(q, opt.id);
        return (
          <div key={opt.id} className='flex items-start gap-2'>
            <Glyph className='mt-3 h-4 w-4 shrink-0 text-muted-foreground' />
            {isOther ? (
              // Fixed label (same as the sheet flow); the student gets a text box under it.
              <div className='flex-1 px-3 py-2 text-sm'>
                <span className='font-medium'>
                  {OTHER_OPTION_TEXT.en}
                  {hi && <span className='text-muted-foreground'> / {OTHER_OPTION_TEXT.hi}</span>}
                </span>
                <span className='ml-2 text-xs italic text-muted-foreground'>
                  student types their answer
                </span>
              </div>
            ) : (
              <PairedInput
                className='flex-1'
                inputClassName={QUIET_INPUT}
                text={opt.text}
                hiEnabled={hi}
                onChange={(lang, value) =>
                  dispatch({ type: 'set-option', qid: q.id, oid: opt.id, lang, value })
                }
                enPlaceholder='Option'
                hiPlaceholder='विकल्प (Hindi)'
              />
            )}
            {isOther ? (
              // Same footprint as the remove button, so the rows stay aligned.
              <span className='h-8 w-8 shrink-0' aria-hidden />
            ) : (
              <Button
                type='button'
                variant='ghost'
                size='icon'
                className='mt-0.5 h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive'
                title='Remove option'
                onClick={() => dispatch({ type: 'del-option', qid: q.id, oid: opt.id })}
              >
                <X className='h-4 w-4' />
              </Button>
            )}
          </div>
        );
      })}
      <div className='pl-6 text-sm'>
        <Button
          type='button'
          variant='link'
          className='h-auto p-0 text-sm'
          onClick={() => dispatch({ type: 'add-option', qid: q.id })}
        >
          Add option
        </Button>
      </div>
    </div>
  );
}

function MatrixEditor({
  q,
  hi,
  dispatch,
}: {
  q: Question;
  hi: boolean;
  dispatch: Dispatch<Action>;
}) {
  return (
    <div className='mt-4'>
      <FieldLabel>Rows to rate</FieldLabel>
      <div className='flex flex-col gap-2'>
        {q.rows.map((row) => (
          <div key={row.id} className='flex items-start gap-2'>
            <PairedInput
              className='flex-1'
              inputClassName={QUIET_INPUT}
              text={row.text}
              hiEnabled={hi}
              onChange={(lang, value) =>
                dispatch({ type: 'set-row', qid: q.id, rid: row.id, lang, value })
              }
              enPlaceholder='Row item'
              hiPlaceholder='पंक्ति (Hindi)'
            />
            <Button
              type='button'
              variant='ghost'
              size='icon'
              className='mt-0.5 h-8 w-8 text-muted-foreground hover:text-destructive'
              title='Remove row'
              onClick={() => dispatch({ type: 'del-row', qid: q.id, rid: row.id })}
            >
              <X className='h-4 w-4' />
            </Button>
          </div>
        ))}
      </div>
      <Button
        type='button'
        variant='link'
        className='mt-2 h-auto p-0 text-sm'
        onClick={() => dispatch({ type: 'add-row', qid: q.id })}
      >
        Add row
      </Button>
      <div className={cn('mt-4 grid grid-cols-1 gap-2', hi && 'sm:grid-cols-2')}>
        <div>
          <FieldLabel>Rating scale (comma-separated)</FieldLabel>
          <Input
            value={q.scale.en}
            onChange={(e) =>
              dispatch({ type: 'set-scale', qid: q.id, lang: 'en', value: e.target.value })
            }
          />
        </div>
        {hi && (
          <div>
            <FieldLabel>Rating scale (Hindi)</FieldLabel>
            <Input
              value={q.scale.hi}
              onChange={(e) =>
                dispatch({ type: 'set-scale', qid: q.id, lang: 'hi', value: e.target.value })
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}
