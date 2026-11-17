import { api } from './client'
import type { EventInput, EventItem } from './types'

export function listEvents(): Promise<EventItem[]> {
  return api<EventItem[]>('/events')
}

export function getEvent(id: string | number): Promise<EventItem> {
  return api<EventItem>(`/events/${id}`)
}

export function createEvent(input: EventInput): Promise<EventItem> {
  return api<EventItem>('/events', { method: 'POST', body: input })
}

export function updateEvent(id: string | number, input: EventInput): Promise<EventItem> {
  return api<EventItem>(`/events/${id}`, { method: 'PUT', body: input })
}

export function deleteEvent(id: string | number): Promise<void> {
  return api<void>(`/events/${id}`, { method: 'DELETE' })
}
