import { api } from '@/boot/axios'
import { AxiosResponse } from 'axios'

class Search {
  getAll(query: any): Promise<AxiosResponse> {
    return api.get('/search', {
      params: query,
    })
  }
}

export default new Search()
