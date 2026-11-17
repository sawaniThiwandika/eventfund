export function EventsPage() {
  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">My Events</h1>
        <p className="mt-1 text-sm text-slate-500 sm:text-base">View and manage the events you own or collaborate on.</p>
      </div>

      <div className="flex flex-col items-center rounded-3xl border border-dashed border-blue-300/70 bg-white/70 px-6 py-12 text-center shadow-sm backdrop-blur sm:py-16 lg:py-20">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-blue-600 to-sky-400 text-white shadow-lg shadow-blue-600/30 ring-8 ring-blue-50">
          <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-slate-800">No events yet</h2>
        <p className="mt-1 max-w-sm text-sm text-slate-500">Events you create or are invited to will appear here.</p>
      </div>
    </div>
  )
}
