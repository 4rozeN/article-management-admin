import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTotalStore = defineStore('admin-total', () => {
  const total = ref(99)

  const increment = () => {
    total.value++
  }
  const decrement = () => {
    total.value--
  }

  return {
    total,
    increment,
    decrement
  }
})
