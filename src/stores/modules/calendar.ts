import { defineStore } from 'pinia'
import { ref } from 'vue'

// 定义 Store
export const useCalendarStore = defineStore(
  'calendar',
  () => {
    const activeDate = ref<string>()

    const setActiveDate = (val: string) => {
      activeDate.value = val
    }

    return {
      activeDate,
      setActiveDate,
    }
  }
)