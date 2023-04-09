import { api } from '@/boot/axios'

class Playlists {
  getAll(query: any): Promise<Array<Playlists>> {
    return api.get('/playlist/all', {
      params: query,
    })
  }

  // getInfo(query: any): Promise<Artist> {
  //   return api.get('/album/info', {
  //     params: query,
  //   })
  // }

  getLikedYour(query: any): Promise<Array<Playlists>> {
    return api.get('/playlist/own', {
      params: query,
    })
  }

  getLiked(query: any): Promise<Array<Playlists>> {
    return api.get('/playlist/liked', {
      params: query,
    })
  }

  setPlaylist({
    name,
    description,
    code,
    hasPublic,
    songs,
  }: {
    name: string
    code: string
    description?: string
    hasPublic: boolean
    songs?: Array<string>
  }) {
    return api.post('/playlist', {
      name,
      code,
      description,
      public: hasPublic,
      songs,
    })
  }
}

export default new Playlists()
