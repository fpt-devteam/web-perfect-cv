import { formatDistanceToNow, format, isValid } from 'date-fns';

/**
 * Formats a UTC date string to relative time in user's local timezone
 * @param utcDateString - ISO 8601 date string in UTC
 * @returns Formatted relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (utcDateString: string): string => {
  try {
    // Parse the UTC/ISO date string and it will be automatically converted to local timezone
    const date = new Date(utcDateString);

    // Check if the date is valid
    if (!isValid(date)) {
      console.error('Invalid date string:', utcDateString);
      return 'Unknown';
    }

    // Format as relative time (e.g., "2 hours ago")
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (error) {
    console.error('Error parsing date:', error);
    return 'Unknown';
  }
};

/**
 * Formats a UTC date string to readable local date and time
 * @param utcDateString - ISO 8601 date string in UTC
 * @param formatPattern - Optional custom format pattern (defaults to 'MMM d, yyyy \'at\' h:mm a')
 * @returns Formatted local date and time
 */
export const formatLocalDateTime = (
  utcDateString: string,
  formatPattern: string = 'MMM d, yyyy \'at\' h:mm a'
): string => {
  try {
    // Parse the UTC/ISO date string and it will be automatically converted to local timezone
    const date = new Date(utcDateString);

    // Check if the date is valid
    if (!isValid(date)) {
      console.error('Invalid date string:', utcDateString);
      return 'Unknown time';
    }

    // Format as readable local date and time
    return format(date, formatPattern);
  } catch (error) {
    console.error('Error parsing date:', error);
    return 'Unknown time';
  }
};

/**
 * Formats a UTC date string to short date format
 * @param utcDateString - ISO 8601 date string in UTC
 * @returns Formatted short date (e.g., "Jan 15, 2024")
 */
export const formatShortDate = (utcDateString: string): string => {
  return formatLocalDateTime(utcDateString, 'MMM d, yyyy');
};

/**
 * Formats a UTC date string to time only
 * @param utcDateString - ISO 8601 date string in UTC
 * @returns Formatted time (e.g., "2:30 PM")
 */
export const formatTimeOnly = (utcDateString: string): string => {
  return formatLocalDateTime(utcDateString, 'h:mm a');
};

/**
 * Gets the user's timezone
 * @returns User's timezone (e.g., "America/New_York")
 */
export const getUserTimezone = (): string => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

/**
 * Gets the user's timezone offset in hours
 * @returns Timezone offset in hours (e.g., -5 for EST)
 */
export const getTimezoneOffset = (): number => {
  return -new Date().getTimezoneOffset() / 60;
};