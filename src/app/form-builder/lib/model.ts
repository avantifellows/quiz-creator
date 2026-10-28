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
// Ids are stored in the saved form (conditions point at them) and a loaded form keeps its
// ids, so new ones must never collide with ids from an earlier session: random, not a
// counter that restarts at 1 on every page load.
export const nid = (): string =>
  Date.now().toString(36).slice(-4) + Math.random().toString(36).slice(2, 10);

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
    langs: { en: true, hi: false },
    sections: [],
  };
}

/** What "Create form" starts from: one untitled section holding one empty question. */
export function newForm(): FormState {
  const section = newSection('');
  section.questions = [newQuestion()];
  return { ...emptyForm(), sections: [section] };
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
export function conditionSummary(
  state: FormState,
  q: Question,
  /** `nested`: the card sits right under its trigger, so naming the trigger is redundant. */
  { nested = false }: { nested?: boolean } = {}
): string | null {
  if (!q.cond.on || !q.cond.src) return null;
  const src = questionById(state, q.cond.src);
  if (!src) return null;
  const chosen = src.options.filter((o) => q.cond.opts.includes(o.id));
  if (chosen.length === 0) return null;
  const opts = chosen.map((o, i) => `"${o.text.en.trim() || `Option ${i + 1}`}"`).join(' or ');
  if (nested) return `If ${opts}`;
  const srcText = src.text.en.trim() || 'untitled question';
  const short = srcText.length > 48 ? `${srcText.slice(0, 48).trimEnd()}…` : srcText;
  return `Shown if "${short}" is ${opts}`;
}

// ---- follow-ups, nesting, duplication -------------------------------------
/**
 * An empty free-text question conditioned on `trigger`. With no `oids` the condition is left
 * for the author to finish (they pick the revealing option(s) in the new question's editor);
 * preselecting one would silently produce a wrong rule if they forgot to change it.
 */
export function newFollowUp(trigger: Question, oids: string[] = []): Question {
  const q = newQuestion('subjective');
  q.cond = { on: true, src: trigger.id, opts: [...oids] };
  return q;
}

// ---- single-choice-other ---------------------------------------------------
/** Fixed label of the "Other" option; the sheet flow (sessionCreator) uses the same text. */
export const OTHER_OPTION_TEXT: LangText = { en: 'Other', hi: 'अन्य' };
/** Limit on the "Other" text, matching sessionCreator. */
export const OTHER_MAX_CHARS = 500;

/** True for the fixed "Other" option: the last option of a `single-choice-other` question. */
export const isOtherOption = (q: Question, oid: string): boolean =>
  q.type === 'single-choice-other' &&
  q.options.length > 0 &&
  q.options[q.options.length - 1].id === oid;

/** Preview-answer key holding the text typed for a question's "Other" option. */
export const otherTextKey = (qid: string): string => `${qid}::other`;

/**
 * Display-only indentation depth per question within one section. A conditional question is
 * nested one level under its trigger when the trigger is earlier in the same section and every
 * question in between is itself nested under that trigger — i.e. the follow-ups form one
 * contiguous block right below it. Anything else stays at depth 0 (its "Shown if" chip still
 * names the trigger). Never affects positions: the payload is built from document order.
 */
export function nestingDepths(section: Section): Record<string, number> {
  const qs = section.questions;
  const depths: number[] = [];
  qs.forEach((q, i) => {
    let d = 0;
    if (q.cond.on && q.cond.src) {
      const t = qs.findIndex((x) => x.id === q.cond.src);
      if (t >= 0 && t < i && depths.slice(t + 1, i).every((x) => x > depths[t])) d = depths[t] + 1;
    }
    depths.push(d);
  });
  return Object.fromEntries(qs.map((q, i) => [q.id, depths[i]]));
}

/** Where a new follow-up of `triggerId` goes: after the trigger's existing nested block. */
export function followUpInsertIndex(section: Section, triggerId: string): number {
  const qs = section.questions;
  const t = qs.findIndex((q) => q.id === triggerId);
  if (t < 0) return qs.length;
  const depth = nestingDepths(section);
  let j = t + 1;
  while (j < qs.length && depth[qs[j].id] > depth[triggerId]) j++;
  return j;
}

/** Deep copy with fresh ids. The copy keeps the original's condition (same trigger/options). */
export function cloneQuestion(q: Question): Question {
  const copy: Question = structuredClone(q);
  copy.id = nid();
  copy.options = copy.options.map((o) => ({ ...o, id: nid() }));
  copy.rows = copy.rows.map((r) => ({ ...r, id: nid() }));
  return copy;
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

export function splitScale(text: LangText, hiEnabled: boolean): string[] {
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

/** 1 → "a", 26 → "z", 27 → "aa" (quiz-frontend `toLetters`). */
function toLetters(count: number): string {
  let letters = '';
  while (count > 0) {
    count -= 1;
    letters = String.fromCharCode(97 + (count % 26)) + letters;
    count = Math.floor(count / 26);
  }
  return letters;
}

/**
 * The label students see for each question ("2" in "Q.2: "), keyed by question id. Mirrors
 * quiz-frontend `computeQuestionLabels`: unconditional questions count 1, 2, 3…; a follow-up
 * of 2 is 2a, 2b; a follow-up of 2a is 2a.1. Only a question that would be emitted with a
 * display_condition counts as a follow-up (an incomplete condition is emitted without one).
 */
export function questionLabels(state: FormState): Record<string, string> {
  const positions = positionIndex(state);
  const labels: string[] = [];
  const depths: number[] = [];
  const numFollowUps: number[] = [];
  let numTopLevel = 0;
  const qs = allQuestions(state);
  qs.forEach((q, position) => {
    numFollowUps.push(0);
    const source = resolveCondition(state, q.cond, positions)?.source_position;
    if (source == null) {
      numTopLevel += 1;
      labels.push(String(numTopLevel));
      depths.push(0);
      return;
    }
    if (source >= position) {
      labels.push(String(position + 1));
      depths.push(0);
      return;
    }
    numFollowUps[source] += 1;
    const depth = depths[source] + 1;
    labels.push(
      depth % 2 === 1
        ? `${labels[source]}${toLetters(numFollowUps[source])}`
        : `${labels[source]}.${numFollowUps[source]}`
    );
    depths.push(depth);
  });
  return Object.fromEntries(qs.map((q, i) => [q.id, labels[i]]));
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
      if (q.type === 'single-choice-other') base.max_char_limit = OTHER_MAX_CHARS;
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
      source: 'quiz-creator-form-builder',
      source_id: null,
    },
  };
}

// ---- what is missing before the form can be used ---------------------------

/** Something that must be fixed before the form can be saved as complete. */
export interface FormProblem {
  /** The question it is about; null for the form name or a section. */
  qid: string | null;
  sectionId: string | null;
  /** Where to look, as the author sees it: "Form name", "Section 2", "Section 1 · Q.1a". */
  where: string;
  message: string;
}

/**
 * Everything missing before a session can use the form — the same checks quiz-backend makes
 * before it marks a saved form ready (form_definition_build.completeness_errors), plus the
 * builder-only half-finished condition. "Save" refuses while there are any; "Save as draft"
 * stores the form anyway.
 */
export function formProblems(state: FormState): FormProblem[] {
  const problems: FormProblem[] = [];
  const labels = questionLabels(state);
  const positions = positionIndex(state);
  const add = (qid: string | null, sectionId: string | null, where: string, message: string) =>
    problems.push({ qid, sectionId, where, message });

  if (!state.name.trim()) add(null, null, 'Form name', 'The form has no name.');
  if (allQuestions(state).length === 0) add(null, null, 'Form', 'The form has no questions yet.');

  state.sections.forEach((section, sIndex) => {
    const sectionWhere = `Section ${sIndex + 1}`;
    if (section.questions.length === 0)
      add(null, section.id, sectionWhere, 'This section has no questions.');
    for (const q of section.questions) {
      const where = `${sectionWhere} · Q.${labels[q.id]}`;
      const issue = (message: string) => add(q.id, section.id, where, message);

      if (!q.text.en.trim()) issue('The question text is missing.');
      if (CHOICE_TYPES.includes(q.type)) {
        if (q.options.length < 2) issue('Add at least two options.');
        if (q.options.some((o) => !o.text.en.trim())) issue('An option has no text.');
      }
      if (q.type === 'matrix-rating') {
        if (q.rows.length === 0 || q.rows.some((r) => !r.text.en.trim()))
          issue('Every rating row needs text.');
        if (!q.scale.en.split(',').some((s) => s.trim())) issue('The rating scale is empty.');
      }
      if (q.cond.on) {
        const src = questionById(state, q.cond.src);
        if (!src) {
          issue('Choose which question this follow-up depends on.');
        } else if (
          positions.get(src.id)! >= positions.get(q.id)! ||
          !CHOICE_TYPES.includes(src.type)
        ) {
          issue('Its "Show only if" question must be an earlier choice question.');
        } else if (q.cond.opts.length === 0) {
          issue(`Pick the option(s) of Q.${labels[src.id]} that show this question.`);
        }
      }
    }
  });
  return problems;
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
    langs: { en: true, hi: true },
    sections: [s1, s2],
  };
}
