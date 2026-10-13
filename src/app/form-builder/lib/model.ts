/*
 * Form Builder prototype — pure model logic.
 *
 * Everything here is a pure function over the authoring tree (no React, no DOM), so the
 * visibility evaluator and the emit transform are unit-testable in isolation. This mirrors
 * the docs' rule "one visibility evaluator per codebase": `computeVisibility` is the single
 * source of truth the preview reads, and `toQuizPayload` is the single place positions are
 * materialised.
 */

import {
  CHOICE_TYPES,
  Condition,
  DisplayCondition,
  FormState,
  Lang,
  LangText,
  Option,
  PayloadQuestion,
  PreviewAnswers,
  Question,
  QuizPayload,
  Section,
} from './types';

// ---- id generation -------------------------------------------------------
// A monotonic counter gives stable, collision-free keys for React and for condition
// references. Prototype-only; the real builder would use server ids after persistence.
let _uid = 1;
export const nid = (): string => `id${_uid++}`;

// ---- constructors --------------------------------------------------------
export function newOption(en = '', hi = ''): Option {
  return { id: nid(), text: { en, hi } };
}

export function newQuestion(type: Question['type'] = 'single-choice'): Question {
  return {
    id: nid(),
    type,
    text: { en: '', hi: '' },
    options: [newOption(), newOption()],
    rows: [newOption()],
    scale: { en: 'Not at all, Somewhat, A lot', hi: 'बिलकुल नहीं, कुछ हद तक, बहुत' },
    cond: { on: false, src: null, opts: [] },
    // Required by default, matching the sheet flow (every question is mandatory unless the
    // Mandatory column says "No").
    required: true,
  };
}

export function newSection(title = ''): Section {
  return { id: nid(), title, questions: [] };
}

export function emptyForm(): FormState {
  return {
    name: '',
    singlePageHeaderText: '',
    langs: { en: true, hi: false },
    sections: [],
  };
}

// ---- lookups -------------------------------------------------------------
export const allQuestions = (state: FormState): Question[] =>
  state.sections.flatMap((s) => s.questions);

export const questionById = (state: FormState, id: string | null): Question | null =>
  id == null ? null : (allQuestions(state).find((q) => q.id === id) ?? null);

export const sectionOfQuestion = (state: FormState, qid: string): Section | null =>
  state.sections.find((s) => s.questions.some((q) => q.id === qid)) ?? null;

/** Flat 0-based position of each question in document order — the emit-time addressing scheme. */
export function positionIndex(state: FormState): Map<string, number> {
  const map = new Map<string, number>();
  allQuestions(state).forEach((q, i) => map.set(q.id, i));
  return map;
}

/**
 * Earlier choice-type questions that may trigger `qid`. Restricting to *earlier* questions
 * enforces the invariant that triggers precede dependents; restricting to choice types
 * enforces the v1 list-only trigger rule.
 */
export function possibleSources(state: FormState, qid: string): Question[] {
  const flat = allQuestions(state);
  const idx = flat.findIndex((q) => q.id === qid);
  return flat.slice(0, idx < 0 ? 0 : idx).filter((q) => CHOICE_TYPES.includes(q.type));
}

// ---- visibility (THE preview evaluator) ----------------------------------
/**
 * Single forward pass over the document-ordered questions. A question with no live condition
 * is visible; otherwise visible iff its trigger is visible AND the trigger's selected options
 * intersect the condition's options. Transitive because earlier visibility is read when
 * resolving later questions. Mirrors the backend/frontend runtime evaluators in the docs.
 */
export function computeVisibility(
  state: FormState,
  answers: PreviewAnswers
): Record<string, boolean> {
  const vis: Record<string, boolean> = {};
  for (const q of allQuestions(state)) {
    if (!q.cond.on || !q.cond.src) {
      vis[q.id] = true;
      continue;
    }
    const src = questionById(state, q.cond.src);
    if (!src || !vis[src.id]) {
      vis[q.id] = false;
      continue;
    }
    const ans = answers[src.id];
    const selected = Array.isArray(ans) ? ans : [];
    vis[q.id] = q.cond.opts.some((o) => selected.includes(o));
  }
  return vis;
}

