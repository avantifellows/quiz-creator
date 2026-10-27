'use client';

import { Dispatch } from 'react';
import { Layers, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { nestingDepths, newQuestion } from '../lib/model';
import type { Action } from '../lib/reducer';
import { FormState, Section } from '../lib/types';
import { QuestionCard } from './QuestionCard';

/** Deeper chains still render, just without further indentation. */
const MAX_INDENT = 3;

export function SectionCard({
  state,
  section,
  sIndex,
  dispatch,
  activeId,
  onActivate,
}: {
  state: FormState;
  section: Section;
  sIndex: number;
  dispatch: Dispatch<Action>;
  activeId: string | null;
  onActivate: (qid: string) => void;
}) {
  const depths = nestingDepths(section);

  function addQuestion() {
    const question = newQuestion('single-choice');
    dispatch({ type: 'add-question', sid: section.id, question });
    onActivate(question.id);
  }

  return (
    <div className='mb-6 rounded-xl border border-border bg-card p-5 shadow-sm'>
      <div className='mb-5 flex items-center gap-3 border-b-2 border-primary/30 pb-3'>
        <span className='inline-flex shrink-0 items-center gap-2 text-xs font-bold uppercase tracking-wide text-primary'>
          <Layers className='h-4 w-4' /> Section {sIndex + 1}
        </span>
        <Input
          className='font-bold'
          value={section.title}
          onChange={(e) =>
            dispatch({ type: 'set-section-title', sid: section.id, value: e.target.value })
          }
          placeholder='Section / theme title (e.g. Friends Support)'
        />
        <Button
          type='button'
          variant='ghost'
          size='icon'
          className='h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive'
          title='Remove section'
          onClick={() => dispatch({ type: 'del-section', sid: section.id })}
        >
          <Trash2 className='h-4 w-4' />
        </Button>
      </div>

      {section.questions.map((q, i) => {
        // Follow-ups sit indented under their trigger with a guide line (display only).
        const depth = Math.min(depths[q.id] ?? 0, MAX_INDENT);
        return (
          <div
            key={q.id}
            className={cn(depth > 0 && 'border-l-2 border-primary/25 pl-4')}
            style={depth > 0 ? { marginLeft: `${(depth - 1) * 1.25 + 0.75}rem` } : undefined}
          >
            <QuestionCard
              state={state}
              q={q}
              index={i}
              dispatch={dispatch}
              active={q.id === activeId}
              onActivate={() => onActivate(q.id)}
              openQuestion={onActivate}
              nested={depth > 0}
            />
          </div>
        );
      })}

      <Button type='button' variant='secondary' size='sm' className='mt-1' onClick={addQuestion}>
        + Add Question
      </Button>
    </div>
  );
}
