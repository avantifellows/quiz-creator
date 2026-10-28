/*
 * The stored form (quiz-backend `form_definitions`, docs/form-builder) and the mapping to and
 * from the builder's editing state. The builder keeps a few editing-only details the stored
 * form doesn't need (a condition switched on but not yet pointed at a question; option /
 * scale fields of question types that don't use them), so the mapping drops those.
 */

import { newQuestion, nid } from './model';
import {
  CHOICE_TYPES,
  FormState,
  LangText,
  Option,
  Question,
  QuestionType,
  Section,
} from './types';

export type DefinitionLanguage = 'en' | 'hi';

export interface DefinitionOption {
  id: string;
  text: LangText;
}

export interface DefinitionQuestion {
  id: string;
  type: QuestionType;
  text: LangText;
  required: boolean;
  options: DefinitionOption[];
  rows: DefinitionOption[];
  scale: LangText | null;
  show_if: { question_id: string; option_ids: string[] } | null;
}

export interface DefinitionSection {
  id: string;
  title: string;
  questions: DefinitionQuestion[];
}

/** What the builder saves (create / save request body, minus `actor`). */
export interface FormDefinitionContent {
  title: string;
  languages: DefinitionLanguage[];
  /** Shown at the top of the form; empty = none (decision D23). */
  header_text: LangText;
  sections: DefinitionSection[];
}

/** A stored form as quiz-backend returns it (dates are ISO strings). */
export interface FormDefinition extends FormDefinitionContent {
  _id: string;
  locked_at: string | null;
  question_count: number;
  conditional_count: number;
  /** A session can be created from it (nothing left to fill in). */
  ready: boolean;
  created_by: string | null;
  created_at: string;
  updated_by: string | null;
  updated_at: string;
}

/** One row of the Forms list (everything but the sections). */
export type FormSummary = Omit<FormDefinition, 'sections'>;

/** A session that uses a form: the quiz built for it (its title is the session name). */
export interface FormSession {
  quiz_id: string;
  title: string | null;
  created_at: string | null;
}

const copyText = (t: LangText): LangText => ({ en: t.en, hi: t.hi });
const copyOption = (o: Option): DefinitionOption => ({ id: o.id, text: copyText(o.text) });

export function toDefinition(state: FormState): FormDefinitionContent {
  return {
    title: state.name.trim(),
    languages: state.langs.hi ? ['en', 'hi'] : ['en'],
    header_text: copyText(state.header),
    sections: state.sections.map((section) => ({
      id: section.id,
      title: section.title,
      questions: section.questions.map((q) => ({
        id: q.id,
        type: q.type,
        text: copyText(q.text),
        required: q.required,
        options: CHOICE_TYPES.includes(q.type) ? q.options.map(copyOption) : [],
        rows: q.type === 'matrix-rating' ? q.rows.map(copyOption) : [],
        scale: q.type === 'matrix-rating' ? copyText(q.scale) : null,
        show_if:
          q.cond.on && q.cond.src
            ? { question_id: q.cond.src, option_ids: [...q.cond.opts] }
            : null,
      })),
    })),
  };
}

export function fromDefinition(definition: FormDefinitionContent): FormState {
  // Fields a question type doesn't store get a new question's defaults (fresh ids per
  // question), so switching the type while editing behaves as it does for a new question.
  const toQuestion = (q: DefinitionQuestion): Question => {
    const defaults = newQuestion(q.type);
    return {
      id: q.id,
      type: q.type,
      text: copyText(q.text),
      required: q.required,
      options: q.options.length ? q.options.map(copyOption) : defaults.options,
      rows: q.rows.length ? q.rows.map(copyOption) : defaults.rows,
      scale: q.scale ? copyText(q.scale) : defaults.scale,
      cond: q.show_if
        ? { on: true, src: q.show_if.question_id, opts: [...q.show_if.option_ids] }
        : { on: false, src: null, opts: [] },
    };
  };
  return {
    name: definition.title,
    // forms saved before the header was part of the form have none
    header: definition.header_text ? copyText(definition.header_text) : { en: '', hi: '' },
    langs: { en: true, hi: definition.languages.includes('hi') },
    sections: definition.sections.map(
      (s): Section => ({ id: s.id, title: s.title, questions: s.questions.map(toQuestion) })
    ),
  };
}

/**
 * A copy to edit as a NEW form (decision D20: Duplicate is a frontend action; it is stored
 * only when the author saves). Every id is fresh — the copy's questions are new questions —
 * and conditions are re-pointed at the copied questions/options.
 */
export function duplicateForm(state: FormState): FormState {
  const ids = new Map<string, string>();
  const fresh = (id: string) => {
    if (!ids.has(id)) ids.set(id, nid());
    return ids.get(id)!;
  };
  const copy: FormState = structuredClone(state);
  copy.name = state.name.trim() ? `${state.name.trim()} (copy)` : '';
  for (const section of copy.sections) {
    section.id = fresh(section.id);
    for (const q of section.questions) {
      q.id = fresh(q.id);
      q.options.forEach((o) => (o.id = fresh(o.id)));
      q.rows.forEach((r) => (r.id = fresh(r.id)));
    }
  }
  for (const q of copy.sections.flatMap((s) => s.questions)) {
    if (q.cond.src) q.cond.src = fresh(q.cond.src);
    q.cond.opts = q.cond.opts.map(fresh);
  }
  return copy;
}

/** A form session's `meta_data.cms_test_id` for a form-builder form (sessionCreator reads it). */
export const FORM_BUILDER_PREFIX = 'form-builder:';

export const formBuilderMarker = (formId: string) => `${FORM_BUILDER_PREFIX}${formId}`;

/** The form id in a form-builder `cms_test_id`, or null for a sheet / CMS link. */
export function formIdFromMarker(cmsTestId: string | undefined | null): string | null {
  const value = (cmsTestId ?? '').trim();
  return value.startsWith(FORM_BUILDER_PREFIX)
    ? value.slice(FORM_BUILDER_PREFIX.length).trim() || null
    : null;
}
