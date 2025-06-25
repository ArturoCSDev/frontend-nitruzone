/**
 * Formats a date string or timestamp into a human-readable format
 * @param dateInput - Date input (timestamp, ISO string, or Date object)
 * @param options - Optional formatting options
 * @returns Formatted date string
 */
export const formatDate = (
  dateInput?: string | number | Date | null,
  options: Intl.DateTimeFormatOptions = {}
): string => {
  // If no date is provided, return an empty string
  if (!dateInput) return "";

  // Create a date object
  const date = new Date(dateInput);

  // Check if the date is valid
  if (isNaN(date.getTime())) return "";

  // Default options if not provided
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  // Merge default options with user-provided options
  const mergedOptions = { ...defaultOptions, ...options };

  try {
    // Use Intl.DateTimeFormat for localized formatting
    return new Intl.DateTimeFormat("es-ES", mergedOptions).format(date);
  } catch (error) {
    console.log(error);
    // Fallback to a simple date string if formatting fails
    return date.toLocaleDateString("es-ES");
  }
};

/**
 * Additional utility for more specific date formatting scenarios
 */
export const dateUtils = {
  /**
   * Format date with time
   * @param dateInput - Date to format
   * @returns Date with time in local format
   */
  formatDateTime: (dateInput?: string | number | Date | null) =>
    formatDate(dateInput, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),

  /**
   * Format date as short version (DD/MM/YYYY)
   * @param dateInput - Date to format
   * @returns Short date format
   */
  formatShortDate: (dateInput?: string | number | Date | null) =>
    formatDate(dateInput, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }),

  /**
   * Check if a date is valid
   * @param dateInput - Date to validate
   * @returns Boolean indicating date validity
   */
  isValidDate: (dateInput?: string | number | Date | null): boolean => {
    if (!dateInput) return false;
    const date = new Date(dateInput);
    return !isNaN(date.getTime());
  },
};
