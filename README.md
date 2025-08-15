# Hirealoo Coding Challenge - Portable Toilet Service Scheduler

This project demonstrates a Vue 3 component for configuring portable toilet service frequencies using Shadcn-nuxt components.

## Features

The `ServiceFrequency` component provides:

- **Predefined Frequencies**: Weekly, Fortnightly (default), Every 4 weeks, None (disabled)
- **Custom Scheduling**: Day selection, time windows, and exact time specification
- **Time Management**: 15-minute increment time selection using dropdowns
- **Mutual Exclusivity**: Time windows and exact time cannot be selected simultaneously
- **JSON Configuration**: Real-time JSON output for backend integration
- **Responsive Design**: Clean, bordered card interface using Shadcn components

## Component Structure

### Props
- `scheduleConfig` (string, optional): JSON string containing the current schedule configuration

### Events
- `update:scheduleConfig`: Emitted when the schedule configuration changes

### JSON Output Format

```json
{
  "frequency": "fortnightly",
  "custom": true,
  "days": ["mon", "wed", "fri"],
  "timeWindows": [
    {
      "start": "06:30",
      "end": "07:30"
    }
  ],
  "exactTime": "13:30"
}
```

**Note**: Day values use abbreviated format (mon, tue, wed, thu, fri, sat, sun) for consistency.

## Usage

```vue
<template>
  <ServiceFrequency 
    v-model:scheduleConfig="scheduleConfig"
    @update:scheduleConfig="handleScheduleUpdate"
  />
</template>

<script setup>
import { ref } from 'vue'
import ServiceFrequency from '~/components/ServiceFrequency.vue'

const scheduleConfig = ref('')

const handleScheduleUpdate = (newConfig) => {
  scheduleConfig.value = newConfig
  // Handle the updated configuration
}
</script>
```

## Custom Options

When "Custom" is selected, users can configure:

1. **Day Selection**: Checkboxes for Monday through Sunday (abbreviated as Mon, Tue, Wed, Thu, Fri, Sat, Sun)
2. **Time Windows**: Multiple time ranges (e.g., 06:30-07:30, 15:00-17:00)
3. **Exact Time**: Single specific time (e.g., 13:30)

**Important**: Time windows and exact time are mutually exclusive - enabling one will automatically disable the other to prevent scheduling conflicts.

## Development

### Prerequisites
- Node.js 18+
- Yarn package manager

### Setup
```bash
# Install dependencies
yarn install

# Start development server
yarn dev

# Build for production
yarn build
```

### Tech Stack
- **Framework**: Nuxt 3 with Vue 3 Composition API
- **UI Components**: Shadcn-nuxt
- **Styling**: Tailwind CSS
- **Language**: TypeScript

## Project Structure

```
app/
├── components/
│   ├── ServiceFrequency.vue    # Main component
│   └── ui/                     # Shadcn components
├── lib/
│   └── timeUtils.ts           # Time-related utilities and constants
├── pages/
│   └── index.vue              # Demo page
└── assets/
    └── css/
        └── tailwind.css       # Tailwind styles
```

## Utilities

### timeUtils.ts

Located in `app/lib/timeUtils.ts`, this utility file provides:

- **timeOptions**: Array of time slots in 15-minute intervals (00:00 to 23:45)
- **dayOptions**: Array of full weekday names
- **frequencyOptions**: Array of frequency choices
- **formatTime()**: Converts 24-hour format to 12-hour format with AM/PM
- **getTimeOptionsInRange()**: Returns time options within a specified range
- **isValidTimeFormat()**: Validates time format strings

## Running the Demo

1. Start the development server: `yarn dev`
2. Open your browser to the displayed URL (usually http://localhost:3000)
3. Interact with the ServiceFrequency component to see real-time JSON updates
4. Test different frequency options and custom configurations

The component will automatically update the JSON output as you make selections, demonstrating how the data would be sent to your backend controller.
