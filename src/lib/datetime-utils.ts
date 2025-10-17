/**
 * Date and Time Utility Functions
 * 
 * These utilities handle date/time formatting and parsing while preserving
 * local timezone (avoiding unwanted UTC conversions).
 */

/**
 * Formats a Date object to local ISO string (YYYY-MM-DDTHH:mm:ss)
 * without timezone conversion.
 * 
 * @param date - Date object to format
 * @returns ISO string in local timezone (e.g., "2025-10-20T20:00:00")
 */
export function formatDateToLocalISO(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`
}

/**
 * Parses an ISO datetime string and creates a Date object in local timezone.
 * Prevents timezone conversion by using Date constructor with individual components.
 * 
 * @param isoString - ISO datetime string (e.g., "2025-10-20T20:00:00")
 * @returns Date object in local timezone
 */
export function parseLocalDateTime(isoString: string): Date {
  const [datePart, timePart] = isoString.split('T')
  const [year, month, day] = datePart.split('-').map(Number)
  const [hours, minutes, seconds = 0] = timePart.split(':').map(Number)
  
  return new Date(year, month - 1, day, hours, minutes, seconds)
}

/**
 * Extracts date and time components from an ISO string or Date object
 * without timezone conversion.
 * 
 * @param dateInput - ISO string or Date object
 * @returns Object with date (YYYY-MM-DD) and time (HH:mm) strings
 */
export function extractDateTimeComponents(dateInput: string | Date): { date: string; time: string } {
  if (typeof dateInput === 'string') {
    // Parse ISO string directly
    if (dateInput.includes('T')) {
      const parts = dateInput.split('T')
      return {
        date: parts[0], // YYYY-MM-DD
        time: parts[1].slice(0, 5) // HH:mm
      }
    }
    // Fallback for non-standard format
    const dateObj = new Date(dateInput)
    return extractDateTimeComponents(dateObj)
  }
  
  // Handle Date object
  const year = dateInput.getFullYear()
  const month = String(dateInput.getMonth() + 1).padStart(2, '0')
  const day = String(dateInput.getDate()).padStart(2, '0')
  const hours = String(dateInput.getHours()).padStart(2, '0')
  const minutes = String(dateInput.getMinutes()).padStart(2, '0')
  
  return {
    date: `${year}-${month}-${day}`,
    time: `${hours}:${minutes}`
  }
}

/**
 * Formats time from 24-hour format (HH:mm) to 12-hour format with AM/PM.
 * 
 * @param time24 - Time in 24-hour format (e.g., "14:30")
 * @returns Time in 12-hour format (e.g., "2:30 PM")
 */
export function format12Hour(time24: string): string {
  const [hours, minutes] = time24.split(':').map(Number)
  const ampm = hours >= 12 ? 'PM' : 'AM'
  const displayHour = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours
  return `${displayHour}:${minutes.toString().padStart(2, '0')} ${ampm}`
}

/**
 * Converts 12-hour time format with AM/PM to 24-hour format.
 * 
 * @param time12 - Time in 12-hour format (e.g., "2:30 PM")
 * @returns Time in 24-hour format (e.g., "14:30")
 */
export function parse12HourTo24Hour(time12: string): string {
  const timeMatch = time12.match(/(\d+):(\d+)\s*(AM|PM)/i)
  if (!timeMatch) return ''
  
  let hours = parseInt(timeMatch[1])
  const minutes = timeMatch[2]
  const ampm = timeMatch[3].toUpperCase()
  
  if (ampm === 'PM' && hours !== 12) {
    hours += 12
  } else if (ampm === 'AM' && hours === 12) {
    hours = 0
  }
  
  return `${String(hours).padStart(2, '0')}:${minutes}`
}

/**
 * Creates a time range string from start and end times.
 * 
 * @param startTime - Start time in 24-hour format (e.g., "14:00")
 * @param endTime - End time in 24-hour format (e.g., "17:00")
 * @returns Formatted time range (e.g., "2:00 PM - 5:00 PM")
 */
export function formatTimeRange(startTime: string, endTime: string): string {
  return `${format12Hour(startTime)} - ${format12Hour(endTime)}`
}

/**
 * Combines separate date and time strings into an ISO datetime string.
 * 
 * @param date - Date in YYYY-MM-DD format
 * @param time - Time in HH:mm format
 * @returns ISO datetime string (e.g., "2025-10-20T14:00:00")
 */
export function combineDateAndTime(date: string, time: string): string {
  return `${date}T${time}:00`
}

/**
 * Checks if a duration string is a time range format.
 * 
 * @param duration - Duration string to check
 * @returns True if duration contains " - " (time range format)
 */
export function isTimeRange(duration: string | null | undefined): boolean {
  return Boolean(duration && duration.includes(' - '))
}

/**
 * Parses a time range string to extract start and end times.
 * 
 * @param timeRange - Time range string (e.g., "2:00 PM - 5:00 PM")
 * @returns Object with start and end times in 24-hour format, or null if invalid
 */
export function parseTimeRange(timeRange: string): { start: string; end: string } | null {
  const parts = timeRange.split(' - ')
  if (parts.length !== 2) return null
  
  const startTime = parse12HourTo24Hour(parts[0].trim())
  const endTime = parse12HourTo24Hour(parts[1].trim())
  
  if (!startTime || !endTime) return null
  
  return { start: startTime, end: endTime }
}
