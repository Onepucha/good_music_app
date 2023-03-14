import { Notify } from 'quasar'

import { defineStore } from 'pinia'

export const useAlertStore = defineStore('notify', () => {
  // actions
  const success = (message: string) => {
    Notify.create({
      position: 'top',
      color: 'positive',
      message: message,
    })
  }

  const error = (message: string) => {
    Notify.create({
      position: 'top',
      color: 'negative',
      message: message,
    })
  }

  return { success, error }
})
