import { isValidCmsUrl } from './form.types';

describe('isValidCmsUrl', () => {
  it('accepts legacy CMS test links', () => {
    expect(isValidCmsUrl('https://cms.peerlearning.com/tests/6836b8803562d935f80008a5')).toBe(true);
  });

  it.each(['new-cms.avantifellows.org', 'staging-new-cms.avantifellows.org'])(
    'accepts complete new-CMS test links from %s',
    (host) => {
      expect(isValidCmsUrl(`https://${host}/test?id=5327&curriculum_id=9&grade_id=4`)).toBe(true);
    }
  );

  it('continues to accept new-CMS edit-test links', () => {
    expect(
      isValidCmsUrl(
        'https://new-cms.avantifellows.org/tests/edit-test?id=504&curriculum_id=9&grade_id=2'
      )
    ).toBe(true);
  });

  it('rejects new-CMS links missing ingest parameters', () => {
    expect(isValidCmsUrl('https://new-cms.avantifellows.org/tests/edit-test?id=504')).toBe(false);
  });

  it('rejects unrelated hosts and new-CMS pages', () => {
    expect(
      isValidCmsUrl('https://example.org/tests/edit-test?id=504&curriculum_id=9&grade_id=2')
    ).toBe(false);
    expect(
      isValidCmsUrl('https://new-cms.avantifellows.org/tests?id=504&curriculum_id=9&grade_id=2')
    ).toBe(false);
  });
});
