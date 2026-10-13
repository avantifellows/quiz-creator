'use client';

import { cn } from '@/lib/utils';
import { tr } from '../lib/model';
import { Lang, PreviewAnswer, PreviewAnswers, Question } from '../lib/types';

/**
 * One question rendered the way a respondent sees it. Shared by the live Preview (interactive:
 * pass `onChoice` + `onAnswer`) and the builder's collapsed question cards (read-only: omit
 * them), so both always look identical.
 */
export function StudentQuestion({
  q,
  lang,
  number,
  answers = {},
  onChoice,
  onAnswer,
}: {
  q: Question;
  lang: Lang;
  number?: number;
  answers?: PreviewAnswers;
  onChoice?: (q: Question, oid: string, checked: boolean) => void;
  onAnswer?: (qid: string, update: (prev: PreviewAnswer | undefined) => PreviewAnswer) => void;
}) {
  const interactive = Boolean(onChoice && onAnswer);
  // Read-only controls must not take focus or clicks: the surrounding card handles the click.
  const controlProps = interactive ? {} : { readOnly: true, tabIndex: -1 };
  const selected = Array.isArray(answers[q.id]) ? (answers[q.id] as string[]) : [];
  const scale = tr(q.scale, lang)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const matrix =
    answers[q.id] && typeof answers[q.id] === 'object' && !Array.isArray(answers[q.id])
      ? (answers[q.id] as Record<string, number>)
      : {};

  return (
    <div className={cn(!interactive && 'pointer-events-none select-none')}>
      <p className='mb-3 text-[15px] font-semibold leading-snug text-foreground'>
        {number != null && <span className='mr-1 font-mono text-muted-foreground'>{number}.</span>}
        {tr(q.text, lang) || (
          <span className='italic text-muted-foreground'>(untitled question)</span>
        )}
        {q.required && (
          <span className='ml-1 font-bold text-destructive' aria-label='Required question'>
            *
          </span>
        )}
      </p>

      {q.type === 'subjective' && (
        <textarea
          rows={2}
          placeholder='Your answer…'
          className='flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:italic placeholder:text-muted-foreground/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
          onChange={(e) => onAnswer?.(q.id, () => e.target.value)}
          {...controlProps}
        />
      )}

      {(q.type === 'single-choice' || q.type === 'multi-choice') && (
        <div className='flex flex-col gap-1.5'>
          {q.options.map((o, i) => (
            <label
              key={o.id}
              className='inline-flex cursor-pointer items-center gap-2.5 rounded-lg border border-border px-3 py-2 text-sm transition-colors hover:bg-muted/50'
            >
              <input
                type={q.type === 'single-choice' ? 'radio' : 'checkbox'}
                name={`pv-${q.id}`}
                className='accent-primary'
                checked={selected.includes(o.id)}
                onChange={(e) => onChoice?.(q, o.id, e.target.checked)}
                {...controlProps}
              />
              <span>{tr(o.text, lang) || `Option ${i + 1}`}</span>
            </label>
          ))}
        </div>
      )}

      {q.type === 'matrix-rating' && (
        <div className='overflow-x-auto'>
          <table className='w-full border-collapse text-sm'>
            <thead>
              <tr>
                <th />
                {scale.map((s, si) => (
                  <th key={si} className='px-2 pb-2 text-center text-xs font-medium'>
                    {s}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {q.rows.map((row) => (
                <tr key={row.id} className='border-t border-border'>
                  <td className='py-2 pr-3'>{tr(row.text, lang) || '(row)'}</td>
                  {scale.map((_, si) => (
                    <td key={si} className='text-center'>
                      <input
                        type='radio'
                        name={`pv-${q.id}-${row.id}`}
                        className='accent-primary'
                        checked={matrix[row.id] === si}
                        onChange={() =>
                          onAnswer?.(q.id, (prev) => {
                            const cur =
                              prev && typeof prev === 'object' && !Array.isArray(prev) ? prev : {};
                            return { ...cur, [row.id]: si };
                          })
                        }
                        {...controlProps}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
