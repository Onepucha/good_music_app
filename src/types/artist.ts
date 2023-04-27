export interface Artist {
  _id: string
  __v?: string
  imageUrl?: string
  name?: string
  info?: string | undefined
  monthlyListeners?: string
  code: string
  is_verified?: boolean
  song?: Array<string>
  genre?: Array<string>
  album?: Array<string>
  is_liked?: boolean
}

export interface Album {
  description_en: string
  description_ru: string
  _id: string
  __v?: string
  imageUrl?: string
  name?: string
  album?: string
  info?: string | undefined
  monthlyListeners?: string
  code: string
  is_verified?: boolean
  artists?: Array<AlbumArtist>
  songs?: Array<AlbumSong>
  genres?: Array<AlbumGenre>
  is_liked?: boolean
}

export interface AlbumArtist {
  album: Array<string>
  code: string
  genre: Array<string>
  is_verified: boolean
  name: string
  song: Array<string>
  __v: number | string
  _id: string
}

export interface AlbumSong {
  albums: Array<string>
  artists: Array<string>
  code: string
  genres: Array<string>
  label: string
  name: string
  release_date: string
  url: string
  __v: number | string
  _id: string
}

export interface AlbumGenre {
  code: string
  name: string
  __v: number | string
  _id: string
}

export interface Song {
  _id: string
  __v?: string
  imageUrl?: string
  issueYear?: string
  position?: string
  name?: string
  code?: string
  info?: string
  albums?: Array<Genre>
  genres?: Array<Genre>
  song?: Array<string>
  description?: Array<string>
  artists?: Array<Artist> | undefined
  is_verified?: boolean
  url?: RequestInfo | URL
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
  url: string
  code: string
  public: true
  songs: Array<Song>
  albums?: Array<Genre>
  genres?: Array<AlbumGenre>
  is_liked?: boolean
  info?: string[] | string | undefined
}
