import { ExtendedOptions } from '@/types';

export const MAX_BATCH_OPTIONS = 10_000;

const FOUR_DIGIT_YEAR = /(?:^|[_-])(20\d{2})(?=[_-]|$)/;
const TWO_DIGIT_YEAR = /(?:^|[_-])A?(2\d)(?=[_-]|$)/;

/**
 * Dropdown label for a batch: the human name plus the batch_id.
 *
 * The LMS shows batch names, which read far better than raw ids, but names are
 * not unique — consecutive years share one (e.g. `FI-11-Selection-24` and
 * `FI-11-Selection-25` are both "FeedingIndia 11 Selection Batch") and both
 * remain selectable, so the name alone cannot tell them apart. Falls back to the
 * id when a batch has no name.
 */
export function buildBatchLabel(name: unknown, batchId: unknown): string {
  const batchIdText = String(batchId ?? '').trim();
  const nameText = String(name ?? '').trim();

  if (!nameText) return batchIdText;
  if (!batchIdText || nameText === batchIdText) return nameText;

  return `${nameText} (${batchIdText})`;
}

export function inferBatchYear(batchId: string): number | undefined {
  const fourDigitMatch = batchId.match(FOUR_DIGIT_YEAR);
  if (fourDigitMatch) return Number(fourDigitMatch[1]);

  const twoDigitMatch = batchId.match(TWO_DIGIT_YEAR);
  if (twoDigitMatch) return 2000 + Number(twoDigitMatch[1]);

  return undefined;
}

/**
 * A batch is expired when its end_date has already passed. Batches without an
 * end_date are never treated as expired: several live cohorts still have the
 * column unset, so a missing date must not hide them.
 */
export function isExpiredBatch(batch: ExtendedOptions, today = new Date()): boolean {
  const endDate = batch.endDate;
  if (!endDate) return false;

  const parsed = new Date(`${String(endDate).slice(0, 10)}T23:59:59.999`);
  if (Number.isNaN(parsed.getTime())) return false;

  return parsed.getTime() < today.getTime();
}

export function markSelectableBatchFamilies(
  batches: ExtendedOptions[],
  currentYear = new Date().getFullYear(),
  today = new Date()
): ExtendedOptions[] {
  const cutoffYear = currentYear - 1;
  const familyYears = new Map<string, number>();

  for (const batch of batches) {
    const familyId = String(batch.parentId ?? batch.id ?? batch.value);
    const batchYear = inferBatchYear(String(batch.value ?? ''));
    if (batchYear == null) continue;

    familyYears.set(familyId, Math.max(familyYears.get(familyId) ?? 0, batchYear));
  }

  const groupsWithRecentFamilies = new Set<string>();
  for (const batch of batches) {
    const familyId = String(batch.parentId ?? batch.id ?? batch.value);
    const familyYear = familyYears.get(familyId);
    if (familyYear != null && familyYear >= cutoffYear && batch.groupId != null) {
      groupsWithRecentFamilies.add(String(batch.groupId));
    }
  }

  // A parent's expiry cascades to its class batches, which often carry no
  // end_date of their own.
  const expiredFamilies = new Set<string>();
  for (const batch of batches) {
    const ownId = String(batch.id ?? batch.value);
    if (batch.parentId == null && isExpiredBatch(batch, today)) {
      expiredFamilies.add(ownId);
    }
  }

  return batches
    .map((batch) => {
      const familyId = String(batch.parentId ?? batch.id ?? batch.value);
      const familyYear = familyYears.get(familyId);
      const groupId = batch.groupId == null ? undefined : String(batch.groupId);
      const groupHasRecentFamilies = groupId != null && groupsWithRecentFamilies.has(groupId);

      const isExpired =
        isExpiredBatch(batch, today) ||
        (batch.parentId != null && expiredFamilies.has(String(batch.parentId)));

      return {
        ...batch,
        id: batch.id,
        batchYear: familyYear,
        isExpiredBatch: isExpired,
        isSelectableBatch:
          !isExpired &&
          ((familyYear != null && familyYear >= cutoffYear) || !groupHasRecentFamilies),
      };
    })
    .sort((left, right) => {
      const yearDifference = (right.batchYear ?? 0) - (left.batchYear ?? 0);
      if (yearDifference !== 0) return yearDifference;

      return Number(right.id ?? 0) - Number(left.id ?? 0);
    });
}

export function isSelectableBatchOption(batch: ExtendedOptions): boolean {
  return batch.isSelectableBatch !== false;
}
