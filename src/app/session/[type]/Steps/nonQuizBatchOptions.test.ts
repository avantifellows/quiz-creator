import { nonQuizClassBatchOptionsFor } from './helper';
import { ApiFormOptions, ExtendedOptions, Group } from '@/types';

/**
 * Live Classes bug: for any platform other than Quiz, the Class Batch dropdown stayed
 * empty once a group was picked.
 *
 * The options were computed from `formData` (the SAVED session) while the user's group
 * lived in live form state, so on create — nothing saved yet — the list came out empty.
 * `nonQuizClassBatchOptionsFor` takes the live group instead.
 */

const batchOption = (
  value: string,
  id: string,
  groupId: string,
  parentId: string | null = null,
  extra: Partial<ExtendedOptions> = {}
): ExtendedOptions =>
  ({
    value,
    label: value,
    name: value,
    id,
    groupId,
    parentId,
    ...extra,
  }) as unknown as ExtendedOptions;

const ENABLE_ID = '3';
const PUNJAB_ID = '8';

const EN_PARENT = batchOption('EN-TP-2027-common-A01', '918', ENABLE_ID);
const EN_CHILD_A = batchOption('EnableStudents_TP_2027_engg_A001', '920', ENABLE_ID, '918');
const EN_CHILD_B = batchOption('EnableStudents_TP_2027_none_A001', '928', ENABLE_ID, '918');
const PJ_PARENT = batchOption('PJ-TP-2027-common-A01', '831', PUNJAB_ID);
const PJ_CHILD = batchOption('PunjabStudents_TP_2027_common_A001', '843', PUNJAB_ID, '831');
const EN_CHILD_EXPIRED = batchOption('EnableStudents_TP_2019_old_A001', '500', ENABLE_ID, '918', {
  isSelectableBatch: false,
});

const apiOptions = {
  group: [
    { value: Group.Enable, label: 'EnableStudents', id: ENABLE_ID },
    { value: Group.PunjabStudents, label: 'PunjabStudents', id: PUNJAB_ID },
    { value: Group.EnableSchools, label: 'EnableSchools', id: '30' },
  ],
  batch: [EN_PARENT, EN_CHILD_A, EN_CHILD_B, PJ_PARENT, PJ_CHILD, EN_CHILD_EXPIRED],
} as unknown as ApiFormOptions;

const valuesOf = (options: ExtendedOptions[]) => options.map((option) => option.value);

describe('nonQuizClassBatchOptionsFor', () => {
  it('lists the selected group’s child batches (the Live Classes fix)', () => {
    expect(valuesOf(nonQuizClassBatchOptionsFor(Group.Enable, apiOptions))).toEqual([
      'EnableStudents_TP_2027_engg_A001',
      'EnableStudents_TP_2027_none_A001',
    ]);
  });

  it('excludes parent (quiz) batches', () => {
    const options = nonQuizClassBatchOptionsFor(Group.Enable, apiOptions);

    expect(valuesOf(options)).not.toContain('EN-TP-2027-common-A01');
    options.forEach((option) => expect(option.parentId).toBeTruthy());
  });

  it('excludes other groups’ batches', () => {
    expect(valuesOf(nonQuizClassBatchOptionsFor(Group.Enable, apiOptions))).not.toContain(
      'PunjabStudents_TP_2027_common_A001'
    );
    expect(valuesOf(nonQuizClassBatchOptionsFor(Group.PunjabStudents, apiOptions))).toEqual([
      'PunjabStudents_TP_2027_common_A001',
    ]);
  });

  it('excludes expired batches', () => {
    expect(valuesOf(nonQuizClassBatchOptionsFor(Group.Enable, apiOptions))).not.toContain(
      'EnableStudents_TP_2019_old_A001'
    );
  });

  it('resolves school groups to their student group’s batches', () => {
    expect(valuesOf(nonQuizClassBatchOptionsFor(Group.EnableSchools, apiOptions))).toEqual([
      'EnableStudents_TP_2027_engg_A001',
      'EnableStudents_TP_2027_none_A001',
    ]);
  });

  it('returns nothing when no group is selected yet', () => {
    expect(nonQuizClassBatchOptionsFor(undefined, apiOptions)).toEqual([]);
    expect(nonQuizClassBatchOptionsFor('', apiOptions)).toEqual([]);
  });

  it('returns nothing for a group that is not in the options', () => {
    expect(nonQuizClassBatchOptionsFor('NotARealGroup', apiOptions)).toEqual([]);
  });
});
