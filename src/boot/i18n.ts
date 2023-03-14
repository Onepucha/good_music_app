import { boot } from 'quasar/wrappers'
import { useAuthStore } from '@/stores'
import { createI18n } from 'vue-i18n'
import messages from 'src/i18n'

export const allLocales = [
  { title: 'Suggested' },
  { label: 'English (US)', value: 'en-US' },
  { title: 'Others' },
  { label: 'Mandarin', value: 'zh-Hant' },
  { label: 'Hindi', value: 'hi' },
  { label: 'Spanish', value: 'es-ES' },
  { label: 'French', value: 'fs' },
  { label: 'Arabic', value: 'ar' },
  { label: 'Bengali', value: 'bn' },
  { label: 'Russian', value: 'ru' },
  { label: 'Indonesia', value: 'id' },
]

export type MessageLanguages = keyof typeof messages
// Type-define 'en-US' as the master schema for the resource
export type MessageSchema = typeof messages['en-US']

// See https://vue-i18n.intlify.dev/guide/advanced/typescript.html#global-resource-schema-type-definition
/* eslint-disable @typescript-eslint/no-empty-interface */
declare module 'vue-i18n' {
  // define the locale messages schema
  export interface DefineLocaleMessage extends MessageSchema {}

  // define the datetime format schema
  export interface DefineDateTimeFormat {}

  // define the number format schema
  export interface DefineNumberFormat {}
}
/* eslint-enable @typescript-eslint/no-empty-interface */

export default boot(({ app }) => {
  const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: import.meta.env.VITE_APP_I18N_LOCALE,
    fallbackLocale: import.meta.env.VITE_APP_I18N_FALLBACK_LOCALE,
    messages,
  })

  // Set new locale.
  async function setLocale(locale: any) {
    // Load locale if not available yet.
    if (!i18n.global.availableLocales.includes(locale)) {
      const messages = await loadLocale(locale)

      // fetch() error occurred.
      if (messages === undefined) {
        return
      }

      // Add locale.
      i18n.global.setLocaleMessage(locale, messages)
    }

    // Set locale.
    i18n.global.locale.value = locale
  }

  // Fetch locale.
  function loadLocale(locale: any) {
    const authStore: any = useAuthStore()

    authStore.user.language_descriptor = locale
    return fetch(`./locales/${locale}.json`)
      .then((response) => {
        if (response.ok) {
          return response.json()
        }
        throw new Error('Something went wrong!')
      })
      .catch((error) => {
        console.error(error)
      })
  }

  // Set i18n instance on app
  app.use(i18n)
})
