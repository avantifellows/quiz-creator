/*
 * Form Builder prototype — state reducer.
 *
 * The authoring tree is deep and cross-referential, so each action clones the state and
 * mutates the clone (prototype-scale; readability over micro-perf). After any structural
 * deletion we prune dangling condition references so the tree never points at a removed
 * question/option.
 */

import { CHOICE_TYPES, FormState, Lang, Question, QuestionType } from './types';
import { newOption, newQuestion, newSection } from './model';

export type Action =
  | { type: 'set-name'; value: string }
  | { type: 'set-header'; value: string }
  | { type: 'toggle-hi' }
  | { type: 'add-section' }
  | { type: 'del-section'; sid: string }
  | { type: 'set-section-title'; sid: string; value: string }
  /** `question` lets the caller know the new id up front (to open it for editing). */
  | { type: 'add-question'; sid: string; question?: Question }
  | { type: 'del-question'; qid: string }
  | { type: 'set-qtext'; qid: string; lang: Lang; value: string }
  | { type: 'set-qtype'; qid: string; value: QuestionType }
  | { type: 'set-required'; qid: string; value: boolean }
  | { type: 'add-option'; qid: string }
  | { type: 'del-option'; qid: string; oid: string }
  | { type: 'set-option'; qid: string; oid: string; lang: Lang; value: string }
  | { type: 'add-row'; qid: string }
  | { type: 'del-row'; qid: string; rid: string }
  | { type: 'set-row'; qid: string; rid: string; lang: Lang; value: string }
  | { type: 'set-scale'; qid: string; lang: Lang; value: string }
  | { type: 'cond-toggle'; qid: string; value: boolean }
  | { type: 'cond-src'; qid: string; src: string | null }
  | { type: 'cond-opt'; qid: string; oid: string; checked: boolean }
  | { type: 'add-justify'; qid: string }
  | { type: 'load'; state: FormState };

const clone = (s: FormState): FormState => structuredClone(s);
const allQs = (s: FormState) => s.sections.flatMap((x) => x.questions);
const findQ = (s: FormState, qid: string) => allQs(s).find((q) => q.id === qid);

/** Drop condition references to questions/options that no longer exist. */
function pruneConditions(s: FormState): void {
  const qs = allQs(s);
  const qIds = new Set(qs.map((q) => q.id));
  for (const q of qs) {
    if (!q.cond.src) continue;
    const src = qs.find((x) => x.id === q.cond.src);
    if (!src || !qIds.has(q.cond.src)) {
      q.cond = { on: false, src: null, opts: [] };
      continue;
    }
    const optIds = new Set(src.options.map((o) => o.id));
    q.cond.opts = q.cond.opts.filter((oid) => optIds.has(oid));
  }
}

export function reducer(state: FormState, action: Action): FormState {
  const s = clone(state);
  switch (action.type) {
    case 'load':
      return action.state;
    case 'set-name':
      s.name = action.value;
      return s;
    case 'set-header':
      s.singlePageHeaderText = action.value;
      return s;
    case 'toggle-hi':
      s.langs.hi = !s.langs.hi;
      return s;
    case 'add-section':
      s.sections.push(newSection(''));
      return s;
    case 'del-section':
      s.sections = s.sections.filter((x) => x.id !== action.sid);
      pruneConditions(s);
      return s;
    case 'set-section-title': {
      const sec = s.sections.find((x) => x.id === action.sid);
      if (sec) sec.title = action.value;
      return s;
    }
    case 'add-question': {
      const sec = s.sections.find((x) => x.id === action.sid);
      if (sec) sec.questions.push(action.question ?? newQuestion('single-choice'));
      return s;
    }
    case 'del-question': {
      for (const sec of s.sections)
        sec.questions = sec.questions.filter((q) => q.id !== action.qid);
      pruneConditions(s);
      return s;
    }
    case 'set-qtext': {
      const q = findQ(s, action.qid);
      if (q) q.text[action.lang] = action.value;
      return s;
    }
    case 'set-qtype': {
      const q = findQ(s, action.qid);
      if (q) {
        q.type = action.value;
        if (CHOICE_TYPES.includes(q.type) && q.options.length === 0)
          q.options = [newOption(), newOption()];
        // A question that is no longer choice-type can't be a trigger — prune dependents.
        if (!CHOICE_TYPES.includes(q.type)) pruneConditions(s);
      }
      return s;
    }
    case 'set-required': {
      const q = findQ(s, action.qid);
      if (q) q.required = action.value;
      return s;
    }
    case 'add-option': {
      const q = findQ(s, action.qid);
      if (q) q.options.push(newOption());
      return s;
    }
    case 'del-option': {
      const q = findQ(s, action.qid);
      if (q) q.options = q.options.filter((o) => o.id !== action.oid);
      pruneConditions(s);
      return s;
    }
    case 'set-option': {
      const q = findQ(s, action.qid);
      const o = q?.options.find((x) => x.id === action.oid);
      if (o) o.text[action.lang] = action.value;
      return s;
    }
    case 'add-row': {
      const q = findQ(s, action.qid);
      if (q) q.rows.push(newOption());
      return s;
    }
    case 'del-row': {
      const q = findQ(s, action.qid);
      if (q) q.rows = q.rows.filter((r) => r.id !== action.rid);
      return s;
    }
    case 'set-row': {
      const q = findQ(s, action.qid);
      const r = q?.rows.find((x) => x.id === action.rid);
      if (r) r.text[action.lang] = action.value;
      return s;
    }
    case 'set-scale': {
      const q = findQ(s, action.qid);
      if (q) q.scale[action.lang] = action.value;
      return s;
    }
    case 'cond-toggle': {
      const q = findQ(s, action.qid);
      if (q) q.cond.on = action.value;
      return s;
    }
    case 'cond-src': {
      const q = findQ(s, action.qid);
      if (q) {
        q.cond.src = action.src;
        q.cond.opts = [];
      }
      return s;
    }
    case 'cond-opt': {
      const q = findQ(s, action.qid);
      if (q) {
        if (action.checked) {
          if (!q.cond.opts.includes(action.oid)) q.cond.opts.push(action.oid);
        } else {
          q.cond.opts = q.cond.opts.filter((x) => x !== action.oid);
        }
      }
      return s;
    }
    case 'add-justify': {
      // The yes/no + "please justify" preset: a subjective dependent inserted right after the
      // trigger, shown only when the trigger's last option (typically "Other"/"No") is chosen.
      const sec = s.sections.find((x) => x.questions.some((q) => q.id === action.qid));
      const trigger = sec?.questions.find((q) => q.id === action.qid);
      if (!sec || !trigger) return s;
      const dep = newQuestion('subjective');
      dep.text = { en: 'Please explain your answer', hi: 'कृपया अपना उत्तर समझाएँ' };
      const lastOpt = trigger.options[trigger.options.length - 1];
      dep.cond = { on: true, src: trigger.id, opts: lastOpt ? [lastOpt.id] : [] };
      const idx = sec.questions.findIndex((q) => q.id === trigger.id);
      sec.questions.splice(idx + 1, 0, dep);
      return s;
    }
    default:
      return s;
  }
}
