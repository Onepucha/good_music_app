export interface Artist {
  _id: string
  __v?: string
  imageUrl?: string
  name?: string
  album?: string
  info?: string | undefined
  monthlyListeners?: string
  code: string
  is_verified?: boolean
  song?: Array<Song> | Song
  genre?: Array<Genre> | Genre
}

export interface Song {
  _id: string
  __v?: string
  imageUrl?: string
  issueYear?: string
  position?: string
  name?: string
  code: string
  info?: string
  albums?: Array<Genre>
  genres?: Array<Genre>
  song?: Array<string>
  description?: Array<string>
  artists?: Array<string> | string | undefined
  is_verified?: boolean
  url?: string
  release_data?: string
  label?: string
  title?: string
  artist?: string
  src?: string
  pic?: string
}

export interface Genre {
  _id: string
  __v?: string
  name: string
  code: string
}

export interface Chart {
  _id: string
  __v?: number
  name: string
  description: string
  code: string
  imageUrl?: string
  info?: string[] | string | undefined
}
