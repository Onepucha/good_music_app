import { api } from '@/boot/axios'
import { AxiosResponse } from 'axios'

class Global {
  getAll(query: any): Promise<AxiosResponse> {
    return api.get('/search', {
      params: query,
    })
  }

  uploadAvatar(file: any) {
    const headers = {
      'Content-Type': 'multipart/form-data',
    }

    return api.post('/file/upload', file, { headers })
  }
}

export default new Global()
