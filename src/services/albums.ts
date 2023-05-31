import { api } from '@/boot/axios'
import { AxiosResponse } from 'axios'
import { Album, Artist } from '@/types/artist'

class Albums {
  getAll(query: any): Promise<AxiosResponse> {
    return api.get('/album/all', {
      params: query,
    })
  }

  getInfo(query: any): Promise<Album> {
    return api.get('/album/info', {
      params: query,
    })
  }

  getLiked(query: any): Promise<Array<Artist>> {
    return api.get('/album/liked', {
      params: query,
    })
  }

  setFollow(ids: string[], follow: boolean) {
    return api.post('/album/manage', {
      ids,
      follow,
    })
  }
}

export default new Albums()
