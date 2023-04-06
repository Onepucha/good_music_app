import { api } from '@/boot/axios'

class Playlists {
  // getAll(query: any): Promise<AxiosResponse> {
  //   return api.get('/album/all', {
  //     params: query,
  //   })
  // }
  //
  // getInfo(query: any): Promise<Artist> {
  //   return api.get('/album/info', {
  //     params: query,
  //   })
  // }
  //
  // getLiked(query: any): Promise<Array<Artist>> {
  //   return api.get('/album/liked', {
  //     params: query,
  //   })
  // }

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
