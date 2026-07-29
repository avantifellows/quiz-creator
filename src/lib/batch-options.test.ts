import {
  inferBatchYear,
  isExpiredBatch,
  isSelectableBatchOption,
  markSelectableBatchFamilies,
} from './batch-options';

describe('batch options', () => {
  test.each([
    ['CG-TP-2027-common-A01', 2027],
    ['ChhattisgarhStudents_TP_2028_common_A001', 2028],
    ['CG-12-A25', 2025],
    ['ChhattisgarhStudents_12_24_A001', 2024],
    ['AF-Testing', undefined],
  ])('infers the cohort year from %s', (batchId, expectedYear) => {
    expect(inferBatchYear(batchId)).toBe(expectedYear);
  });

  it('keeps recent parent/class families and marks older families as non-selectable', () => {
    const batches = markSelectableBatchFamilies(
      [
        { id: '396', value: 'CG-12-A24', groupId: '19' },
        {
          id: '397',
          value: 'ChhattisgarhStudents_12_24_A001',
          parentId: '396',
          groupId: '19',
        },
        { id: '821', value: 'CG-12-A25', groupId: '19' },
        {
          id: '822',
          value: 'ChhattisgarhStudents_12_25_A001',
          parentId: '821',
          groupId: '19',
        },
        { id: '1078', value: 'CG-TP-2027-common-A01', groupId: '19' },
        {
          id: '1080',
          value: 'ChhattisgarhStudents_TP_2027_common_A001',
          parentId: '1078',
          groupId: '19',
        },
      ],
      2026
    );

    expect(batches).toHaveLength(6);
    const selectableValues = batches.filter(isSelectableBatchOption).map((batch) => batch.value);
    expect(selectableValues).toHaveLength(4);
    expect(selectableValues).toEqual(
      expect.arrayContaining([
        'CG-12-A25',
        'ChhattisgarhStudents_12_25_A001',
        'CG-TP-2027-common-A01',
        'ChhattisgarhStudents_TP_2027_common_A001',
      ])
    );
  });

  it('inherits the parent year for class batches without a year in their ID', () => {
    const batches = markSelectableBatchFamilies(
      [
        { id: '10', value: 'PROGRAM-TP-2027-A01', groupId: '1' },
        { id: '11', value: 'PROGRAM-CLASS-ALPHA', parentId: '10', groupId: '1' },
      ],
      2026
    );

    expect(batches).toEqual([
      expect.objectContaining({ batchYear: 2027, isSelectableBatch: true }),
      expect.objectContaining({ batchYear: 2027, isSelectableBatch: true }),
    ]);
  });

  describe('end_date expiry', () => {
    const today = new Date('2026-07-29T10:00:00.000Z');

    it('treats a passed end_date as expired and a future one as active', () => {
      expect(isExpiredBatch({ value: 'A', endDate: '2026-06-30' }, today)).toBe(true);
      expect(isExpiredBatch({ value: 'B', endDate: '2027-06-30' }, today)).toBe(false);
    });

    it('never expires a batch whose end_date is unset', () => {
      // Live prod cohorts (e.g. HR-9-Foundation-25) still have no end_date.
      expect(isExpiredBatch({ value: 'HR-9-Foundation-25' }, today)).toBe(false);
      expect(isExpiredBatch({ value: 'X', endDate: null }, today)).toBe(false);
    });

    it('counts the whole end_date day as still active', () => {
      expect(isExpiredBatch({ value: 'C', endDate: '2026-07-29' }, today)).toBe(false);
    });

    it('hides expired batches even when the cohort year looks recent', () => {
      const batches = markSelectableBatchFamilies(
        [
          { id: '1', value: 'CG-12-A27', groupId: '19', endDate: '2026-06-30' },
          { id: '2', value: 'CG-TP-2027-common-A01', groupId: '19', endDate: '2027-06-30' },
        ],
        2026,
        today
      );

      expect(batches.filter(isSelectableBatchOption).map((batch) => batch.value)).toEqual([
        'CG-TP-2027-common-A01',
      ]);
    });

    it('cascades an expired parent to its class batches', () => {
      const batches = markSelectableBatchFamilies(
        [
          { id: '10', value: 'PROGRAM-TP-2027-A01', groupId: '1', endDate: '2026-06-30' },
          { id: '11', value: 'PROGRAM-CLASS-ALPHA', parentId: '10', groupId: '1' },
        ],
        2026,
        today
      );

      expect(batches.some(isSelectableBatchOption)).toBe(false);
    });
  });

  it('keeps legacy options when a group has no recent parseable family', () => {
    const batches = markSelectableBatchFamilies(
      [
        { id: '1', value: 'AF-Testing', groupId: '2' },
        { id: '2', value: 'AF-Teachers-A24', groupId: '3' },
      ],
      2026
    );

    expect(batches.every(isSelectableBatchOption)).toBe(true);
  });
});
