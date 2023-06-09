import { api } from '@/boot/axios'
import { AxiosResponse } from 'axios'

class Playlists {
  getAll(query: any): Promise<Array<Playlists>> {
    return api.get('/playlist/all', {
      params: query,
    })
  }

  getInfo(query: any): Promise<Playlists> {
    return api.get('/playlist/info', {
      params: query,
    })
  }

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

  editPlaylist(id: string, query: any) {
    return api.post(`/playlist/edit/${id}`, {
      ...query,
    })
  }

  removePlaylist(id: string) {
    return api.delete(`/playlist/${id}`)
  }

  setLiked(ids: string[], is_add_to_liked: boolean): Promise<AxiosResponse> {
    return api.post('/playlist/manage', {
      ids,
      is_add_to_liked,
    })
  }
}

export default new Playlists()
