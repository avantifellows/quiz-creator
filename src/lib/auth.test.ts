import { isAvantiEmail } from './avanti-email';

describe('isAvantiEmail', () => {
  it('accepts Avanti Fellows email addresses case-insensitively', () => {
    expect(isAvantiEmail('teacher@avantifellows.org')).toBe(true);
    expect(isAvantiEmail('Teacher@AvantiFellows.org')).toBe(true);
  });

  it('rejects missing and non-Avanti email addresses', () => {
    expect(isAvantiEmail()).toBe(false);
    expect(isAvantiEmail('teacher@gmail.com')).toBe(false);
    expect(isAvantiEmail('teacher@evilavantifellows.org')).toBe(false);
  });
});
