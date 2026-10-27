/**
 * @jest-environment node
 */
// Pure model/reducer logic — no DOM needed, and jsdom lacks the reducer's structuredClone.
import { reducer } from './reducer';
import {
  cloneQuestion,
  computeVisibility,
  conditionSummary,
  FOLLOW_UP_TEXT,
  isOtherOption,
  nestingDepths,
  newFollowUp,
  newOption,
  newQuestion,
  newSection,
  OTHER_MAX_CHARS,
  OTHER_OPTION_TEXT,
  seedExample,
  toQuizPayload,
  validate,
} from './model';
import { FormState, PreviewAnswers } from './types';

/** Build a tiny two-question form where q2 depends on q1's first option. */
function condForm(): { state: FormState; q1: string; q2: string; opt0: string; opt1: string } {
  const q1 = newQuestion('single-choice');
  q1.text.en = 'Trigger?';
  q1.options = [newOption('Yes'), newOption('No')];
  const q2 = newQuestion('subjective');
  q2.text.en = 'Why?';
  q2.cond = { on: true, src: q1.id, opts: [q1.options[0].id] };
  const s = newSection('S1');
  s.questions = [q1, q2];
  const state: FormState = {
    name: 'T',
    langs: { en: true, hi: false },
    sections: [s],
  };
  return { state, q1: q1.id, q2: q2.id, opt0: q1.options[0].id, opt1: q1.options[1].id };
}

describe('computeVisibility', () => {
  it('hides a dependent until its trigger option is chosen', () => {
    const { state, q1, q2, opt0, opt1 } = condForm();

    expect(computeVisibility(state, {})[q2]).toBe(false);
    expect(computeVisibility(state, { [q1]: [opt1] })[q2]).toBe(false);
    expect(computeVisibility(state, { [q1]: [opt0] })[q2]).toBe(true);
  });

  it('is transitive: a dependent of a hidden question stays hidden', () => {
    const q1 = newQuestion('single-choice');
    q1.options = [newOption('Yes'), newOption('No')];
    const q2 = newQuestion('single-choice');
    q2.options = [newOption('A'), newOption('B')];
    q2.cond = { on: true, src: q1.id, opts: [q1.options[0].id] };
    const q3 = newQuestion('subjective');
    q3.cond = { on: true, src: q2.id, opts: [q2.options[0].id] };
    const s = newSection('S');
    s.questions = [q1, q2, q3];
    const state: FormState = {
      name: 'T',
      langs: { en: true, hi: false },
      sections: [s],
    };
    // q1 answered with the non-triggering option -> q2 hidden -> q3 hidden even though
    // q3's own trigger (q2) option is in the answer map for q2.
    const answers: PreviewAnswers = { [q1.id]: [q1.options[1].id], [q2.id]: [q2.options[0].id] };
    const vis = computeVisibility(state, answers);
    expect(vis[q2.id]).toBe(false);
    expect(vis[q3.id]).toBe(false);
  });
});

describe('toQuizPayload', () => {
  it('resolves display_condition to flat source_position + option_indices', () => {
    const { state } = condForm();
    const payload = toQuizPayload(state);
    const q2 = payload.question_sets[0].questions[1];
    expect(q2.display_condition).toEqual({ source_position: 0, option_indices: [0] });
    // non-conditional trigger carries no display_condition
    expect(payload.question_sets[0].questions[0].display_condition).toBeUndefined();
  });

  it('computes flat positions across sections in document order', () => {
    const state = seedExample();
    const payload = toQuizPayload(state);
    // q4 (travel) depends on q3 (coaching). q3 is the 3rd question overall (position 2).
    const coaching = payload.question_sets[1].questions[1];
    expect(coaching.display_condition?.source_position).toBe(2);
  });

  it('emits form metadata and ungraded defaults', () => {
    const payload = toQuizPayload(seedExample());
    expect(payload.metadata.quiz_type).toBe('form');
    expect(payload.max_marks).toBe(0);
    expect(payload.question_sets[0].questions[0].graded).toBe(false);
    expect(payload.question_sets[0].questions[0].correct_answer).toBeNull();
  });

  it('combines paired EN/HI into one stacked string when Hindi is enabled', () => {
    const state = seedExample(); // langs.hi = true
    const text = toQuizPayload(state).question_sets[0].questions[0].text;
    expect(text).toContain('\n');
    expect(text.split('\n')[0]).toMatch(/friend/i);
  });

  it('emits per-question required and derives require_all_questions from it', () => {
    const { state } = condForm();
    state.sections[0].questions[1].required = false;
    const payload = toQuizPayload(state);
    expect(payload.question_sets[0].questions.map((q) => q.required)).toEqual([true, false]);
    // one required question is enough to switch the runtime's form-level gate on
    expect(payload.require_all_questions).toBe(true);
  });

  it('turns require_all_questions off when every question is optional', () => {
    const { state } = condForm();
    state.sections[0].questions.forEach((q) => (q.required = false));
    expect(toQuizPayload(state).require_all_questions).toBe(false);
  });

  it('maps matrix-rating rows and scale into matrix_rows + options', () => {
    const q = toQuizPayload(seedExample()).question_sets[1].questions[2];
    expect(q.type).toBe('matrix-rating');
    expect(q.matrix_rows?.length).toBe(2);
    expect(q.options.length).toBeGreaterThan(0);
  });
});

