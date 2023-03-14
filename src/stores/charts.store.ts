import { defineStore } from 'pinia'

import { fetchWrapper } from 'src/helpers'
import { ref } from 'vue'
import { Chart } from 'src/types/artist'

const baseUrl = `${import.meta.env.VITE_API_URL}/charts`

export const useChartsStore = defineStore('charts', () => {
  // initial state
  const charts = ref<Array<Chart> | []>([])

  // actions
  const getCharts = async () => {
    try {
      charts.value = await fetchWrapper.get(baseUrl)
      return charts.value
    } catch (error: unknown) {
      console.error(error)
    }
  }

  return { charts, getCharts }
})
