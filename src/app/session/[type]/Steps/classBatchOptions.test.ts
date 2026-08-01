import { classBatchOptionsFor } from './helper';
import { ApiFormOptions, ExtendedOptions } from '@/types';

/**
 * A quiz session can target several quiz (parent) batches, so the class-batch options
 * must be the union of every selected parent's children.
 */

const batchOption = (value: string, id: string, parentId: string | null = null): ExtendedOptions =>
  ({
    value,
    label: value,
    name: value,
    id,
    parentId,
  }) as unknown as ExtendedOptions;

// Two quiz batches with children each, plus an unrelated third family.
const PARENT_A = batchOption('EN-11-25', '1');
const PARENT_B = batchOption('EN-12-25', '2');
const PARENT_C = batchOption('EN-10-25', '3');
const A1 = batchOption('EN-11-25-A1', '11', '1');
const A2 = batchOption('EN-11-25-A2', '12', '1');
const B1 = batchOption('EN-12-25-B1', '21', '2');
const C1 = batchOption('EN-10-25-C1', '31', '3');

const apiOptions = {
  batch: [PARENT_A, PARENT_B, PARENT_C, A1, A2, B1, C1],
} as unknown as ApiFormOptions;

const valuesOf = (options: ExtendedOptions[]) => options.map((option) => option.value);

describe('classBatchOptionsFor', () => {
  it('returns the children of a single selected quiz batch', () => {
    expect(valuesOf(classBatchOptionsFor(['EN-11-25'], apiOptions))).toEqual([
      'EN-11-25-A1',
      'EN-11-25-A2',
    ]);
  });

  it('unions the children of every selected quiz batch', () => {
    expect(valuesOf(classBatchOptionsFor(['EN-11-25', 'EN-12-25'], apiOptions))).toEqual([
      'EN-11-25-A1',
      'EN-11-25-A2',
      'EN-12-25-B1',
    ]);
  });

  it('excludes the children of unselected quiz batches', () => {
    expect(valuesOf(classBatchOptionsFor(['EN-11-25', 'EN-12-25'], apiOptions))).not.toContain(
      'EN-10-25-C1'
    );
  });

  it('drops a parent’s children as soon as that parent is deselected', () => {
    const before = valuesOf(classBatchOptionsFor(['EN-11-25', 'EN-12-25'], apiOptions));
    const after = valuesOf(classBatchOptionsFor(['EN-11-25'], apiOptions));

    expect(before).toContain('EN-12-25-B1');
    expect(after).not.toContain('EN-12-25-B1');
    expect(after).toContain('EN-11-25-A1');
  });

  it('returns nothing when no quiz batch is selected', () => {
    expect(classBatchOptionsFor([], apiOptions)).toEqual([]);
    expect(classBatchOptionsFor(undefined, apiOptions)).toEqual([]);
  });

  it('accepts a single string value', () => {
    expect(valuesOf(classBatchOptionsFor('EN-12-25', apiOptions))).toEqual(['EN-12-25-B1']);
  });

  it('ignores empty entries in the selection', () => {
    expect(valuesOf(classBatchOptionsFor(['', 'EN-12-25'], apiOptions))).toEqual(['EN-12-25-B1']);
  });

  it('is pure — repeated calls give the same result and mutate nothing', () => {
    const snapshot = JSON.stringify(apiOptions);

    const first = valuesOf(classBatchOptionsFor(['EN-11-25'], apiOptions));
    const second = valuesOf(classBatchOptionsFor(['EN-11-25'], apiOptions));

    expect(first).toEqual(second);
    expect(JSON.stringify(apiOptions)).toEqual(snapshot);
  });
});
