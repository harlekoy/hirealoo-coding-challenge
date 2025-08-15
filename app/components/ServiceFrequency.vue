<template>
  <div class="w-full max-w-2xl mx-auto">
    <!-- Main Frequency Selection Card -->
    <Card class="w-full">
      <CardHeader>
        <CardTitle>Service Frequency</CardTitle>
        <CardDescription>
          Select how often the portable toilet should be serviced
        </CardDescription>
      </CardHeader>
      <CardContent class="space-y-6">
        <!-- Frequency Options -->
        <div class="space-y-3">
          <RadioGroup v-model="selectedFrequency" @update:model-value="handleFrequencyChange">
            <div class="space-y-3">
              <div class="flex items-center space-x-2">
                <RadioGroupItem value="weekly" id="weekly" />
                <Label for="weekly">Weekly</Label>
              </div>
              <div class="flex items-center space-x-2">
                <RadioGroupItem value="fortnightly" id="fortnightly" />
                <Label for="fortnightly">Fortnightly (every 2 weeks)</Label>
              </div>
              <div class="flex items-center space-x-2">
                <RadioGroupItem value="monthly" id="monthly" />
                <Label for="monthly">Every 4 weeks</Label>
              </div>
              <div class="flex items-center space-x-2">
                <RadioGroupItem value="none" id="none" disabled />
                <Label for="none" class="text-muted-foreground">None</Label>
              </div>
              <div class="flex items-center space-x-2">
                <Checkbox 
                  id="custom" 
                  v-model="isCustomEnabled"
                  @click="handleCustomToggle"
                />
                <Label for="custom">Custom</Label>
              </div>
            </div>
          </RadioGroup>
        </div>

        <!-- Custom Options Section -->
        <div v-if="isCustomEnabled" class="space-y-6 border-t pt-6">
          <div class="space-y-4">
            <h4 class="text-sm font-medium">Custom Schedule Options</h4>
            
            <!-- Day Selection -->
            <div class="space-y-3">
              <Label class="text-sm font-medium">Select Days</Label>
              <div class="grid grid-cols-7 gap-2">
                <div v-for="day in weekDays" :key="day.value" class="flex flex-col items-center space-y-2">
                  <Checkbox 
                    :id="day.value" 
                    :checked="selectedDays.includes(day.value)"
                    @click="() => toggleDay(day.value)"
                  />
                  <Label :for="day.value" class="text-xs">{{ day.label }}</Label>
                </div>
              </div>
            </div>

            <!-- Time Window Option -->
            <div class="space-y-3">
              <div class="flex items-center space-x-2">
                <Checkbox 
                  id="timeWindow" 
                  :modelValue="isTimeWindowEnabled"
                  @update:modelValue="handleTimeWindowToggle"
                />
                <Label for="timeWindow">Specify time window(s)</Label>
              </div>
              
              <div v-if="isTimeWindowEnabled" class="space-y-3 pl-6">
                <div class="space-y-2">
                  <Label class="text-sm">Time Windows</Label>
                  <div v-for="(window, index) in timeWindows" :key="index" class="flex items-center space-x-2">
                    <Select v-model="window.start" @update:model-value="updateTimeWindow">
                      <SelectTrigger class="w-32">
                        <SelectValue :placeholder="'Start'" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem v-for="time in timeOptions" :key="time" :value="time">
                          {{ time }}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <span class="text-sm">to</span>
                    <Select v-model="window.end" @update:model-value="updateTimeWindow">
                      <SelectTrigger class="w-32">
                        <SelectValue :placeholder="'End'" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem v-for="time in timeOptions" :key="time" :value="time">
                          {{ time }}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      @click="removeTimeWindow(index)"
                      class="h-8 w-8 p-0"
                    >
                      <X class="h-4 w-4" />
                    </Button>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    @click="addTimeWindow"
                    class="w-full"
                  >
                    Add Time Window
                  </Button>
                </div>
              </div>
            </div>

            <!-- Exact Time Option -->
            <div class="space-y-3">
              <div class="flex items-center space-x-2">
                <Checkbox 
                  id="exactTime" 
                  :modelValue="isExactTimeEnabled"
                  @update:modelValue="handleExactTimeToggle"
                />
                <Label for="exactTime">Set exact time</Label>
              </div>
              
              <div v-if="isExactTimeEnabled" class="pl-6">
                <Select v-model="exactTime" @update:model-value="updateExactTime">
                  <SelectTrigger class="w-32">
                    <SelectValue :placeholder="'Select time'" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="time in timeOptions" :key="time" :value="time">
                      {{ time }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- JSON Output Display -->
    <Card class="w-full mt-6">
      <CardHeader>
        <CardTitle>Schedule Configuration (JSON)</CardTitle>
        <CardDescription>
          This is what will be sent to the controller for persistence
        </CardDescription>
      </CardHeader>
      <CardContent>
        <pre class="bg-gray-100 p-4 rounded-md text-sm overflow-x-auto">{{ scheduleConfigJson }}</pre>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { X } from 'lucide-vue-next'
import { timeOptions, dayOptions, frequencyOptions } from '../lib/timeUtils'

// Props
interface Props {
  scheduleConfig?: string
}

const props = withDefaults(defineProps<Props>(), {
  scheduleConfig: ''
})

// Emits
const emit = defineEmits<{
  'update:scheduleConfig': [value: string]
}>()

// Reactive state
const selectedFrequency = ref('fortnightly')
const isCustomEnabled = ref(false)
const selectedDays = ref<string[]>([])
const isTimeWindowEnabled = ref(false)
const isExactTimeEnabled = ref(false)
const timeWindows = ref<Array<{ start: string; end: string }>>([])
const exactTime = ref('')

// Constants
const weekDays = [
  { value: 'mon', label: 'Mon' },
  { value: 'tue', label: 'Tue' },
  { value: 'wed', label: 'Wed' },
  { value: 'thu', label: 'Thu' },
  { value: 'fri', label: 'Fri' },
  { value: 'sat', label: 'Sat' },
  { value: 'sun', label: 'Sun' }
]

// Computed
const scheduleConfigJson = computed(() => {
  const config: any = {
    frequency: selectedFrequency.value,
    custom: isCustomEnabled.value
  }

  if (isCustomEnabled.value) {
    if (selectedDays.value.length > 0) {
      config.days = selectedDays.value
    }
    
    if (isTimeWindowEnabled.value && timeWindows.value.length > 0) {
      config.timeWindows = timeWindows.value
    }
    
    if (isExactTimeEnabled.value && exactTime.value) {
      config.exactTime = exactTime.value
    }
  }

  return JSON.stringify(config, null, 2)
})

// Methods
const handleFrequencyChange = (value: string) => {
  selectedFrequency.value = value
  updateScheduleConfig()
}

const handleCustomToggle = () => {
  if (!isCustomEnabled.value) {
    // Reset custom options when custom is disabled
    selectedDays.value = []
    isTimeWindowEnabled.value = false
    isExactTimeEnabled.value = false
    timeWindows.value = []
    exactTime.value = ''
  }
  updateScheduleConfig()
}

const toggleDay = (day: string) => {
  if (selectedDays.value.includes(day)) {
    selectedDays.value = selectedDays.value.filter(d => d !== day)
  } else {
    selectedDays.value.push(day)
  }
  updateScheduleConfig()
}

const handleTimeWindowToggle = (checked) => {
  isTimeWindowEnabled.value = checked

  if (!checked) {
    timeWindows.value = []
  } else {
    // Disable exact time if time window is enabled
    isExactTimeEnabled.value = false
    exactTime.value = ''

    if (timeWindows.value.length === 0) {
      addTimeWindow()
    }
  }
  updateScheduleConfig()
}

const handleExactTimeToggle = (checked) => {
  isExactTimeEnabled.value = checked

  if (!checked) {
    exactTime.value = ''
  } else {
    // Disable time window if exact time is enabled
    isTimeWindowEnabled.value = false
    timeWindows.value = []
  }
  updateScheduleConfig()
}

const addTimeWindow = () => {
  timeWindows.value.push({ start: '', end: '' })
}

const removeTimeWindow = (index: number) => {
  timeWindows.value.splice(index, 1)
  updateScheduleConfig()
}

const updateTimeWindow = () => {
  updateScheduleConfig()
}

const updateExactTime = () => {
  updateScheduleConfig()
}

const updateScheduleConfig = () => {
  emit('update:scheduleConfig', scheduleConfigJson.value)
}

const parseScheduleConfig = (configString: string) => {
  if (!configString) return

  try {
    const config = JSON.parse(configString)
    
    if (config.frequency) {
      selectedFrequency.value = config.frequency
    }
    
    if (config.custom) {
      isCustomEnabled.value = true
      
      if (config.days) {
        selectedDays.value = config.days
      }
      
      if (config.timeWindows && config.timeWindows.length > 0) {
        isTimeWindowEnabled.value = true
        timeWindows.value = config.timeWindows
      }
      
      if (config.exactTime) {
        isExactTimeEnabled.value = true
        exactTime.value = config.exactTime
      }
    }
  } catch (error) {
    console.error('Error parsing schedule config:', error)
  }
}

// Lifecycle
onMounted(() => {
  parseScheduleConfig(props.scheduleConfig)
})

// Watch for prop changes
watch(() => props.scheduleConfig, (newValue) => {
  parseScheduleConfig(newValue)
}, { immediate: true })
</script>
