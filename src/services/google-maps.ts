import { googleApiKey, googleTimeoutMs } from '../config'
import { Client, PlacesNearbyRanking } from '@googlemaps/google-maps-services-js'
import { GeocodeResponse, LatLng, PlaceDetailsResponse, PlaceResponse } from '../types'

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
        maxheight: 200,
        maxwidth: 350,
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

export const fetchPlaceResults = (location: LatLng, type: string, nextPageToken?: string): Promise<PlaceResponse> =>
  client
    .placesNearby({
      params: {
        key: googleApiKey,
        location,
        opennow: true,
        pagetoken: nextPageToken,
        rankby: PlacesNearbyRanking.distance,
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
          placeId: restaurant.place_id,
          priceLevel: restaurant.price_level,
          rating: restaurant.rating,
          vicinity: restaurant.vicinity,
        }))
      ),
      nextPageToken: response.data.next_page_token,
    }))
