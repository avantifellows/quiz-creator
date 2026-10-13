'use client';

import { useMemo, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { computeVisibility, tr } from '../lib/model';
import { FormState, Lang, PreviewAnswers, Question } from '../lib/types';
import { StudentQuestion } from './StudentQuestion';

/**
 * Live preview. Owns ephemeral respondent answers (NOT part of the authored form) and
 * re-derives visibility from them on every change — the same reactive pattern the real
 * quiz-frontend uses so resume works for free. Questions are only ever hidden, never
 * reordered: the positional invariant holds in the preview exactly as at runtime.
 */
export function Preview({ state }: { state: FormState }) {
  const [answers, setAnswers] = useState<PreviewAnswers>({});
  const [lang, setLang] = useState<Lang>('en');

  const effectiveLang: Lang = state.langs.hi ? lang : 'en';
  const visibility = useMemo(() => computeVisibility(state, answers), [state, answers]);

  function setChoice(q: Question, oid: string, checked: boolean) {
    setAnswers((prev) => {
      const cur = Array.isArray(prev[q.id]) ? (prev[q.id] as string[]) : [];
      const next =
        q.type === 'single-choice' ? [oid] : checked ? [...cur, oid] : cur.filter((x) => x !== oid);
      return { ...prev, [q.id]: next };
    });
  }

  let number = 0;
  let anyVisible = false;

  return (
    <div className='rounded-xl border border-border bg-card p-6 shadow-sm'>
      <div className='mb-5 flex items-center justify-between border-b border-border pb-3'>
        <h3 className='text-xl font-bold text-foreground'>{state.name || 'Untitled form'}</h3>
        {state.langs.hi && (
          <div className='flex gap-1'>
            {(['en', 'hi'] as Lang[]).map((l) => (
              <button
                key={l}
                type='button'
                onClick={() => setLang(l)}
                className={cn(
                  'min-h-[28px] rounded-md border px-2 text-xs font-bold transition-colors',
                  lang === l
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-background text-muted-foreground'
                )}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        )}
      </div>

      {state.singlePageHeaderText.trim() && (
        <p className='mb-5 rounded-md bg-muted/50 p-3 text-sm text-muted-foreground'>
          {state.singlePageHeaderText}
        </p>
      )}

      {state.sections.map((section) => {
        const visibleQs = section.questions.filter((q) => visibility[q.id]);
        if (visibleQs.length === 0) return null;
        anyVisible = true;
        return (
          <div key={section.id} className='mb-7'>
            <p className='mb-4 text-xs font-bold uppercase tracking-wide text-primary'>
              {section.title || 'Section'}
            </p>
            {visibleQs.map((q) => {
              number += 1;
              return (
                <div key={q.id} className='mb-6'>
                  <StudentQuestion
                    q={q}
                    number={number}
                    lang={effectiveLang}
                    answers={answers}
                    onChoice={setChoice}
                    onAnswer={(qid, update) =>
                      setAnswers((prev) => ({ ...prev, [qid]: update(prev[qid]) }))
                    }
                  />
                </div>
              );
            })}
          </div>
        );
      })}

      {!anyVisible && <p className='text-sm text-muted-foreground'>Nothing to preview yet.</p>}

      <p className='mt-2 flex items-center gap-2 border-t border-border pt-3 text-xs text-muted-foreground'>
        <Sparkles className='h-3.5 w-3.5' /> Pick trigger options to watch conditional questions
        appear and disappear.
      </p>
    </div>
  );
}
