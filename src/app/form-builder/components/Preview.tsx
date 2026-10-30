'use client';

import { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import {
  OTHER_MAX_CHARS,
  combineLang,
  computeVisibility,
  isOtherOption,
  otherTextKey,
  questionLabels,
  splitScale,
} from '../lib/model';
import { CHOICE_TYPES, FormState, PreviewAnswer, PreviewAnswers, Question } from '../lib/types';

/*
 * How the questions look to a student: a visual copy of quiz-frontend's single-page form view
 * (SinglePageModal / SinglePageItem), using its classes and colours rather than this app's
 * theme. Deliberately NOT a quiz: no submit, start screen or section paging — only the
 * questions, with conditional ones appearing as trigger answers change.
 */

const STUDENT_FONT = 'font-[Avenir,Helvetica,Arial,sans-serif]';
const ORANGE = '#F78000';
const TEXTAREA =
  'w-full rounded border border-gray-200 bg-white p-2 px-4 placeholder-gray-400 focus:border-gray-200 focus:outline-none focus:ring focus:ring-[#F78000] sm:h-20';

/**
 * Live preview. Owns ephemeral respondent answers (NOT part of the authored form) and
 * re-derives visibility from them on every change, as quiz-frontend does. Questions are only
 * ever hidden, never reordered: the positional invariant holds exactly as at runtime.
 */
export function Preview({ state }: { state: FormState }) {
  const [answers, setAnswers] = useState<PreviewAnswers>({});
  const visibility = useMemo(() => computeVisibility(state, answers), [state, answers]);
  const labels = useMemo(() => questionLabels(state), [state]);
  // Students see English and Hindi stacked, exactly as the form is emitted today.
  const text = (t: { en: string; hi: string }) => combineLang(t, state.langs.hi);

  function setChoice(q: Question, oid: string, checked: boolean) {
    setAnswers((prev) => {
      const cur = Array.isArray(prev[q.id]) ? (prev[q.id] as string[]) : [];
      const next =
        q.type === 'multi-choice'
          ? checked
            ? [...cur, oid]
            : cur.filter((x) => x !== oid)
          : [oid];
      const updated = { ...prev, [q.id]: next };
      // Moving off "Other" clears its text, as in the student app.
      if (!isOtherOption(q, oid)) delete updated[otherTextKey(q.id)];
      return updated;
    });
  }
  const setAnswer = (key: string, update: (prev: PreviewAnswer | undefined) => PreviewAnswer) =>
    setAnswers((prev) => ({ ...prev, [key]: update(prev[key]) }));

  return (
    <div className={cn('overflow-hidden rounded-lg border bg-indigo-50 text-black', STUDENT_FONT)}>
      {/* InfoBar */}
      <div className='flex items-center justify-between gap-4 border-b border-gray-300 bg-gray-200 px-4 py-3'>
        <p className='flex-1 break-words text-lg font-semibold text-gray-800'>
          {state.name || 'Untitled form'}
        </p>
        <span className='whitespace-nowrap rounded bg-gray-300 px-4 py-2 text-base font-semibold text-gray-700'>
          Id: student
        </span>
      </div>

      <div className='flex w-full justify-center px-4 py-4'>
        <div className='flex w-full max-w-4xl flex-col rounded-lg bg-white p-2 shadow-sm sm:p-6'>
          {state.header.trim() && (
            <p className='mx-4 mb-4 mt-2 whitespace-pre-wrap text-lg sm:text-xl'>
              {state.header.trim()}
            </p>
          )}

          {state.sections.map((section) => (
            <div key={section.id} className='space-y-2 pb-10'>
              {section.title.trim() && (
                <div className='bg-gray-300'>
                  <p className='mx-4 whitespace-pre-wrap py-2 text-lg font-medium leading-tight sm:text-xl'>
                    {section.title}
                  </p>
                </div>
              )}
              <div className='mt-4 space-y-4'>
                {section.questions
                  .filter((q) => visibility[q.id])
                  .map((q) => (
                    <StudentItem
                      key={q.id}
                      q={q}
                      label={labels[q.id]}
                      text={text}
                      hiEnabled={state.langs.hi}
                      answers={answers}
                      onChoice={setChoice}
                      onAnswer={setAnswer}
                    />
                  ))}
              </div>
            </div>
          ))}
          {state.sections.length === 0 && (
            <p className='mx-4 py-6 text-gray-400'>Nothing to preview yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

/** quiz-frontend lays options side by side when they are short (SinglePageItem). */
function isHorizontal(q: Question, labels: string[]): boolean {
  if (q.type === 'single-choice-other' || labels.length > 5 || labels.length === 0) return false;
  const total = labels.reduce((n, l) => n + l.length, 0);
  return total / labels.length < 20 && total < 100;
}

function StudentItem({
  q,
  label,
  text,
  hiEnabled,
  answers,
  onChoice,
  onAnswer,
}: {
  q: Question;
  label: string;
  text: (t: { en: string; hi: string }) => string;
  hiEnabled: boolean;
  answers: PreviewAnswers;
  onChoice: (q: Question, oid: string, checked: boolean) => void;
  onAnswer: (key: string, update: (prev: PreviewAnswer | undefined) => PreviewAnswer) => void;
}) {
  const selected = Array.isArray(answers[q.id]) ? (answers[q.id] as string[]) : [];
  const typed = typeof answers[q.id] === 'string' ? (answers[q.id] as string) : '';
  const otherKey = otherTextKey(q.id);
  const otherText = typeof answers[otherKey] === 'string' ? (answers[otherKey] as string) : '';
  const otherOption =
    q.type === 'single-choice-other' ? q.options[q.options.length - 1] : undefined;
  const optionLabels = q.options.map((o, i) => text(o.text) || `Option ${i + 1}`);

  return (
    <div className='mx-auto my-4 flex w-full max-w-4xl flex-col border-b border-gray-200 bg-white p-6 shadow-sm md:rounded-lg md:border'>
      <p className='mb-2 text-lg font-bold md:text-xl'>Q.{label}: </p>
      <p className='mb-2 whitespace-pre-wrap text-base leading-relaxed md:text-lg'>
        {text(q.text) || <span className='italic text-gray-400'>(untitled question)</span>}
        {q.required && <span className='ml-1 font-bold text-red-600'>*</span>}
      </p>

      <div className='mx-2 flex py-4 md:mx-10'>
        {CHOICE_TYPES.includes(q.type) && (
          <div className='w-full'>
            <div
              className={cn(
                isHorizontal(q, optionLabels)
                  ? 'flex flex-row flex-wrap gap-3'
                  : 'flex flex-col space-y-2'
              )}
            >
              {q.options.map((o, i) => (
                <div
                  key={o.id}
                  className='mx-2 shrink-0 whitespace-pre-wrap rounded-md border border-gray-300 p-2 text-lg md:text-xl lg:text-2xl'
                >
                  <label className='flex cursor-pointer content-center'>
                    <input
                      type={q.type === 'multi-choice' ? 'checkbox' : 'radio'}
                      name={`sp-${q.id}`}
                      style={{ accentColor: ORANGE, boxShadow: 'none' }}
                      checked={selected.includes(o.id)}
                      onChange={(e) => onChoice(q, o.id, e.target.checked)}
                    />
                    <div className='ml-2 h-full place-self-center text-base sm:text-lg'>
                      {optionLabels[i]}
                    </div>
                  </label>
                </div>
              ))}
            </div>
            {otherOption && selected.includes(otherOption.id) && (
              <textarea
                className={cn(TEXTAREA, 'mt-2', otherText && 'bg-gray-100')}
                placeholder='Please specify'
                maxLength={OTHER_MAX_CHARS}
                value={otherText}
                onChange={(e) => onAnswer(otherKey, () => e.target.value)}
              />
            )}
          </div>
        )}

        {q.type === 'subjective' && (
          <textarea
            className={cn(TEXTAREA, 'mt-1', typed && 'bg-gray-100')}
            placeholder='Enter your answer here'
            value={typed}
            onChange={(e) => onAnswer(q.id, () => e.target.value)}
          />
        )}

        {q.type === 'matrix-rating' && (
          <MatrixTable
            q={q}
            text={text}
            hiEnabled={hiEnabled}
            answers={answers}
            onAnswer={onAnswer}
          />
        )}
      </div>
    </div>
  );
}

function MatrixTable({
  q,
  text,
  hiEnabled,
  answers,
  onAnswer,
}: {
  q: Question;
  text: (t: { en: string; hi: string }) => string;
  hiEnabled: boolean;
  answers: PreviewAnswers;
  onAnswer: (key: string, update: (prev: PreviewAnswer | undefined) => PreviewAnswer) => void;
}) {
  const scale = splitScale(q.scale, hiEnabled);
  const chosen =
    answers[q.id] && typeof answers[q.id] === 'object' && !Array.isArray(answers[q.id])
      ? (answers[q.id] as Record<string, number>)
      : {};
  return (
    <div className='w-full max-w-screen-md'>
      <table className='w-full table-fixed border-collapse border border-gray-200'>
        <thead>
          <tr>
            <th className='border border-gray-200 bg-gray-50 p-2' />
            {scale.map((s, si) => (
              <th
                key={si}
                className='whitespace-pre-wrap border border-gray-200 bg-gray-50 p-2 text-center text-sm'
              >
                {s}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {q.rows.map((row) => (
            <tr key={row.id}>
              <td className='whitespace-pre-wrap border border-gray-200 p-2 font-medium'>
                {text(row.text) || '(row)'}
              </td>
              {scale.map((_, si) => {
                const on = chosen[row.id] === si;
                return (
                  <td
                    key={si}
                    className='cursor-pointer border border-gray-200 p-2'
                    onClick={() =>
                      onAnswer(q.id, (prev) => {
                        const cur =
                          prev && typeof prev === 'object' && !Array.isArray(prev) ? prev : {};
                        return { ...cur, [row.id]: si };
                      })
                    }
                  >
                    <span
                      className={cn(
                        'mx-auto flex h-4 w-4 items-center justify-center rounded-full border',
                        on ? 'border-[#F78000]' : 'border-gray-400'
                      )}
                    >
                      {on && <span className='h-2 w-2 rounded-full bg-[#F78000]' />}
                    </span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
