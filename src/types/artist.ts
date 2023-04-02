export interface Artist {
  _id: string
  __v?: string
  imageUrl?: string
  name?: string
  info?: string | undefined
  monthlyListeners?: string
  code: string
  is_verified?: boolean
  song?: Array<Song> | Song
  genre?: Array<Genre> | Genre
  album?: Array<Album> | Album
  is_liked?: boolean
}

export interface Album {
  _id: string
  __v?: string
  imageUrl?: string
  name?: string
  album?: string
  info?: string | undefined
  monthlyListeners?: string
  code: string
  is_verified?: boolean
  artists?: Array<Artist>
  songs?: Array<Song>
  genres?: Array<Genre>
  is_liked?: boolean
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
  url: RequestInfo | URL
  release_data?: string
  label?: string
  title?: string
  artist?: string
  src?: string
  pic?: string
  is_liked?: boolean
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

export interface Playlists {
  _id: string
  __v?: string
  name: string
  icon?: string
  imageUrl?: string
  code: string
  public: true
  songs: Array<string>
}
