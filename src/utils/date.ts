import {
  differenceInDays,
  differenceInSeconds,
  format,
  formatDistance,
  formatDuration,
  fromUnixTime,
  intervalToDuration,
  isAfter,
  isBefore,
  parseISO
} from 'date-fns';

type DateObject = Date | number | string;

export const toUTC = (date: Date) => {
  return new Date(date.toUTCString().substring(0, 25));
};

const getDate = (date: DateObject, utc?: boolean): Date => {
  if (typeof date === 'string') {
    const parsedDate = parseISO(date);
    return utc ? toUTC(parsedDate) : parsedDate;
  }

  if (typeof date === 'number') {
    const parsedDate = fromUnixTime(date);
    return utc ? toUTC(parsedDate) : parsedDate;
  }

  return utc ? toUTC(date) : date;
};

export const formatDate = (date: DateObject, utc: boolean = false): string => {
  return format(getDate(date, utc), 'yyyy-MM-dd');
};

/**
 * Formats a Date instance or UNIX timestamp to a date time string in the following format:
 * 2020-09-15 1:30 PM
 */
export const formatDateTime = (date: DateObject, utc: boolean = false): string => {
  return format(getDate(date, utc), 'yyyy-MM-dd h:mm a');
};

/**
 * Formats the difference between two dates as human readable format.
 */
export const formatTimeDifference = (
  a: DateObject,
  b: DateObject = new Date(),
  utc: boolean = false
): string => {
  return formatDistance(getDate(a, utc), getDate(b, utc), {
    addSuffix: true,
    includeSeconds: true
  });
};

/**
 * Formats a time duration as human readable format.
 */
export const formatTimeDuration = (
  a: DateObject,
  b: DateObject = new Date(),
  utc: boolean = false,
  options?: { format: string[] }
): string => {
  return formatDuration(
    intervalToDuration({
      start: getDate(a, utc),
      end: getDate(b, utc)
    }),
    options
  );
};

/**
 * Get the difference in seconds between two dates.
 */
export const getTimeDifference = (
  a: DateObject,
  b: DateObject = new Date(),
  utc: boolean = false
): number => {
  return differenceInSeconds(getDate(b, utc), getDate(a, utc));
};

/**
 * Get the difference in days between two dates.
 */
export const getDayDifference = (
  a: DateObject,
  b: DateObject = new Date(),
  utc: boolean = false
): number => {
  return differenceInDays(getDate(b, utc), getDate(a, utc));
};

export const dateIsBetween = (
  start: DateObject,
  end: DateObject,
  date: DateObject = new Date()
) => {
  return isAfter(getDate(date), getDate(start)) && isBefore(getDate(date), getDate(end));
};
