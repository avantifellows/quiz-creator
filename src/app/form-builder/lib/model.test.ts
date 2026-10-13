/**
 * @jest-environment node
 */
// Pure model/reducer logic — no DOM needed, and jsdom lacks the reducer's structuredClone.
import { reducer } from './reducer';
import {
  computeVisibility,
  conditionSummary,
  newOption,
  newQuestion,
  newSection,
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
    singlePageHeaderText: '',
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
      singlePageHeaderText: '',
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
