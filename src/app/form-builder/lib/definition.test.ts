/**
 * @jest-environment node
 */
// Pure mapping between the builder state and the stored form — no DOM needed.
import { duplicateForm, fromDefinition, toDefinition } from './definition';
import { newOption, newQuestion, newSection, seedExample } from './model';
import { reducer } from './reducer';
import { FormState } from './types';

const allQs = (s: FormState) => s.sections.flatMap((x) => x.questions);

describe('toDefinition / fromDefinition', () => {
  it('round-trips a stored form', () => {
    const definition = toDefinition(seedExample());
    expect(toDefinition(fromDefinition(definition))).toEqual(definition);
  });

  it('gives each loaded question its own placeholder rows', () => {
    const loaded = fromDefinition(toDefinition(seedExample()));
    const rowIds = allQs(loaded).flatMap((q) => q.rows.map((r) => r.id));
    expect(new Set(rowIds).size).toBe(rowIds.length);
  });

  it('stores languages, title and conditions in the stored-form shape', () => {
    const state = seedExample();
    const definition = toDefinition({ ...state, name: '  Screener  ' });
    expect(definition.title).toBe('Screener');
    expect(definition.languages).toEqual(['en', 'hi']);
    const dependent = allQs(state).find((q) => q.cond.on)!;
    const stored = definition.sections
      .flatMap((s) => s.questions)
      .find((q) => q.id === dependent.id)!;
    expect(stored.show_if).toEqual({
      question_id: dependent.cond.src,
      option_ids: dependent.cond.opts,
    });
  });

  it('keeps only the fields a question type uses', () => {
    const q = newQuestion('subjective');
    const s = newSection('S');
    s.questions = [q];
    const stored = toDefinition({ name: 'T', langs: { en: true, hi: false }, sections: [s] })
      .sections[0].questions[0];
    expect(stored.options).toEqual([]);
    expect(stored.rows).toEqual([]);
    expect(stored.scale).toBeNull();
    expect(stored.show_if).toBeNull();
  });

  it('drops a condition switched on but not pointed at a question yet', () => {
    const q = newQuestion('subjective');
    q.cond = { on: true, src: null, opts: [] };
    const s = newSection('S');
    s.questions = [q];
    const stored = toDefinition({ name: 'T', langs: { en: true, hi: false }, sections: [s] });
    expect(stored.sections[0].questions[0].show_if).toBeNull();
  });

  it('keeps a follow-up whose options are still to be picked (a draft)', () => {
    const t = newQuestion('single-choice');
    const f = newQuestion('subjective');
    f.cond = { on: true, src: t.id, opts: [] };
    const s = newSection('S');
    s.questions = [t, f];
    const stored = toDefinition({ name: 'T', langs: { en: true, hi: false }, sections: [s] });
    expect(stored.sections[0].questions[1].show_if).toEqual({ question_id: t.id, option_ids: [] });
  });
});

describe('duplicateForm', () => {
  it('copies everything with fresh ids and conditions pointing at the copies', () => {
    const state = seedExample();
    const copy = duplicateForm(state);
    expect(copy.name).toBe(`${state.name} (copy)`);
    const oldIds = new Set(
      allQs(state).flatMap((q) => [q.id, ...q.options.map((o) => o.id), ...q.rows.map((r) => r.id)])
    );
    for (const q of allQs(copy)) {
      expect(oldIds.has(q.id)).toBe(false);
      q.options.forEach((o) => expect(oldIds.has(o.id)).toBe(false));
      if (q.cond.on) {
        const trigger = allQs(copy).find((x) => x.id === q.cond.src)!;
        expect(trigger).toBeDefined();
        q.cond.opts.forEach((oid) => expect(trigger.options.some((o) => o.id === oid)).toBe(true));
      }
    }
    // same content otherwise
    expect(allQs(copy).map((q) => q.text)).toEqual(allQs(state).map((q) => q.text));
  });

  it('leaves the original untouched', () => {
    const state = seedExample();
    const before = structuredClone(state);
    duplicateForm(state);
    expect(state).toEqual(before);
  });

  it('gives new questions added after a load ids that never clash with loaded ones', () => {
    const loaded = fromDefinition(toDefinition(seedExample()));
    const next = reducer(loaded, { type: 'add-option', qid: allQs(loaded)[0].id });
    const ids = allQs(next).flatMap((q) => q.options.map((o) => o.id));
    expect(new Set(ids).size).toBe(ids.length);
    expect(newOption().id).not.toBe(newOption().id);
  });
});
