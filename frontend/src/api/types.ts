export interface User {
  id: number
  fullName: string
  email: string
}

export interface LoginResponse {
  token: string
  tokenType: string
  expiresAt: string
  user: User
}
