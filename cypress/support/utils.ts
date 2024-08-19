import { addDays, DateValues, format, set } from 'date-fns';

export const getDateWithTime = (value: DateValues, daysToAdd?: number) => {
  const baseDate = daysToAdd ? addDays(new Date(), daysToAdd) : new Date();
  const dateWithTime = set(baseDate, { seconds: 0, milliseconds: 0, ...value });
  return dateWithTime;
};

export const getDateComponents = (value: Date) => {
  const date = format(value, 'dd');
  const monthLabel = format(value, 'MMMM');
  const month = (parseInt(format(value, 'M')) - 1).toString();
  const year = format(value, 'yyyy');
  const hours = format(value, 'hh');
  const minutes = format(value, 'mm');
  const period = format(value, 'a');

  const components = { date, month, year, hours, minutes, period, monthLabel };
  return components;
};
