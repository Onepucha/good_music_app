export interface Options {
  label?: string
  value?: string[] | string
  description?: string
  category?: string
}

export interface CustomWindow extends Window {
  deferredPrompt?: Event | null | any
}
