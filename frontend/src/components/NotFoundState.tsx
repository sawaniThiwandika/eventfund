import { Link } from 'react-router-dom'

/** Shown when an event does not exist or the user is not allowed to see it. */
export function NotFoundState() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center rounded-3xl bg-white px-6 py-14 text-center shadow-sm ring-1 ring-slate-200/70">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 ring-8 ring-blue-50/50">
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
        </svg>
      </div>
      <h1 className="text-xl font-bold text-slate-900">Event not found</h1>
      <p className="mt-2 max-w-sm text-sm text-slate-500">
        This event does not exist, or you do not have access to it. Ask the event owner to invite you.
      </p>
      <Link to="/events" className="btn-primary mt-6">
        Back to My Events
      </Link>
    </div>
  )
}
