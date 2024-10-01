import * as moment from 'moment-timezone';

export const DEFAULT_TIMEZONE = 'Asia/Tokyo';

export const SECOND = 1;
export const MINUTE = 60 * SECOND;
export const HOUR = 60 * MINUTE;
export const DAY = 24 * HOUR;

export const MILLISECONDS = {
  SECOND: 1000,
  MINUTE: SECOND * 60,
  HOUR: MINUTE * 60,
  DAY: HOUR * 24,
};

export function serverTimeZone() {
  return moment.tz.guess();
}

export function now(tz = null) {
  if (tz) {
    return moment().tz(DEFAULT_TIMEZONE).unix() * 1000;
  }

  return moment().unix() * 1000;
}

export function dateToUnix(date, timeZone = DEFAULT_TIMEZONE) {
  const unix = moment(date).tz(timeZone).unix() * 1000;
  return unix;
}

export function formatTsToReadable(
  date,
  timeZone = DEFAULT_TIMEZONE,
  format = 'YYYY/MM/DD HH:mm:ss',
) {
  return moment(date, 'x').tz(timeZone).format(format);
}

// Without changing date and time only timeZone change
export function formatTsToReadableTz(
  date = new Date(),
  timeZone = DEFAULT_TIMEZONE,
  format = 'YYYY/MM/DD HH:mm:ss',
) {
  return moment(date, 'x').tz(timeZone, true).format(format);
}

export function isValidDate(date) {
  return moment(date).isValid();
}
