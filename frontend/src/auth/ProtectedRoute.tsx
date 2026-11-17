import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './useAuth'

/** Shows its children only to logged-in users; everyone else is sent to /login. */
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex justify-center py-16" role="status" aria-label="Loading">
        <span className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
      </div>
    )
  }
  if (!user) {
    // Remember where the user wanted to go, so login can send them back there.
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }
  return children
}
