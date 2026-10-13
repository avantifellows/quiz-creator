/*
 * Form Builder prototype — domain types.
 *
 * This is the *authoring* tree the builder edits. It is intentionally richer than the
 * runtime quiz: conditions reference other questions/options by STABLE CLIENT ID (not by
 * position), because positions shift while the author is still adding/removing questions.
 * Positions are computed only at emit time (see model.ts `toQuizPayload`), which is the one
 * place the positional invariant from the docs is materialised.
 */

export type Lang = 'en' | 'hi';

/** Paired multilingual string. English is always authored; Hindi is optional. */
export interface LangText {
  en: string;
  hi: string;
}

export type QuestionType = 'single-choice' | 'multi-choice' | 'subjective' | 'matrix-rating';

/** Only these answer shapes can drive a condition (v1 rule: list-shaped answers only). */
export const CHOICE_TYPES: QuestionType[] = ['single-choice', 'multi-choice'];

export interface Option {
  id: string;
  text: LangText;
}

/**
 * Conditional-display rule, authoring form.
 * `src` = the trigger question's client id; `opts` = trigger option client ids that reveal
 * this question. Resolved to {source_position, option_indices} at emit time.
 */
export interface Condition {
  on: boolean;
  src: string | null;
  opts: string[];
}

export interface Question {
  id: string;
  type: QuestionType;
  text: LangText;
  /** choice questions */
  options: Option[];
  /** matrix-rating rows to rate */
  rows: Option[];
  /** matrix-rating scale, comma-separated per language */
  scale: LangText;
  cond: Condition;
  /** Must be answered before submit. A conditional question is only required while shown. */
  required: boolean;
}

export interface Section {
  id: string;
  title: string;
  questions: Question[];
}

export interface FormState {
  name: string;
  singlePageHeaderText: string;
  /** English is always on; Hindi is toggleable. */
  langs: { en: true; hi: boolean };
  sections: Section[];
}

/** Preview answer map: questionId -> answer. Choice = option-id list; subjective = string;
 *  matrix = { rowId: scaleIndex }. Only choice answers participate in visibility. */
export type PreviewAnswer = string[] | string | Record<string, number>;
export type PreviewAnswers = Record<string, PreviewAnswer>;

// ---- Emit payload shape (POST /quiz) -------------------------------------
// Mirrors architecture.md "Exact POST /quiz shape a quiz-creator builder must produce".

export interface DisplayCondition {
  source_position: number;
  option_indices: number[];
}

export interface PayloadOption {
  text: string;
}

export interface PayloadQuestion {
  text: string;
  type: QuestionType;
  options: PayloadOption[];
  matrix_rows?: string[];
  graded: false;
  correct_answer: null;
  /** Per-question opt-out of require_all_questions (quiz-backend `Question.required`). */
  required: boolean;
  display_condition?: DisplayCondition;
}

export interface PayloadQuestionSet {
  title: string;
  max_questions_allowed_to_attempt: number;
  questions: PayloadQuestion[];
}

export interface QuizPayload {
  title: string;
  question_sets: PayloadQuestionSet[];
  max_marks: 0;
  num_graded_questions: 0;
  /** Derived: true iff any question is required. The runtime only enforces per-question
   *  `required` when this form-level switch is on, so the builder never exposes it directly. */
  require_all_questions: boolean;
  metadata: {
    quiz_type: 'form';
    single_page_header_text?: string;
    source: string;
    source_id: null;
  };
}
