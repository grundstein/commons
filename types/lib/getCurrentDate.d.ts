export function getCurrentDate(date?: Date): FormattedDate
export type FormattedDate = {
  /**
   * - Formatted date string (YYYY/MM/DD)
   */
  date: string
  /**
   * - Formatted time string (HH:MM:SS:mmm)
   */
  time: string
}
