import { api } from '@/boot/axios'
import { AxiosResponse } from 'axios'

class Albums {
  getAll(query: any): Promise<AxiosResponse> {
    return api.get('/album/all', {
      params: query,
    })
  }
}

export default new Albums()
