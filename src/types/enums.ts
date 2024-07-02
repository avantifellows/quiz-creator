export enum SessionType {
  CREATE = 'create',
  EDIT = 'edit',
  DUPPLICATE = 'duplicate',
}

export enum Steps {
  BASIC = 'basic',
  PLATFORM = 'platform',
  TIMELINE = 'timeline',
}

export enum Status {
  Processing = 'processing',
  Success = 'success',
  Failed = 'failed',
}

export enum Platform {
  Quiz = 'quiz',
  Live = 'live',
}

export enum Group {
  Haryana = 'HaryanaStudents',
  Himachal = 'HimachalStudents',
  Delhi = 'DelhiStudents',
  Uttarakhand = 'UttarakhandStudents',
  Gujarat = 'GujaratStudents',
  FeedingIndia = 'FeedingIndiaStudents',
  Candidates = 'Candidates',
  Enable = 'EnableStudents',
  AFTesting = 'AFTesting',
  AFTeachers = 'AFTeachers',
}

export enum AuthType {
  ID = 'ID',
  IDPH = 'ID,PH',
  IDDOB = 'ID,DOB',
  IDPHDOB = 'ID,PH,DOB',
}

export const Grades = [9, 10, 11, 12, 13] as const;