describe('conditionSummary', () => {
  it('names the trigger question and the chosen option(s)', () => {
    const { state, q2 } = condForm();
    const dep = state.sections[0].questions.find((x) => x.id === q2)!;
    expect(conditionSummary(state, dep)).toBe('Shown if "Trigger?" is "Yes"');
  });

  it('is null for unconditional questions and incomplete conditions', () => {
    const { state, q2 } = condForm();
    const [trigger, dep] = state.sections[0].questions;
    expect(conditionSummary(state, trigger)).toBeNull();
    dep.cond.opts = [];
    expect(
      conditionSummary(state, state.sections[0].questions.find((x) => x.id === q2)!)
    ).toBeNull();
  });
});

describe('reducer add-question', () => {
  it('inserts the caller-built question so its id is known up front', () => {
    const { state } = condForm();
    const q = newQuestion('subjective');
    const next = reducer(state, { type: 'add-question', sid: state.sections[0].id, question: q });
    expect(next.sections[0].questions.at(-1)?.id).toBe(q.id);
  });
});

describe('follow-ups', () => {
  /** q1 (trigger) -> q2 (follows q1), then an unrelated q3 at the end. */
  function withTail() {
    const base = condForm();
    const q3 = newQuestion('subjective');
    q3.text.en = 'Unrelated';
    base.state.sections[0].questions.push(q3);
    return { ...base, q3: q3.id };
  }
  const ids = (s: FormState) => s.sections[0].questions.map((q) => q.id);

  it('nests a contiguous follow-up block under its trigger, display only', () => {
    const { state, q1, q2, q3 } = withTail();
    expect(nestingDepths(state.sections[0])).toEqual({ [q1]: 0, [q2]: 1, [q3]: 0 });
  });

  it('does not nest a dependent separated from its trigger by an unrelated question', () => {
    const { state, q1, q2 } = condForm();
    const gap = newQuestion('subjective');
    state.sections[0].questions = [
      state.sections[0].questions[0],
      gap,
      state.sections[0].questions[1],
    ];
    const d = nestingDepths(state.sections[0]);
    expect([d[q1], d[gap.id], d[q2]]).toEqual([0, 0, 0]);
  });

  it('inserts a follow-up after the trigger’s existing follow-ups, before unrelated questions', () => {
    const { state, q1, q2, q3, opt1 } = withTail();
    const trigger = state.sections[0].questions[0];
    const fu = newFollowUp(trigger, opt1, FOLLOW_UP_TEXT);
    const next = reducer(state, { type: 'add-follow-up', qid: q1, question: fu });
    expect(ids(next)).toEqual([q1, q2, fu.id, q3]);
    // and the emitted condition points at the trigger's second option
    expect(toQuizPayload(next).question_sets[0].questions[2].display_condition).toEqual({
      source_position: 0,
      option_indices: [1],
    });
  });

  it('shortens the condition summary when the card is nested under its trigger', () => {
    const { state } = condForm();
    const dep = state.sections[0].questions[1];
    expect(conditionSummary(state, dep, { nested: true })).toBe('If "Yes"');
  });
});

