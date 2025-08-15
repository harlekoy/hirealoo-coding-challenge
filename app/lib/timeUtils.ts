export const timeOptions = [
  '00:00', '00:15', '00:30', '00:45',
  '01:00', '01:15', '01:30', '01:45',
  '02:00', '02:15', '02:30', '02:45',
  '03:00', '03:15', '03:30', '03:45',
  '04:00', '04:15', '04:30', '04:45',
  '05:00', '05:15', '05:30', '05:45',
  '06:00', '06:15', '06:30', '06:45',
  '07:00', '07:15', '07:30', '07:45',
  '08:00', '08:15', '08:30', '08:45',
  '09:00', '09:15', '09:30', '09:45',
  '10:00', '10:15', '10:30', '10:45',
  '11:00', '11:15', '11:30', '11:45',
  '12:00', '12:15', '12:30', '12:45',
  '13:00', '13:15', '13:30', '13:45',
  '14:00', '14:15', '14:30', '14:45',
  '15:00', '15:15', '15:30', '15:45',
  '16:00', '16:15', '16:30', '16:45',
  '17:00', '17:15', '17:30', '17:45',
  '18:00', '18:15', '18:30', '18:45',
  '19:00', '19:15', '19:30', '19:45',
  '20:00', '20:15', '20:30', '20:45',
  '21:00', '21:15', '21:30', '21:45',
  '22:00', '22:15', '22:30', '22:45',
  '23:00', '23:15', '23:30', '23:45'
]

export const dayOptions = [
  'Monday',
  'Tuesday', 
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
]

export const frequencyOptions = [
  'Daily',
  'Weekly',
  'Monthly',
  'Custom'
]

// Helper function to format time for display
export const formatTime = (time: string): string => {
  if (!time) return ''
  
  const [hours, minutes] = time.split(':')
  const hour = parseInt(hours)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
  
  return `${displayHour}:${minutes} ${ampm}`
}

// Helper function to get time options within a range
export const getTimeOptionsInRange = (startTime: string, endTime: string): string[] => {
  const startIndex = timeOptions.indexOf(startTime)
  const endIndex = timeOptions.indexOf(endTime)
  
  if (startIndex === -1 || endIndex === -1) return []
  
  return timeOptions.slice(startIndex, endIndex + 1)
}

// Helper function to validate time format
export const isValidTimeFormat = (time: string): boolean => {
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
  return timeRegex.test(time)
}