/**
 * Plain-language summary of a live condition for the collapsed (student-view) card, e.g.
 * `Shown if "Do you go for offline coaching…" is "Yes"`. Null when the question is not
 * conditional or the condition is incomplete.
 */
export function conditionSummary(state: FormState, q: Question): string | null {
  if (!q.cond.on || !q.cond.src) return null;
  const src = questionById(state, q.cond.src);
  if (!src) return null;
  const chosen = src.options.filter((o) => q.cond.opts.includes(o.id));
  if (chosen.length === 0) return null;
  const srcText = src.text.en.trim() || 'untitled question';
  const short = srcText.length > 48 ? `${srcText.slice(0, 48).trimEnd()}…` : srcText;
  const opts = chosen.map((o, i) => `"${o.text.en.trim() || `Option ${i + 1}`}"`).join(' or ');
  return `Shown if "${short}" is ${opts}`;
}

// ---- language helpers ----------------------------------------------------
/** Translated string for a preview language, falling back to English. */
export function tr(text: LangText, lang: Lang): string {
  return text[lang] && text[lang].trim() ? text[lang] : text.en;
}

/**
 * Combine paired EN/HI into the single stacked string quiz-backend stores today
 * (architecture.md open Q#2: no per-language storage yet, so the builder captures clean
 * pairs but COMBINES them for the payload to match current rendering).
 */
export function combineLang(text: LangText, hiEnabled: boolean): string {
  const en = text.en.trim();
  const hi = text.hi.trim();
  if (hiEnabled && hi) return `${en}\n${hi}`;
  return en;
}

function splitScale(text: LangText, hiEnabled: boolean): string[] {
  const en = text.en
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const hi = text.hi
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  return en.map((label, i) => {
    const h = hiEnabled ? hi[i] : undefined;
    return h ? `${label}\n${h}` : label;
  });
}

// ---- emit (THE positional materialisation) -------------------------------
/**
 * Resolve an authoring condition to the runtime {source_position, option_indices} shape.
 * Returns undefined for non-conditional (or incompletely specified) questions so the field
 * is simply omitted — keeping non-conditional forms byte-identical to today's payload.
 */
function resolveCondition(
  state: FormState,
  cond: Condition,
  positions: Map<string, number>
): DisplayCondition | undefined {
  if (!cond.on || !cond.src) return undefined;
  const src = questionById(state, cond.src);
  if (!src) return undefined;
  const source_position = positions.get(src.id);
  if (source_position == null) return undefined;
  const option_indices = cond.opts
    .map((oid) => src.options.findIndex((o) => o.id === oid))
    .filter((i) => i >= 0);
  if (option_indices.length === 0) return undefined;
  return { source_position, option_indices };
}

/** Transform the authoring tree into the exact POST /quiz payload. No network call. */
export function toQuizPayload(state: FormState): QuizPayload {
  const hiEnabled = state.langs.hi;
  const positions = positionIndex(state);

  const question_sets = state.sections.map((section) => {
    const questions: PayloadQuestion[] = section.questions.map((q) => {
      const base: PayloadQuestion = {
        text: combineLang(q.text, hiEnabled),
        type: q.type,
        options: CHOICE_TYPES.includes(q.type)
          ? q.options.map((o) => ({ text: combineLang(o.text, hiEnabled) }))
          : q.type === 'matrix-rating'
            ? splitScale(q.scale, hiEnabled).map((text) => ({ text }))
            : [],
        graded: false,
        correct_answer: null,
        required: q.required,
      };
      if (q.type === 'matrix-rating') {
        base.matrix_rows = q.rows.map((r) => combineLang(r.text, hiEnabled));
      }
      const dc = resolveCondition(state, q.cond, positions);
      if (dc) base.display_condition = dc;
      return base;
    });
    return {
      title: section.title,
      max_questions_allowed_to_attempt: questions.length,
      questions,
    };
  });

  return {
    title: state.name || 'Untitled form',
    question_sets,
    max_marks: 0,
    num_graded_questions: 0,
    require_all_questions: allQuestions(state).some((q) => q.required),
    metadata: {
      quiz_type: 'form',
      ...(state.singlePageHeaderText.trim()
        ? { single_page_header_text: state.singlePageHeaderText.trim() }
        : {}),
      source: 'quiz-creator-form-builder',
      source_id: null,
    },
  };
}

