import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'
import { Logo } from './Logo'

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('')
}

export function Navbar() {
  const { user, loading, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-20 px-3 pt-3 sm:px-6 lg:px-8">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 rounded-2xl bg-white/70 px-3 shadow-lg shadow-blue-900/5 ring-1 ring-slate-200/70 backdrop-blur-xl sm:px-5">
        <Link to="/" className="shrink-0" aria-label="EventFund home">
          <Logo />
        </Link>

        {loading ? null : user ? (
          <div className="flex min-w-0 items-center gap-2 sm:gap-4">
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-blue-100 to-sky-100 text-sm font-bold text-blue-700 ring-2 ring-white">
                {initials(user.fullName)}
              </span>
              <div className="hidden min-w-0 leading-tight md:block">
                <p className="truncate text-sm font-semibold text-slate-800">{user.fullName}</p>
                <p className="truncate text-xs text-slate-500">{user.email}</p>
              </div>
            </div>
            <button type="button" onClick={handleLogout} className="btn-secondary px-2.5 sm:px-4" aria-label="Sign out">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-1 sm:gap-2">
            <Link to="/login" className="btn-ghost px-3 sm:px-4">
              Sign in
            </Link>
            <Link to="/register" className="btn-primary px-3 py-2 sm:px-4">
              Get started
            </Link>
          </div>
        )}
      </nav>
    </header>
  )
}
