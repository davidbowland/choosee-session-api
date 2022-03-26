import { Client, PlacesNearbyRanking } from '@googlemaps/google-maps-services-js'

import { GeocodeResponse, LatLng, PlaceDetailsResponse, PlaceResponse } from '../types'
import { googleApiKey, googleImageMaxHeight, googleImageMaxWidth, googleTimeoutMs } from '../config'

const client = new Client()

export const fetchGeocodeResults = (address: string): Promise<GeocodeResponse> =>
  client.geocode({
    params: {
      address,
      key: googleApiKey,
    },
    timeout: googleTimeoutMs,
  })

export const fetchPicture = (photoreference: string): Promise<string> =>
  client
    .placePhoto({
      params: {
        key: googleApiKey,
        maxheight: googleImageMaxHeight,
        maxwidth: googleImageMaxWidth,
        photoreference,
      },
      responseType: 'stream',
      timeout: googleTimeoutMs,
    })
    .then((response) => response.data.responseUrl)

export const fetchPlaceDetails = (placeId: string): Promise<PlaceDetailsResponse> =>
  client.placeDetails({
    params: {
      fields: [
        'formatted_address',
        'formatted_phone_number',
        'international_phone_number',
        'name',
        'opening_hours',
        'website',
      ],
      key: googleApiKey,
      place_id: placeId,
    },
    timeout: googleTimeoutMs,
  })

export const fetchPlaceResults = (
  location: LatLng,
  type: string,
  openNow: boolean,
  nextPageToken?: string
): Promise<PlaceResponse> =>
  client
    .placesNearby({
      params: {
        key: googleApiKey,
        location,
        opennow: openNow || undefined,
        pagetoken: nextPageToken,
        rankby: PlacesNearbyRanking.distance,
        type,
      },
      timeout: googleTimeoutMs,
    })
    .then(async (response) => ({
      data: await Promise.all(
        response.data.results.map(async (place) => ({
          name: place.name,
          openHours: place.opening_hours?.weekday_text,
          pic: place.photos?.[0] && (await fetchPicture(place.photos[0].photo_reference)),
          placeId: place.place_id,
          priceLevel: place.price_level,
          rating: place.rating,
          vicinity: place.vicinity,
        }))
      ),
      nextPageToken: response.data.next_page_token,
    }))
