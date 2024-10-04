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
  Youtube = 'youtube',
  Meet = 'meet',
  Zoom = 'zoom',
  Others = 'others',
  Plio = 'AF-plio',
  SPlio = 'SCERT-plio',
  NoPlatform = 'no-platform',
}

export enum Group {
  AFTesting = 'AFTesting',
  AFTeachers = 'AFTeachers',
  DelhiSchools = 'DelhiSchools',
  Delhi = 'DelhiStudents',
  EnableSchools = 'EnableSchools',
  Enable = 'EnableStudents',
  FeedingIndia = 'FeedingIndiaStudents',
  GujaratStudents = 'GujaratStudents',
  GujaratSchools = 'GujaratSchools',
  Haryana = 'HaryanaStudents',
  Himachal = 'HimachalStudents',
  Maharashtra = 'MaharashtraStudents',
  PunjabStudents = 'PunjabStudents',
  PunjabTeachers = 'PunjabTeachers',
  PunjabSchools = 'PunjabSchools',
  TNSchools = 'TNSchools',
  TNStudents = 'TNStudents',
  Uttarakhand = 'UttarakhandStudents',
}

export const GroupShortName: Record<Group, string> = {
  [Group.AFTesting]: 'AF',
  [Group.AFTeachers]: 'AF',
  [Group.DelhiSchools]: 'Delhi',
  [Group.Delhi]: 'Delhi',
  [Group.EnableSchools]: 'Enable',
  [Group.Enable]: 'Enable',
  [Group.FeedingIndia]: 'Feeding',
  [Group.GujaratStudents]: 'Gujarat',
  [Group.GujaratSchools]: 'Gujarat',
  [Group.Haryana]: 'Haryana',
  [Group.Himachal]: 'Himachal',
  [Group.Maharashtra]: 'Maharashtra',
  [Group.PunjabStudents]: 'Punjab',
  [Group.PunjabTeachers]: 'Punjab',
  [Group.PunjabSchools]: 'Punjab',
  [Group.TNSchools]: 'TN',
  [Group.TNStudents]: 'TN',
  [Group.Uttarakhand]: 'Uttarakhand',
} as const;

export enum AuthType {
  ID = 'ID',
  IDDOB = 'ID,DOB',
  CODE = 'CODE',
  // Removed as now we are not allowing these.
  // IDPH = 'ID,PH',
  // IDPHDOB = 'ID,PH,DOB',
}

export enum Subjects {
  Maths = 'Maths',
  Science = 'Science',
  Physics = 'Physics',
  Chemistry = 'Chemistry',
  Biology = 'Biology',
  CareerGuidance = 'Career Guidance',
  Others = 'Others',
  AllSubjects = 'AllSubjects',
}

export const Grades = [9, 10, 11, 12, 13] as const;

export const MARKING_SCHEMES = {
  '4,-1': '4,-1',
  '1, 0': '1, 0',
} as const;

export enum STATUS {
  SUCCESS = 'success',
  FAILED = 'failed',
  PENDING = 'pending',
}
