import { addDays, addHours, addMinutes, addSeconds, fromUnixTime, subDays } from 'date-fns';

import {
  dateIsBetween,
  formatDate,
  formatDateTime,
  formatTimeDifference,
  formatTimeDuration,
  getDayDifference,
  getTimeDifference
} from './date';

describe('formatDate', () => {
  it('formats a date as YYYY-MM-DD', () => {
    expect(formatDate(fromUnixTime(0), true)).toBe('1970-01-01');
    expect(formatDate(fromUnixTime(123456789), true)).toBe('1973-11-29');
    expect(formatDate(0, true)).toBe('1970-01-01');
    expect(formatDate(123456789, true)).toBe('1973-11-29');
  });
});

describe('formatDateTime', () => {
  it('formats a date as YYYY-MM-DD H:MM A', () => {
    expect(formatDateTime(fromUnixTime(0), true)).toBe('1970-01-01 12:00 AM');
    expect(formatDateTime(fromUnixTime(123456789), true)).toBe('1973-11-29 9:33 PM');
    expect(formatDateTime(0, true)).toBe('1970-01-01 12:00 AM');
    expect(formatDateTime(123456789, true)).toBe('1973-11-29 9:33 PM');
  });
});

describe('formatTimeDifference', () => {
  it('formats the difference between two dates', () => {
    expect(formatTimeDifference(fromUnixTime(0), fromUnixTime(1000), true)).toBe('17 minutes ago');
    expect(formatTimeDifference(fromUnixTime(0), fromUnixTime(1000000), true)).toBe('12 days ago');
    expect(formatTimeDifference(0, 1000, true)).toBe('17 minutes ago');
    expect(formatTimeDifference(0, 1000000, true)).toBe('12 days ago');
  });
});

describe('formatTimeDuration', () => {
  it('formats the duration between two dates', () => {
    const date = fromUnixTime(1612083067);

    expect(formatTimeDuration(addHours(date, 10), date, true)).toBe('10 hours');
    expect(formatTimeDuration(addMinutes(date, 10), date, true)).toBe('10 minutes');
    expect(formatTimeDuration(addSeconds(date, 10), date, true)).toBe('10 seconds');
  });
});

describe('getTimeDifference', () => {
  it('returns the difference between two dates in seconds', () => {
    const date = fromUnixTime(1612083067);

    expect(getTimeDifference(date, date, true)).toBe(0);
    expect(getTimeDifference(addMinutes(date, -1), date, true)).toBe(60);
    expect(getTimeDifference(addHours(date, -1), date, true)).toBe(3600);
  });
});

describe('getDayDifference', () => {
  it('returns the difference between two dates in days', () => {
    const date = fromUnixTime(1612083067);

    expect(getDayDifference(date, date, true)).toBe(0);
    expect(getDayDifference(addDays(date, -1), date, true)).toBe(1);
    expect(getDayDifference(addDays(date, -10), date, true)).toBe(10);
  });
});

describe('dateIsBetween', () => {
  it('return true if a date is in the interval', () => {
    expect(
      dateIsBetween(
        new Date('2000-12-16T03:24:00'),
        new Date('2000-12-18T03:24:00'),
        new Date('2000-12-17T03:24:00')
      )
    ).toBeTruthy();
  });

  it('return false if a date is before the interval', () => {
    expect(
      dateIsBetween(
        new Date('2000-12-18T03:24:00'),
        new Date('2000-12-20T03:24:00'),
        new Date('2000-12-17T03:24:00')
      )
    ).toBeFalsy();
  });

  it('return false if a date is after the interval', () => {
    expect(
      dateIsBetween(
        new Date('2000-09-18T03:24:00'),
        new Date('2000-11-20T03:24:00'),
        new Date('2000-12-17T03:24:00')
      )
    ).toBeFalsy();
  });

  it('get actual date if the date to compare is not passed', () => {
    const date = new Date();
    expect(dateIsBetween(subDays(date, 1), addDays(date, 1))).toBeTruthy();
  });
});