// ---- emit-time validation ------------------------------------------------
/** Author-facing problems that would make the emitted form incoherent. Non-blocking in the
 *  prototype — surfaced in the emit dialog so the positional contract stays honest. */
export function validate(state: FormState): string[] {
  const problems: string[] = [];
  const positions = positionIndex(state);
  if (allQuestions(state).length === 0) problems.push('The form has no questions yet.');
  for (const q of allQuestions(state)) {
    if (!q.text.en.trim()) problems.push('A question is missing its English text.');
    if (!q.cond.on) continue;
    const src = questionById(state, q.cond.src);
    const label = q.text.en.trim() || '(untitled question)';
    if (!q.cond.src || !src) {
      problems.push(`"${label}" is conditional but has no trigger question selected.`);
      continue;
    }
    const sp = positions.get(src.id)!;
    const dp = positions.get(q.id)!;
    if (sp >= dp) problems.push(`"${label}" has a trigger that is not earlier in the form.`);
    if (!CHOICE_TYPES.includes(src.type))
      problems.push(`"${label}" has a trigger that is not a single/multiple-choice question.`);
    if (q.cond.opts.length === 0)
      problems.push(`"${label}" is conditional but no trigger option is chosen.`);
  }
  return Array.from(new Set(problems));
}

// ---- seed (story-telling example from the handoff) -----------------------
export function seedExample(): FormState {
  const q1 = newQuestion('single-choice');
  q1.text = {
    en: 'Do you have a friend or group of friends who help each other with studying?',
    hi: 'क्या आपके कोई मित्र या मित्रों का समूह है जो पढ़ाई में एक-दूसरे की मदद करते हैं?',
  };
  q1.options = [
    newOption('Yes, I already have this', 'हाँ, मेरे पास यह है'),
    newOption('No, not yet', 'नहीं, अभी नहीं'),
  ];

  const q2 = newQuestion('multi-choice');
  q2.text = {
    en: 'Which of these do you have a friend / group of friends for?',
    hi: 'इनमें से किसके लिए आपके पास मित्र / मित्रों का समूह है?',
  };
  q2.options = [
    newOption('Doubt solving', 'संदेह समाधान'),
    newOption('Revision', 'पुनरावलोकन'),
    newOption('Motivation', 'प्रेरणा'),
  ];
  q2.cond = { on: true, src: q1.id, opts: [q1.options[0].id] };

  const s1 = newSection('Friends Support');
  s1.questions = [q1, q2];

  const q3 = newQuestion('single-choice');
  q3.text = {
    en: 'Do you go for offline coaching classes?',
    hi: 'क्या आप ऑफ़लाइन कोचिंग कक्षाओं में जाते हैं?',
  };
  q3.options = [newOption('Yes', 'हाँ'), newOption('No', 'नहीं')];

  const q4 = newQuestion('single-choice');
  q4.text = {
    en: 'Is travel to coaching a problem for you?',
    hi: 'क्या कोचिंग तक यात्रा करना आपके लिए समस्या है?',
  };
  q4.options = [
    newOption('Yes', 'हाँ'),
    newOption('Sometimes', 'कभी-कभी'),
    newOption('No', 'नहीं'),
  ];
  q4.cond = { on: true, src: q3.id, opts: [q3.options[0].id] };

  const q5 = newQuestion('matrix-rating');
  q5.text = {
    en: 'How often does each of these happen?',
    hi: 'इनमें से प्रत्येक कितनी बार होता है?',
  };
  q5.rows = [
    newOption('You miss class due to travel', 'यात्रा के कारण कक्षा छूट जाती है'),
    newOption('You reach late', 'आप देर से पहुँचते हैं'),
  ];
  q5.cond = { on: true, src: q3.id, opts: [q3.options[0].id] };
  q5.required = false;

  const s2 = newSection('Coaching');
  s2.questions = [q3, q4, q5];

  return {
    name: 'Grade 12 Mentorship Screener',
    singlePageHeaderText: 'Please answer honestly — this helps us match you with the right mentor.',
    langs: { en: true, hi: true },
    sections: [s1, s2],
  };
}
