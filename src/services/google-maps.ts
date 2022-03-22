import { googleApiKey, googleTimeoutMs } from '../config'
import { Client } from '@googlemaps/google-maps-services-js'
import { GeocodeResponse, LatLng, PlaceResponse } from '../types'

const client = new Client()

export const fetchGeocodeResults = (address: string): Promise<GeocodeResponse> =>
  client.geocode({
    params: {
      address,
      key: googleApiKey,
    },
  })

export const fetchPicture = (photoreference: string): Promise<string> =>
  client
    .placePhoto({
      params: {
        key: googleApiKey,
        maxheight: 200,
        maxwidth: 350,
        photoreference,
      },
      responseType: 'stream',
    })
    .then((response) => response.data.responseUrl)

export const fetchPlaceResults = (
  location: LatLng,
  type: string,
  radius: number,
  nextPageToken?: string
): Promise<PlaceResponse> =>
  client
    .placesNearby({
      params: {
        key: googleApiKey,
        location,
        opennow: true,
        pagetoken: nextPageToken,
        radius,
        type,
      },
      timeout: googleTimeoutMs,
    })
    .then(async (response) => ({
      data: await Promise.all(
        response.data.results.map(async (restaurant) => ({
          name: restaurant.name,
          openHours: restaurant.opening_hours?.weekday_text,
          pic: restaurant.photos?.[0] && (await fetchPicture(restaurant.photos[0].photo_reference)),
          priceLevel: restaurant.price_level,
          rating: restaurant.rating,
          vicinity: restaurant.vicinity,
        }))
      ),
      nextPageToken: response.data.next_page_token,
    }))
