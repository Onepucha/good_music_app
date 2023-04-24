import { api } from '@/boot/axios'
import { AxiosResponse } from 'axios'
import { Song } from 'src/types/artist'

class Songs {
  getAll(query: any): Promise<AxiosResponse> {
    return api.get('/song/artist', {
      params: query,
    })
  }

  get(id: string | string[]): Promise<Song> {
    return api.get('/song/info', {
      params: {
        id,
      },
    })
  }

  getLiked(query: any): Promise<AxiosResponse> {
    return api.get('/song/liked', {
      params: query,
    })
  }

  setLiked(ids: string[], is_add_to_liked: boolean): Promise<AxiosResponse> {
    return api.post('/song/manage', {
      ids,
      is_add_to_liked,
    })
  }

  getPlaylistSongs(id: string | string[]): Promise<Song> {
    return api.get('/song/playlist', {
      params: {
        id,
      },
    })
  }
}

export default new Songs()
