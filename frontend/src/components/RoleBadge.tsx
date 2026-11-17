import type { EventRole } from '../api/types'

const styles: Record<EventRole, string> = {
  OWNER: 'bg-blue-600 text-white ring-blue-600',
  EDITOR: 'bg-sky-50 text-sky-700 ring-sky-200',
  VIEWER: 'bg-slate-50 text-slate-600 ring-slate-200',
}

const labels: Record<EventRole, string> = {
  OWNER: 'Owner',
  EDITOR: 'Editor',
  VIEWER: 'Viewer',
}

export function RoleBadge({ role }: { role: EventRole }) {
  return (
    <span className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${styles[role]}`}>
      {labels[role]}
    </span>
  )
}
