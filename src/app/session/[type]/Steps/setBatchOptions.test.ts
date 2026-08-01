import { setBatchOptions } from './helper';
import { ApiFormOptions, ExtendedOptions, FieldSchema, MySelectProps, basicFields } from '@/types';
import { UseFormReturn } from 'react-hook-form';

/**
 * Quiz sessions can target several quiz (parent) batches, so the class-batch
 * options must be the union of every selected parent's children.
 */

const batchOption = (value: string, id: number, parentId: number | null = null): ExtendedOptions =>
  ({
    value,
    label: value,
    name: value,
    id,
    parentId,
  }) as unknown as ExtendedOptions;

// Two quiz batches, each with two class batches, plus an unrelated family.
const PARENT_A = batchOption('EN-11-25', 1);
const PARENT_B = batchOption('EN-12-25', 2);
const PARENT_C = batchOption('EN-10-25', 3);
const A1 = batchOption('EN-11-25-A1', 11, 1);
const A2 = batchOption('EN-11-25-A2', 12, 1);
const B1 = batchOption('EN-12-25-B1', 21, 2);
const C1 = batchOption('EN-10-25-C1', 31, 3);

const apiOptions = {
  batch: [PARENT_A, PARENT_B, PARENT_C, A1, A2, B1, C1],
} as unknown as ApiFormOptions;

const createForm = (subBatch: string[] = []) => {
  const values: Record<string, unknown> = { subBatch };
  return {
    getValues: (name: string) => values[name],
    setValue: (name: string, value: unknown) => {
      values[name] = value;
    },
    __values: values,
  } as unknown as UseFormReturn & { __values: Record<string, unknown> };
};

const createFieldSchema = () =>
  ({ subBatch: { type: 'multi-select', options: [] } }) as unknown as FieldSchema<basicFields>;

const optionValues = (fieldsSchema: FieldSchema<basicFields>) =>
  ((fieldsSchema.subBatch as MySelectProps).options ?? []).map((option) => option.value);

describe('setBatchOptions', () => {
  it('offers the children of a single selected quiz batch', () => {
    const form = createForm();
    const fieldsSchema = createFieldSchema();

    setBatchOptions(['EN-11-25'], form, apiOptions, fieldsSchema);

    expect(optionValues(fieldsSchema)).toEqual(['EN-11-25-A1', 'EN-11-25-A2']);
  });

  it('unions the children of every selected quiz batch', () => {
    const form = createForm();
    const fieldsSchema = createFieldSchema();

    setBatchOptions(['EN-11-25', 'EN-12-25'], form, apiOptions, fieldsSchema);

    expect(optionValues(fieldsSchema)).toEqual(['EN-11-25-A1', 'EN-11-25-A2', 'EN-12-25-B1']);
  });

  it('excludes class batches of unselected quiz batches', () => {
    const form = createForm();
    const fieldsSchema = createFieldSchema();

    setBatchOptions(['EN-11-25', 'EN-12-25'], form, apiOptions, fieldsSchema);

    expect(optionValues(fieldsSchema)).not.toContain('EN-10-25-C1');
  });

  it('keeps existing class-batch selections that are still valid', () => {
    const form = createForm(['EN-11-25-A1']);
    const fieldsSchema = createFieldSchema();

    setBatchOptions(['EN-11-25', 'EN-12-25'], form, apiOptions, fieldsSchema);

    expect(form.__values.subBatch).toEqual(['EN-11-25-A1']);
  });

  it('drops only the class batches whose quiz batch was deselected', () => {
    const form = createForm(['EN-11-25-A1', 'EN-12-25-B1']);
    const fieldsSchema = createFieldSchema();

    // EN-12-25 is removed from the selection; its class batch must go with it.
    setBatchOptions(['EN-11-25'], form, apiOptions, fieldsSchema);

    expect(form.__values.subBatch).toEqual(['EN-11-25-A1']);
  });

  it('clears options and selections when no quiz batch is selected', () => {
    const form = createForm(['EN-11-25-A1']);
    const fieldsSchema = createFieldSchema();

    setBatchOptions([], form, apiOptions, fieldsSchema);

    expect(optionValues(fieldsSchema)).toEqual([]);
    expect(form.__values.subBatch).toEqual([]);
  });

  it('still accepts a single string value', () => {
    const form = createForm();
    const fieldsSchema = createFieldSchema();

    setBatchOptions('EN-12-25', form, apiOptions, fieldsSchema);

    expect(optionValues(fieldsSchema)).toEqual(['EN-12-25-B1']);
  });
});
