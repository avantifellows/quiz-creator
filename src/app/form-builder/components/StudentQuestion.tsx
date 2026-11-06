'use client';

import { tr } from '../lib/model';
import { CHOICE_TYPES, Lang, Question } from '../lib/types';

/**
 * Light, read-only rendering of a question for the builder's collapsed cards: the question,
 * its options as plain rows and a rating grid. The student-look preview is `Preview`.
 */
export function StudentQuestion({ q, lang }: { q: Question; lang: Lang }) {
  const scale = tr(q.scale, lang)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <div className='pointer-events-none select-none'>
      <p className='mb-3 text-[15px] font-semibold leading-snug text-foreground'>
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
        <div className='h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm italic text-muted-foreground/80'>
          Your answer…
        </div>
      )}

      {CHOICE_TYPES.includes(q.type) && (
        <div className='flex flex-col gap-1'>
          {q.options.map((o, i) => (
            <label key={o.id} className='inline-flex items-center gap-2.5 py-0.5 text-sm'>
              <input
                type={q.type === 'multi-choice' ? 'checkbox' : 'radio'}
                className='accent-primary'
                readOnly
                tabIndex={-1}
                checked={false}
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
                        className='accent-primary'
                        readOnly
                        tabIndex={-1}
                        checked={false}
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
