import { isValidCmsUrl, quizSchema } from './form.types';

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

  it('accepts short new-CMS links carrying only a test id', () => {
    // The CMS shortened its test links to `/test?id=<id>` (nex-gen-cms #170).
    expect(isValidCmsUrl('https://new-cms.avantifellows.org/test?id=8901')).toBe(true);
    expect(isValidCmsUrl('https://new-cms.avantifellows.org/tests/edit-test?id=504')).toBe(true);
  });

  it('still validates curriculum_id / grade_id when they are present', () => {
    expect(isValidCmsUrl('https://new-cms.avantifellows.org/test?id=504&curriculum_id=0')).toBe(
      false
    );
    expect(isValidCmsUrl('https://new-cms.avantifellows.org/test?id=504&grade_id=abc')).toBe(false);
  });

  it('rejects new-CMS links with no test id', () => {
    expect(isValidCmsUrl('https://new-cms.avantifellows.org/test?curriculum_id=9&grade_id=2')).toBe(
      false
    );
    expect(isValidCmsUrl('https://new-cms.avantifellows.org/test?id=abc')).toBe(false);
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

describe('quizSchema quizLanguage', () => {
  const field = quizSchema.innerType().shape.quizLanguage;

  it('accepts English, the regional options, or nothing', () => {
    for (const value of ['en', 'hi', 'gu', 'ta', undefined]) {
      expect(field.safeParse(value).success).toBe(true);
    }
  });

  it('rejects anything else', () => {
    expect(field.safeParse('hindi').success).toBe(false);
  });
});

describe('quizSchema form source', () => {
  const base = {
    course: 'JEE',
    stream: 'Others',
    testFormat: 'questionnaire',
    testPurpose: 'baseline',
    testType: 'form',
    gurukulFormatType: 'qa',
    optionalLimit: 'N/A',
    isAdvancedFormat: false,
    showAnswers: true,
    showScores: false,
    shuffle: false,
    hasNextStep: false,
  };
  const issuePaths = (data: object) => {
    const result = quizSchema.safeParse({ ...base, ...data });
    return result.success ? [] : result.error.issues.map((issue) => issue.path.join('.'));
  };

  it('a form-builder form needs a picked form, not a link', () => {
    expect(issuePaths({ formSource: 'builder' })).toContain('formId');
    expect(issuePaths({ formSource: 'builder' })).not.toContain('cmsUrl');
    expect(issuePaths({ formSource: 'builder', formId: 'abc' })).not.toContain('formId');
    // builder is the default for a form session
    expect(issuePaths({})).toContain('formId');
  });

  it('a Google Sheet form still needs a Sheets link', () => {
    expect(issuePaths({ formSource: 'sheet' })).toContain('cmsUrl');
    expect(
      issuePaths({ formSource: 'sheet', cmsUrl: 'https://docs.google.com/spreadsheets/d/x' })
    ).not.toContain('cmsUrl');
  });
});
