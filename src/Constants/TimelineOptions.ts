import { OptionType } from './StudentDetailsOptions';

const IsEnabledOptions: OptionType[] = [
  { value: true, label: 'ON' },
  { value: false, label: 'OFF' },
];

const HasSyncedOptions: OptionType[] = [
  { value: true, label: 'TRUE' },
  { value: false, label: 'FALSE' },
];

const SessionTypeOptions: OptionType[] = [
  { value: 'infinite', label: 'Infinite' },
  { value: 'standard', label: 'Standard' },
];

export { HasSyncedOptions, IsEnabledOptions, SessionTypeOptions };
