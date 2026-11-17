import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { api, getToken, setToken, setUnauthorizedHandler } from '../api/client'
import type { LoginResponse, User } from '../api/types'
import { AuthContext, type RegisterData } from './AuthContext'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  // If a token was saved earlier, we must check it before deciding if the user is logged in.
  const [loading, setLoading] = useState(() => getToken() !== null)

  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
  }, [])

  // Log out automatically when the backend says the token is no longer valid.
  useEffect(() => {
    setUnauthorizedHandler(logout)
    return () => setUnauthorizedHandler(null)
  }, [logout])

  // On page load: turn a saved token back into a logged-in user.
  useEffect(() => {
    if (!getToken()) {
      return
    }
    api<User>('/users/me')
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const response = await api<LoginResponse>('/auth/login', {
      method: 'POST',
      body: { email, password },
    })
    setToken(response.token)
    setUser(response.user)
  }, [])

  const register = useCallback(
    async (data: RegisterData) => {
      await api<User>('/auth/register', { method: 'POST', body: data })
      await login(data.email, data.password)
    },
    [login],
  )

  const value = useMemo(
    () => ({ user, loading, login, register, logout }),
    [user, loading, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
