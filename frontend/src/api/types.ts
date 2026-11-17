export interface User {
  id: number
  fullName: string
  email: string
}

export interface LoginResponse {
  token: string
  tokenType: string
  expiresAt: string
  user: User
}

export type EventRole = 'OWNER' | 'EDITOR' | 'VIEWER'

/** An event as seen by the logged-in user. */
export interface EventItem {
  id: number
  name: string
  description: string | null
  /** Date only, as "YYYY-MM-DD". */
  eventDate: string
  location: string | null
  ownerId: number
  ownerName: string
  myRole: EventRole
  createdAt: string
}

/** Body for creating or updating an event. */
export interface EventInput {
  name: string
  description: string
  eventDate: string
  location: string
}
