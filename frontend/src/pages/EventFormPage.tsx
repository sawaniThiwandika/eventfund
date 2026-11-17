import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ApiError } from '../api/client'
import { createEvent, getEvent, updateEvent } from '../api/events'
import type { EventInput } from '../api/types'
import { NotFoundState } from '../components/NotFoundState'

const emptyForm: EventInput = { name: '', description: '', eventDate: '', location: '' }

/** Create Event (/events/new) and Edit Event (/events/:id/edit). */
export function EventFormPage() {
  const { id } = useParams()
  const isEdit = id !== undefined
  const navigate = useNavigate()

  const [form, setForm] = useState<EventInput>(emptyForm)
  const [loading, setLoading] = useState(isEdit)
  const [notFound, setNotFound] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)

  // In edit mode, load the event. Only the Owner may edit; others see "not found".
  useEffect(() => {
    if (!isEdit) {
      return
    }
    getEvent(id)
      .then((event) => {
        if (event.myRole !== 'OWNER') {
          setNotFound(true)
          return
        }
        setForm({
          name: event.name,
          description: event.description ?? '',
          eventDate: event.eventDate,
          location: event.location ?? '',
        })
      })
      .catch((err) => {
        if (err instanceof ApiError && (err.status === 404 || err.status === 400)) {
          setNotFound(true)
        } else {
          setError(err instanceof ApiError ? err.message : 'Could not load the event.')
        }
      })
      .finally(() => setLoading(false))
  }, [id, isEdit])

  function update(field: keyof EventInput, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setFieldErrors({})
    setSubmitting(true)
    try {
      const saved = isEdit ? await updateEvent(id, form) : await createEvent(form)
      navigate(`/events/${saved.id}`, { replace: true })
    } catch (err) {
      if (err instanceof ApiError) {
        if (Object.keys(err.fieldErrors).length === 0) {
          setError(err.message)
        }
        setFieldErrors(err.fieldErrors)
      } else {
        setError('Could not save the event. Please try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (notFound) {
    return <NotFoundState />
  }

  const backTo = isEdit ? `/events/${id}` : '/events'

  return (
    <div className="mx-auto max-w-2xl">
      <Link to={backTo} className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-blue-700">
        ← {isEdit ? 'Back to event' : 'Back to My Events'}
      </Link>

      <div className="card">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{isEdit ? 'Edit Event' : 'Create Event'}</h1>
          <p className="mt-1 text-sm text-slate-500 sm:text-base">
            {isEdit ? 'Update the details of your event.' : 'Add the basic details. You will be the Owner of this event.'}
          </p>
        </div>

        {error && (
          <p role="alert" className="alert-error">
            {error}
          </p>
        )}

        {loading ? (
          <div className="space-y-5" aria-label="Loading">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-11 animate-pulse rounded-lg bg-slate-100" />
            ))}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <Field id="name" label="Event name" required error={fieldErrors.name}>
              <input
                id="name"
                required
                maxLength={200}
                placeholder="e.g. Annual Charity Gala"
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                className="input"
              />
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="eventDate" label="Event date" required error={fieldErrors.eventDate}>
                <input
                  id="eventDate"
                  type="date"
                  required
                  value={form.eventDate}
                  onChange={(e) => update('eventDate', e.target.value)}
                  className="input"
                />
              </Field>

              <Field id="location" label="Location" error={fieldErrors.location}>
                <input
                  id="location"
                  maxLength={255}
                  placeholder="e.g. Colombo"
                  value={form.location}
                  onChange={(e) => update('location', e.target.value)}
                  className="input"
                />
              </Field>
            </div>

            <Field id="description" label="Description" error={fieldErrors.description}>
              <textarea
                id="description"
                rows={4}
                maxLength={2000}
                placeholder="A short description of the event"
                value={form.description}
                onChange={(e) => update('description', e.target.value)}
                className="input resize-y"
              />
            </Field>

            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
              <Link to={backTo} className="btn-secondary">
                Cancel
              </Link>
              <button type="submit" disabled={submitting} className="btn-primary">
                {submitting ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Event'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

function Field({
  id,
  label,
  required,
  error,
  children,
}: {
  id: string
  label: string
  required?: boolean
  error?: string
  children: ReactNode
}) {
  return (
    <div>
      <label htmlFor={id} className="label">
        {label}
        {required ? <span className="text-red-500"> *</span> : <span className="font-normal text-slate-400"> (optional)</span>}
      </label>
      {children}
      {error && <p className="field-error">{error}</p>}
    </div>
  )
}
