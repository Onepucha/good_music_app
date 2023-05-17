export interface User {
  nickname: string
  dob: string
  avatar: string
  email: string
  fullname: string
  language_descriptor: string
  birth_date: string | Date
  gender: string
  read_terms: boolean
  _id: string
  id: string
  artists: string[] | any
  songs: string[]
  created_at: string | Date
  updated_at: string | Date
  updatedAt: string
  __v: number
  token: string
}

export interface LoginInput {
  email: string
  password: string
}

export interface UserResponse {
  status: boolean | string
  data: {
    user: User
  }
}

export interface sendCode {
  email: string
}

export interface changePassword {
  password: string
  token: string
}

export interface emailVerify {
  token: string
}

export interface SaveProfileInput {
  avatar: string
  fullname: string
  nickname: string
  birth_date: Date
}