describe('single-choice-other', () => {
  /** condForm's trigger switched to single-choice-other. */
  function otherForm() {
    const f = condForm();
    const state = reducer(f.state, {
      type: 'set-qtype',
      qid: f.q1,
      value: 'single-choice-other',
    });
    return { ...f, state, trigger: () => state.sections[0].questions[0] };
  }

  it('appends a fixed "Other" as the last option when the type is chosen', () => {
    const { trigger } = otherForm();
    const t = trigger();
    expect(t.options.map((o) => o.text.en)).toEqual(['Yes', 'No', 'Other']);
    expect(isOtherOption(t, t.options[2].id)).toBe(true);
    expect(isOtherOption(t, t.options[0].id)).toBe(false);
  });

  it('reuses a trailing option already labelled "Other" instead of adding a second one', () => {
    const { state, q1 } = condForm();
    const withOther = reducer(state, { type: 'add-option', qid: q1 });
    const oid = withOther.sections[0].questions[0].options[2].id;
    const typed = reducer(withOther, {
      type: 'set-option',
      qid: q1,
      oid,
      lang: 'en',
      value: 'other ',
    });
    const next = reducer(typed, { type: 'set-qtype', qid: q1, value: 'single-choice-other' });
    const t = next.sections[0].questions[0];
    expect(t.options.map((o) => o.text.en)).toEqual(['Yes', 'No', 'Other']);
    expect(t.options[2].id).toBe(oid);
  });

  it('adds new options above "Other" and never edits or deletes "Other"', () => {
    const { state, q1, trigger } = otherForm();
    const otherId = trigger().options[2].id;
    let next = reducer(state, { type: 'add-option', qid: q1 });
    next = reducer(next, { type: 'set-option', qid: q1, oid: otherId, lang: 'en', value: 'X' });
    next = reducer(next, { type: 'del-option', qid: q1, oid: otherId });
    const t = next.sections[0].questions[0];
    expect(t.options).toHaveLength(4);
    expect(t.options[3]).toMatchObject({ id: otherId, text: OTHER_OPTION_TEXT });
  });

  it('removes "Other" when the type changes, dropping conditions that pointed at it', () => {
    const { state, q1, q2, trigger } = otherForm();
    const otherId = trigger().options[2].id;
    let next = reducer(state, { type: 'cond-opt', qid: q2, oid: otherId, checked: true });
    next = reducer(next, { type: 'set-qtype', qid: q1, value: 'single-choice' });
    const [t, dep] = next.sections[0].questions;
    expect(t.options.map((o) => o.text.en)).toEqual(['Yes', 'No']);
    expect(dep.cond.opts).toEqual([state.sections[0].questions[1].cond.opts[0]]);
  });

  it('emits the runtime type with "Other" last and the 500-char limit', () => {
    const { state } = otherForm();
    const q = toQuizPayload(state).question_sets[0].questions[0];
    expect(q.type).toBe('single-choice-other');
    expect(q.options.map((o) => o.text)).toEqual(['Yes', 'No', 'Other']);
    expect(q.max_char_limit).toBe(OTHER_MAX_CHARS);
  });

  it('can trigger a follow-up on its "Other" option', () => {
    const { state, q1, trigger } = otherForm();
    const fu = newFollowUp(trigger(), trigger().options[2].id, FOLLOW_UP_TEXT);
    const next = reducer(state, { type: 'add-follow-up', qid: q1, question: fu });
    // Placed after q2, the trigger's existing follow-up.
    expect(toQuizPayload(next).question_sets[0].questions[2].display_condition).toEqual({
      source_position: 0,
      option_indices: [2],
    });
    expect(computeVisibility(next, { [q1]: [trigger().options[2].id] })[fu.id]).toBe(true);
  });
});

describe('dup-question', () => {
  it('inserts a fresh-id copy right after the original, keeping its condition', () => {
    const { state, q1, q2 } = condForm();
    const original = state.sections[0].questions[1];
    const copy = cloneQuestion(original);
    expect(copy.id).not.toBe(original.id);
    const next = reducer(state, { type: 'dup-question', qid: q2, question: copy });
    expect(next.sections[0].questions.map((q) => q.id)).toEqual([q1, q2, copy.id]);
    expect(next.sections[0].questions[2].cond).toEqual(original.cond);
  });

  it('gives a copied choice question new option ids', () => {
    const { state } = condForm();
    const trigger = state.sections[0].questions[0];
    const copy = cloneQuestion(trigger);
    const before = new Set(trigger.options.map((o) => o.id));
    expect(copy.options.some((o) => before.has(o.id))).toBe(false);
    expect(copy.options.map((o) => o.text.en)).toEqual(['Yes', 'No']);
  });
});

describe('validate', () => {
  it('flags a conditional question with no trigger selected', () => {
    const { state, q2 } = condForm();
    // break the condition: on, but no src
    const dep = state.sections[0].questions.find((x) => x.id === q2)!;
    dep.cond = { on: true, src: null, opts: [] };
    expect(validate(state).some((p) => /no trigger/i.test(p))).toBe(true);
  });

  it('passes a well-formed seeded form', () => {
    expect(validate(seedExample())).toEqual([]);
  });
});
