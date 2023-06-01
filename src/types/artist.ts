export interface Artist {
  _id: string
  __v?: string | number
  cover_src?: string
  album_code?: string
  name?: string
  info?: string | undefined
  monthlyListeners?: string
  code: string
  is_verified?: boolean
  song?: Array<string> | undefined
  genre?: Array<string> | undefined
  album?: Array<string> | undefined
  is_liked?: boolean
}

export interface Album {
  description_en: string
  description_ru: string
  _id: string
  old_id?: string
  __v?: string | number
  cover_src?: string
  album_code?: string
  name?: string
  album?: string
  info?: string | undefined
  monthlyListeners?: string
  code: string
  is_verified?: boolean
  release_date?: string
  artists?: Array<Artist> | undefined
  songs?: Array<Song> | Array<string> | undefined
  genres?: Array<Genre>
  is_liked?: boolean
}

export interface Song {
  _id: string
  __v?: string | number
  cover_src?: string
  pic?: string
  album_code?: string
  release_date?: string
  issueYear?: string
  position?: string
  name?: string
  code?: string
  info?: string
  albums?: Array<Album> | Array<string> | undefined
  genres?: Array<Genre> | Array<string> | undefined
  song?: Array<string>
  description?: Array<string>
  artists?: Array<Artist> | Array<string> | undefined
  is_verified?: boolean
  url?: string
  release_data?: string
  label?: string
  title?: string
  artist?: Artist
  src?: string
  is_liked?: boolean
  duration?: number | null
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
  cover_src?: string
  album_code?: string
  info?: string[] | string | undefined
}

export interface Playlists {
  _id: string
  __v?: string | number
  user: string
  name: string
  icon?: string
  cover_src?: string
  album_code?: string
  url: string
  href: string
  code: string
  public: true
  description: string
  songs: Array<Song> | Array<string> | string
  albums?: Array<Album>
  genres?: Array<Genre>
  is_liked?: boolean
  is_own?: boolean
  info?: string[] | string | undefined
}
