export interface Options {
  label?: string
  value?: string[] | string
  description?: string
  category?: string
}

export interface ItemPlan {
  _id: string | number
  href?: string
  price?: string
  quantityMonths?: number
  list: Array<string>
}

export interface Payment {
  value: string
  label: string
}

export interface Stat {
  duration: number
  loadedTime: number
  playedTime: number
}

export interface CustomWindow extends Window {
  deferredPrompt?: Event | null | any
}

export interface CropperInstance {
  getCroppedCanvas(options?: Cropper.GetCroppedCanvasOptions): HTMLCanvasElement

  destroy(): void

  reset(): void

  rotate(degree: number): void
}

export interface Comment {
  _id: string
  text: string
  user?: string
  nickname?: string
  replies: Comment[]
  createdAt?: string
}
