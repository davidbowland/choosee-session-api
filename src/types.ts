export * from 'aws-lambda'
export { Operation as PatchOperation } from 'fast-json-patch'
export * from '@googlemaps/google-maps-services-js'

import { LatLng } from '@googlemaps/google-maps-services-js'

export type RestaurantType = 'restaurant' | 'meal_delivery' | 'meal_takeaway'

export interface Restaurant {
  name: string
  openHours?: string[]
  pic?: string
  placeId: string
  priceLevel: number
  rating: number
  vicinity: string
}

export interface RestaurantDetails extends Restaurant {
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
  winner?: RestaurantDetails
}

export interface Session {
  address: string
  choices: Restaurant[]
  decisions: {
    [key: string]: DecisionObject
  }
  expiration: number
  lastAccessed: number
  location: LatLng
  nextPageToken: string
  openNow: boolean
  status: StatusObject
  type: RestaurantType
  radius: number
  voterCount: number
}

export interface SessionBatch {
  data: Session
  id: string
}

export interface NewSession {
  address: string
  expiration?: number
  radius: number
  type: RestaurantType
  voterCount: number
}

export interface PlaceResponse {
  data: Restaurant[]
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
