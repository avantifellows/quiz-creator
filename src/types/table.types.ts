export type TableData = {
  sno: number;
  batch: string;
  testName: string;
  startDate: string;
  endDate: string;
  testTakers: number;
  reportLink: string;
  portalLink: string;
  adminLink: string;
  status: 'processing' | 'success' | 'failed';
};
