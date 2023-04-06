import { api } from '@/boot/axios'
import { Artist } from 'src/types/artist'

class Artists {
  getAll(query: any): Promise<Array<Artist>> {
    return api.get('/artist/all', {
      params: query,
    })
  }

  getInfo(id: string | string[]): Promise<Artist> {
    return api.get(`/artist/info/${id}`)
  }

  getLiked(query: any): Promise<Array<Artist>> {
    return api.get('/artist/liked', {
      params: query,
    })
  }

  setFollow(ids: string[], is_follow: boolean) {
    return api.post('/artist/manage', {
      is_follow,
      ids,
    })
  }
}

export default new Artists()
