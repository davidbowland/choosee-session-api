export * from 'aws-lambda'
export { Operation as PatchOperation } from 'fast-json-patch'
export * from '@googlemaps/google-maps-services-js'

import { LatLng } from '@googlemaps/google-maps-services-js'

export type PlaceType = 'restaurant' | 'meal_delivery' | 'meal_takeaway' | 'bar' | 'cafe' | 'night_club'

export interface Place {
  name: string
  openHours?: string[]
  pic?: string
  placeId: string
  priceLevel: number
  rating: number
  vicinity: string
}

export interface PlaceDetails extends Place {
  formattedAddress?: string
  formattedPhoneNumber?: string
  internationalPhoneNumber?: string
  website?: string
}

export interface DecisionObject {
  [key: string]: boolean
}

export interface StatusObject {
  current: 'deciding' | 'winner' | 'finished'
  pageId: number
  winner?: PlaceDetails
}

export interface Session {
  address: string
  choiceId: string
  decisions: {
    [key: string]: DecisionObject
  }
  expiration: number
  lastAccessed: number
  location: LatLng
  openNow: boolean
  pagesPerRound: number
  status: StatusObject
  type: PlaceType
  voterCount: number
}

export interface SessionBatch {
  data: Session
  id: string
}

export interface NewSession {
  address: string
  expiration?: number
  openNow?: boolean
  pagesPerRound?: number
  type: PlaceType
  voterCount: number
}

export interface Choice {
  address: string
  choiceId?: string
  choices: Place[]
  expiration: number
  latLng: LatLng
  nextPageToken: string
  openNow: boolean
  pagesPerRound: number
  type: PlaceType
}

export interface NewChoice {
  address: string
  expiration?: number
  lat?: number
  lng?: number
  openNow?: boolean
  pagesPerRound?: number
  type: PlaceType
}

export interface PlaceResponse {
  data: Place[]
  nextPageToken: string
}

export interface StringObject {
  [key: string]: string
}

export type MessageType = 'PROMOTIONAL' | 'TRANSACTIONAL'

export interface SMSMessage {
  to: string
  contents: string
  messageType?: MessageType
}
