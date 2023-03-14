import { api } from '@/boot/axios'
import { AxiosResponse } from 'axios'

class Songs {
  getAll(query: any): Promise<AxiosResponse> {
    return api.get('/song/artist', {
      params: query,
    })
  }

  get(id: string | string[]): Promise<AxiosResponse> {
    return api.get('/song/info', {
      params: {
        id,
      },
    })
  }
}

export default new Songs()
