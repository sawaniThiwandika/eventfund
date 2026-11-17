import { useCallback, useEffect, useState } from 'react'
import { Link, Navigate, NavLink, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import { ApiError } from '../api/client'
import { deleteEvent, getEvent } from '../api/events'
import type { EventItem } from '../api/types'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { NotFoundState } from '../components/NotFoundState'
import { RoleBadge } from '../components/RoleBadge'
import { formatLongDate } from '../lib/dates'

const tabs = [
  {
    path: 'dashboard',
    label: 'Dashboard',
    icon: 'M4 5a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10-3a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1v-7z',
    text: 'Total income, total expenses, balance, a chart and recent records.',
  },
  {
    path: 'income',
    label: 'Income',
    icon: 'M7 11l5-5m0 0l5 5m-5-5v12',
    text: 'Income records for this event, with optional slips.',
  },
  {
    path: 'expenses',
    label: 'Expenses',
    icon: 'M17 13l-5 5m0 0l-5-5m5 5V6',
    text: 'Expense records for this event, with optional bills or slips.',
  },
  {
    path: 'members',
    label: 'Members',
    icon: 'M17 20h5v-2a3 3 0 00-5.36-1.86M17 20H7m10 0v-2c0-.66-.13-1.28-.36-1.86M7 20H2v-2a3 3 0 015.36-1.86M7 20v-2c0-.66.13-1.28.36-1.86m0 0a5 5 0 019.28 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
    text: 'People in this event and their roles, plus invitations.',
  },
  {
    path: 'reports',
    label: 'Reports',
    icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.59a1 1 0 01.7.29l5.42 5.42a1 1 0 01.29.7V19a2 2 0 01-2 2z',
    text: 'Financial reports with a date filter, downloadable as PDF.',
  },
]

function Icon({ d, className = 'h-4 w-4' }: { d: string; className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
  )
}

/** Event page at /events/:id, with tabs at /events/:id/<tab>. */
export function EventPage() {
  const { id = '' } = useParams()
  // The key gives each event a fresh state when moving between events.
  return <EventView key={id} id={id} />
}

function EventView({ id }: { id: string }) {
  const navigate = useNavigate()

  const [event, setEvent] = useState<EventItem | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  useEffect(() => {
    getEvent(id)
      .then(setEvent)
      .catch((err) => {
        // 404 = not a member (or no such event). 400 = id is not a number.
        if (err instanceof ApiError && (err.status === 404 || err.status === 400)) {
          setNotFound(true)
        } else {
          setError(err instanceof ApiError ? err.message : 'Could not load the event.')
        }
      })
  }, [id])

  const closeConfirm = useCallback(() => {
    setConfirmOpen(false)
    setDeleteError(null)
  }, [])

  async function handleDelete() {
    setDeleting(true)
    setDeleteError(null)
    try {
      await deleteEvent(id)
      navigate('/events', { replace: true })
    } catch (err) {
      setDeleteError(err instanceof ApiError ? err.message : 'Could not delete the event.')
      setDeleting(false)
    }
  }

  if (notFound) {
    return <NotFoundState />
  }
  if (error) {
    return (
      <p role="alert" className="alert-error">
        {error}
      </p>
    )
  }
  if (!event) {
    return (
      <div className="space-y-6" aria-label="Loading event">
        <div className="h-48 animate-pulse rounded-3xl bg-blue-100/60" />
        <div className="h-12 animate-pulse rounded-2xl bg-white" />
        <div className="h-64 animate-pulse rounded-2xl bg-white" />
      </div>
    )
  }

  const isOwner = event.myRole === 'OWNER'

  return (
    <div>
      <Link to="/events" className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-blue-700">
        ← Back to My Events
      </Link>

      {/* Header */}
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#0a1a6b] via-blue-700 to-sky-500 p-6 text-white shadow-xl shadow-blue-900/15 sm:p-8">
        <div aria-hidden="true" className="bg-grid-light absolute inset-0 [mask-image:linear-gradient(to_left,black,transparent)]" />
        <div aria-hidden="true" className="absolute -top-20 -right-16 h-64 w-64 rounded-full bg-sky-300/25 blur-2xl" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <RoleBadge role={event.myRole} />
              <span className="text-xs text-blue-100">Owner: {event.ownerName}</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight break-words sm:text-3xl lg:text-4xl">{event.name}</h1>
            <div className="mt-3 flex flex-col gap-1.5 text-sm text-blue-100 sm:flex-row sm:flex-wrap sm:gap-x-6">
              <span className="flex items-center gap-2">
                <Icon d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                {formatLongDate(event.eventDate)}
              </span>
              {event.location && (
                <span className="flex items-center gap-2">
                  <Icon d="M17.66 16.66L13.41 20.9a2 2 0 01-2.83 0l-4.24-4.24a8 8 0 1111.32 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  {event.location}
                </span>
              )}
            </div>
            {event.description && <p className="mt-4 max-w-3xl text-sm whitespace-pre-line text-blue-50 sm:text-base">{event.description}</p>}
          </div>

          {isOwner && (
            <div className="flex shrink-0 gap-2">
              <Link
                to={`/events/${event.id}/edit`}
                className="inline-flex items-center gap-2 rounded-lg bg-white/15 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/30 backdrop-blur transition hover:bg-white/25"
              >
                <Icon d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.41-9.41a2 2 0 112.83 2.83L11.83 15H9v-2.83l8.59-8.58z" />
                Edit
              </Link>
              <button
                type="button"
                onClick={() => setConfirmOpen(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-red-600 shadow-sm transition hover:bg-red-50"
              >
                <Icon d="M19 7l-.87 12.14A2 2 0 0116.13 21H7.87a2 2 0 01-2-1.86L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                Delete
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Tabs */}
      <nav aria-label="Event sections" className="mt-6 overflow-x-auto rounded-2xl bg-white p-1.5 shadow-sm ring-1 ring-slate-200/70">
        <ul className="flex min-w-max gap-1">
          {tabs.map((tab) => (
            <li key={tab.path} className="flex-1">
              <NavLink
                to={tab.path}
                className={({ isActive }) =>
                  `flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold whitespace-nowrap transition ${
                    isActive
                      ? 'bg-linear-to-r from-blue-600 to-sky-500 text-white shadow-md shadow-blue-600/25'
                      : 'text-slate-600 hover:bg-blue-50 hover:text-blue-700'
                  }`
                }
              >
                <Icon d={tab.icon} />
                {tab.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-6">
        <Routes>
          <Route index element={<Navigate to="dashboard" replace />} />
          {tabs.map((tab) => (
            <Route key={tab.path} path={tab.path} element={<TabPlaceholder label={tab.label} icon={tab.icon} text={tab.text} />} />
          ))}
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Routes>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete this event?"
        message={`"${event.name}" and all of its members, income, expenses and invitations will be permanently deleted. This cannot be undone.`}
        confirmLabel="Delete Event"
        busy={deleting}
        error={deleteError}
        onConfirm={handleDelete}
        onCancel={closeConfirm}
      />
    </div>
  )
}

function TabPlaceholder({ label, icon, text }: { label: string; icon: string; text: string }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-blue-300/70 bg-white/70 px-6 py-14 text-center backdrop-blur">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 ring-1 ring-blue-100">
        <Icon d={icon} className="h-6 w-6" />
      </div>
      <h2 className="text-lg font-semibold text-slate-800">{label}</h2>
      <p className="mt-1 max-w-md text-sm text-slate-500">{text}</p>
      <span className="mt-4 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">Coming soon</span>
    </div>
  )
}
