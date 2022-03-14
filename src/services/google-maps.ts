import { googleApiKey, googleTimeoutMs } from '../config'
import { Client } from '@googlemaps/google-maps-services-js'
import { GeocodeResponse, LatLng, PlacesNearbyResponse } from '../types'

const client = new Client({})

export const fetchGeocodeResults = (address: string): Promise<GeocodeResponse> =>
  client.geocode({
    params: {
      address,
      key: googleApiKey,
    },
  })

export const fetchPlaceResults = (location: LatLng, type: string, radius: number): Promise<PlacesNearbyResponse> =>
  client.placesNearby({
    params: {
      key: googleApiKey,
      location,
      opennow: true,
      radius,
      type,
    },
    timeout: googleTimeoutMs,
  })
