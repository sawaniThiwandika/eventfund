import { createContext } from 'react'
import type { User } from '../api/types'

export interface RegisterData {
  fullName: string
  email: string
  password: string
  confirmPassword: string
}

export interface AuthState {
  /** The logged-in user, or null when logged out. */
  user: User | null
  /** True while a saved token is being checked on page load. */
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  /** Creates the account, then logs the new user in. */
  register: (data: RegisterData) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthState | null>(null)
