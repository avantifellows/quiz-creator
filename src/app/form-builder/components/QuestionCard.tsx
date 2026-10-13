'use client';

import { Dispatch, useEffect, useRef } from 'react';
import { CornerDownRight, Keyboard, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { conditionSummary, possibleSources, questionById } from '../lib/model';
import type { Action } from '../lib/reducer';
import { CHOICE_TYPES, FormState, Question, QuestionType } from '../lib/types';
import { FieldLabel, PairedInput } from './fields';
import { StudentQuestion } from './StudentQuestion';

const QUESTION_TYPES: { value: QuestionType; label: string }[] = [
  { value: 'single-choice', label: 'Single choice' },
  { value: 'multi-choice', label: 'Multiple choice' },
  { value: 'subjective', label: 'Subjective (free text)' },
  { value: 'matrix-rating', label: 'Matrix rating' },
];

interface Props {
  state: FormState;
  q: Question;
  index: number;
  dispatch: Dispatch<Action>;
  /** Only the active question shows the editor; every other one renders as the student sees it. */
  active: boolean;
  onActivate: () => void;
}

export function QuestionCard({ state, q, index, dispatch, active, onActivate }: Props) {
  const hi = state.langs.hi;
  const isChoice = CHOICE_TYPES.includes(q.type);
  const ref = useRef<HTMLDivElement>(null);

  // Opening a card above the viewport (or adding one at the bottom) can push the editor
  // off-screen as the layout changes height; bring it back into view.
  useEffect(() => {
    if (active) ref.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [active]);

  if (!active) {
    return <CollapsedQuestion state={state} q={q} index={index} onActivate={onActivate} />;
  }

  return (
    <div
      ref={ref}
      className='mb-4 rounded-lg border border-border border-l-4 border-l-primary bg-background p-5 shadow-md'
    >
      {/* header */}
      <div className='mb-4 flex items-center justify-between'>
        <span className='flex items-center gap-2'>
          <span className='inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary font-mono text-xs font-bold text-primary-foreground'>
            {index + 1}
          </span>
          <span className='text-xs font-bold uppercase tracking-wide text-muted-foreground'>
            Question
          </span>
          {q.cond.on && (
            <span className='rounded-full bg-accent px-2 py-0.5 text-[11px] font-semibold text-accent-foreground'>
              conditional
            </span>
          )}
        </span>
        <span className='flex items-center gap-3'>
          <label
            className='flex cursor-pointer items-center gap-2'
            title={
              q.cond.on
                ? 'Conditional: only required while the question is shown'
                : 'Respondent must answer this question before submitting'
            }
          >
            <span className='text-sm text-foreground'>Required</span>
            <Switch
              checked={q.required}
              onCheckedChange={(v) => dispatch({ type: 'set-required', qid: q.id, value: v })}
            />
          </label>
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
        </span>
      </div>

      {/* question text */}
      <FieldLabel>Question text{hi && ' (English + Hindi)'}</FieldLabel>
      <PairedInput
        text={q.text}
        hiEnabled={hi}
        onChange={(lang, value) => dispatch({ type: 'set-qtext', qid: q.id, lang, value })}
        enPlaceholder='Type the question in English'
        hiPlaceholder='हिन्दी में प्रश्न लिखें'
      />

      {/* answer type */}
      <div className='mt-4 max-w-xs'>
        <FieldLabel>Answer type</FieldLabel>
        <Select
          value={q.type}
          onValueChange={(value) =>
            dispatch({ type: 'set-qtype', qid: q.id, value: value as QuestionType })
          }
        >
          <SelectTrigger>
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

      {/* type-specific editors */}
      {isChoice && <OptionsEditor q={q} hi={hi} dispatch={dispatch} />}
      {q.type === 'matrix-rating' && <MatrixEditor q={q} hi={hi} dispatch={dispatch} />}
      {q.type === 'subjective' && (
        <p className='mt-3 flex items-center gap-2 text-sm italic text-muted-foreground'>
          <Keyboard className='h-4 w-4' /> Respondent types a free-text answer.
        </p>
      )}

      <ConditionEditor state={state} q={q} dispatch={dispatch} />
    </div>
  );
}

/** Read-only student view of a question; clicking (or Enter/Space) opens it for editing. */
function CollapsedQuestion({
  state,
  q,
  index,
  onActivate,
}: {
  state: FormState;
  q: Question;
  index: number;
  onActivate: () => void;
}) {
  const summary = conditionSummary(state, q);
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
      <StudentQuestion q={q} lang='en' />
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
  return (
    <div className='mt-4'>
      <FieldLabel>Options</FieldLabel>
      <div className='mt-1'>
        {q.options.map((opt, i) => (
          <div key={opt.id} className='mb-2.5 flex items-start gap-3'>
            <span className='mt-3 w-5 shrink-0 text-right font-mono text-xs text-muted-foreground'>
              {i + 1}.
            </span>
            <PairedInput
              className='flex-1'
              text={opt.text}
              hiEnabled={hi}
              onChange={(lang, value) =>
                dispatch({ type: 'set-option', qid: q.id, oid: opt.id, lang, value })
              }
              enPlaceholder='Option (English)'
              hiPlaceholder='विकल्प (Hindi)'
            />
            <Button
              type='button'
              variant='ghost'
              size='icon'
              className='mt-1 h-8 w-8 text-muted-foreground hover:text-destructive'
              title='Remove option'
              onClick={() => dispatch({ type: 'del-option', qid: q.id, oid: opt.id })}
            >
              <X className='h-4 w-4' />
            </Button>
          </div>
        ))}
      </div>
      <div className='mt-3 flex flex-wrap items-center gap-x-5 gap-y-1'>
        <Button
          type='button'
          variant='link'
          className='h-auto p-0 text-sm'
          onClick={() => dispatch({ type: 'add-option', qid: q.id })}
        >
          + Add option
        </Button>
        <Button
          type='button'
          variant='link'
          className='h-auto p-0 text-sm'
          title='Adds a subjective follow-up shown only when a chosen option is selected'
          onClick={() => dispatch({ type: 'add-justify', qid: q.id })}
        >
          + Add “please justify” follow-up
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
    <div className='mt-3'>
      <FieldLabel>Rows to rate</FieldLabel>
      {q.rows.map((row) => (
        <div key={row.id} className='mb-2 flex items-start gap-2'>
          <PairedInput
            className='flex-1'
            text={row.text}
            hiEnabled={hi}
            onChange={(lang, value) =>
              dispatch({ type: 'set-row', qid: q.id, rid: row.id, lang, value })
            }
            enPlaceholder='Row item (English)'
            hiPlaceholder='पंक्ति (Hindi)'
          />
          <Button
            type='button'
            variant='ghost'
            size='icon'
            className='mt-1 h-8 w-8 text-muted-foreground hover:text-destructive'
            title='Remove row'
            onClick={() => dispatch({ type: 'del-row', qid: q.id, rid: row.id })}
          >
            <X className='h-4 w-4' />
          </Button>
        </div>
      ))}
      <Button
        type='button'
        variant='link'
        className='h-auto p-0 text-sm'
        onClick={() => dispatch({ type: 'add-row', qid: q.id })}
      >
        + Add row
      </Button>
      <div className={`mt-3 grid grid-cols-1 gap-2 ${hi ? 'sm:grid-cols-2' : ''}`}>
        <div>
          <FieldLabel>Rating scale, comma-separated (English)</FieldLabel>
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

function ConditionEditor({
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
    <div className='mt-4 rounded-lg border border-border bg-muted/40 p-4'>
      <label className='inline-flex cursor-pointer items-center gap-2'>
        <Checkbox
          checked={q.cond.on}
          onCheckedChange={(v) => dispatch({ type: 'cond-toggle', qid: q.id, value: v === true })}
        />
        <span className='text-xs font-bold uppercase tracking-wide text-muted-foreground'>
          Show only if… (conditional)
        </span>
      </label>

      {q.cond.on &&
        (sources.length === 0 ? (
          <p className='mt-2 text-sm text-destructive'>
            Add a single/multiple-choice question <em>before</em> this one to use as the trigger.
          </p>
        ) : (
          <>
            <div className='mt-2'>
              <FieldLabel>Trigger question</FieldLabel>
              <Select
                value={q.cond.src ?? ''}
                onValueChange={(value) => dispatch({ type: 'cond-src', qid: q.id, src: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select a question…' />
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
            </div>

            {src && (
              <div className='mt-2'>
                <FieldLabel>…when one of these options is chosen</FieldLabel>
                <div className='flex flex-col gap-1'>
                  {src.options.map((o, i) => (
                    <label
                      key={o.id}
                      className='inline-flex cursor-pointer items-center gap-2 text-sm'
                    >
                      <Checkbox
                        checked={q.cond.opts.includes(o.id)}
                        onCheckedChange={(v) =>
                          dispatch({
                            type: 'cond-opt',
                            qid: q.id,
                            oid: o.id,
                            checked: v === true,
                          })
                        }
                      />
                      <span>{o.text.en || `Option ${i + 1}`}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </>
        ))}
    </div>
  );
}
