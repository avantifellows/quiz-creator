import { ExtendedOptions } from '@/types';

export const MAX_BATCH_OPTIONS = 10_000;

const FOUR_DIGIT_YEAR = /(?:^|[_-])(20\d{2})(?=[_-]|$)/;
const TWO_DIGIT_YEAR = /(?:^|[_-])A?(2\d)(?=[_-]|$)/;

export function inferBatchYear(batchId: string): number | undefined {
  const fourDigitMatch = batchId.match(FOUR_DIGIT_YEAR);
  if (fourDigitMatch) return Number(fourDigitMatch[1]);

  const twoDigitMatch = batchId.match(TWO_DIGIT_YEAR);
  if (twoDigitMatch) return 2000 + Number(twoDigitMatch[1]);

  return undefined;
}

export function markSelectableBatchFamilies(
  batches: ExtendedOptions[],
  currentYear = new Date().getFullYear()
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

  return batches
    .map((batch) => {
      const familyId = String(batch.parentId ?? batch.id ?? batch.value);
      const familyYear = familyYears.get(familyId);
      const groupId = batch.groupId == null ? undefined : String(batch.groupId);
      const groupHasRecentFamilies = groupId != null && groupsWithRecentFamilies.has(groupId);

      return {
        ...batch,
        id: batch.id,
        batchYear: familyYear,
        isSelectableBatch:
          (familyYear != null && familyYear >= cutoffYear) || !groupHasRecentFamilies,
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
