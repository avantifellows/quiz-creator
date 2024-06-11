import { Option } from '@/types';

const IsEnabledOptions: Option[] = [
  { value: 'true', label: 'ON' },
  { value: 'false', label: 'OFF' },
];

const HasSyncedOptions: Option[] = [
  { value: 'true', label: 'TRUE' },
  { value: 'false', label: 'FALSE' },
];

const SessionTypeOptions: Option[] = [
  { value: 'infinite', label: 'Infinite' },
  { value: 'standard', label: 'Standard' },
];

export { HasSyncedOptions, IsEnabledOptions, SessionTypeOptions };
