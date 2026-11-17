import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ApiError } from '../api/client'
import { listEvents } from '../api/events'
import type { EventItem } from '../api/types'
import { RoleBadge } from '../components/RoleBadge'
import { dateParts, formatDate } from '../lib/dates'

const plusIcon = 'M12 4v16m8-8H4'
const pinIcon = 'M17.66 16.66L13.41 20.9a2 2 0 01-2.83 0l-4.24-4.24a8 8 0 1111.32 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z'

function Icon({ d, className = 'h-4 w-4' }: { d: string; className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
  )
}

export function EventsPage() {
  const [events, setEvents] = useState<EventItem[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    listEvents()
      .then(setEvents)
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Could not load your events.'))
  }, [])

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">My Events</h1>
          <p className="mt-1 text-sm text-slate-500 sm:text-base">View and manage the events you own or collaborate on.</p>
        </div>
        {events && events.length > 0 && (
          <Link to="/events/new" className="btn-primary self-start sm:self-auto">
            <Icon d={plusIcon} />
            Create Event
          </Link>
        )}
      </div>

      {error && (
        <p role="alert" className="alert-error">
          {error}
        </p>
      )}

      {!events && !error && <CardSkeletons />}

      {events && events.length === 0 && <EmptyState />}

      {events && events.length > 0 && (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {events.map((event) => (
            <li key={event.id}>
              <EventCard event={event} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function EventCard({ event }: { event: EventItem }) {
  const { day, month } = dateParts(event.eventDate)
  return (
    <Link
      to={`/events/${event.id}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-900/10 hover:ring-blue-300 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
    >
      <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-blue-700 via-blue-500 to-sky-400" />

      <div className="flex items-start gap-4">
        <div className="flex w-14 shrink-0 flex-col items-center rounded-xl bg-blue-50 py-2 ring-1 ring-blue-100">
          <span className="text-xs font-semibold tracking-wide text-blue-600 uppercase">{month}</span>
          <span className="text-2xl leading-tight font-bold text-slate-900">{day}</span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h2 className="truncate text-base font-semibold text-slate-900 transition group-hover:text-blue-700">{event.name}</h2>
            <RoleBadge role={event.myRole} />
          </div>
          <p className="mt-0.5 text-sm text-slate-500">{formatDate(event.eventDate)}</p>
          {event.location && (
            <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
              <Icon d={pinIcon} className="h-3.5 w-3.5 shrink-0 text-slate-400" />
              <span className="truncate">{event.location}</span>
            </p>
          )}
        </div>
      </div>

      {event.description && <p className="mt-4 line-clamp-2 text-sm text-slate-600">{event.description}</p>}

      <div className="flex-1" />
      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500">
        <span className="truncate">Owner: {event.ownerName}</span>
        <span className="font-semibold text-blue-600 transition group-hover:translate-x-0.5">Open →</span>
      </div>
    </Link>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center rounded-3xl border border-dashed border-blue-300/70 bg-white/70 px-6 py-12 text-center shadow-sm backdrop-blur sm:py-16 lg:py-20">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-blue-600 to-sky-400 text-white shadow-lg shadow-blue-600/30 ring-8 ring-blue-50">
        <Icon d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" className="h-7 w-7" />
      </div>
      <h2 className="text-lg font-semibold text-slate-800">No events yet</h2>
      <p className="mt-1 max-w-sm text-sm text-slate-500">
        Create your first event to start tracking its income and expenses. Events you are invited to will also appear here.
      </p>
      <Link to="/events/new" className="btn-primary mt-6">
        <Icon d={plusIcon} />
        Create Event
      </Link>
    </div>
  )
}

function CardSkeletons() {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6" aria-label="Loading events">
      {[0, 1, 2].map((i) => (
        <li key={i} className="h-44 animate-pulse rounded-2xl bg-white p-5 ring-1 ring-slate-200/70">
          <div className="flex gap-4">
            <div className="h-16 w-14 rounded-xl bg-slate-100" />
            <div className="flex-1 space-y-2 pt-1">
              <div className="h-4 w-3/4 rounded bg-slate-100" />
              <div className="h-3 w-1/2 rounded bg-slate-100" />
            </div>
          </div>
          <div className="mt-6 h-3 w-full rounded bg-slate-100" />
        </li>
      ))}
    </ul>
  )
}
