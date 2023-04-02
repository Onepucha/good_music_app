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
  // getFollow(query: any): Promise<Array<Artist>> {
  //   return api.get('/album/liked', {
  //     params: query,
  //   })
  // }

  setFollow(
    name: string,
    code: string,
    hasPublic: boolean,
    songs: Array<string>
  ) {
    return api.post('/playlist', {
      name,
      code,
      public: hasPublic,
      songs,
    })
  }
}

export default new Playlists()
