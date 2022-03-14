import { geocodeResult, placeResult } from '../__mocks__'
import { googleApiKey, googleTimeoutMs } from '@config'
import { fetchGeocodeResults, fetchPlaceResults } from '@services/google-maps'

const mockGeocode = jest.fn()
const mockPlacesNearby = jest.fn()
jest.mock('@googlemaps/google-maps-services-js', () => ({
  Client: jest.fn().mockReturnValue({
    geocode: (...args) => mockGeocode(...args),
    placesNearby: (...args) => mockPlacesNearby(...args),
  }),
}))

describe('queue', () => {
  describe('fetchGeocodeResults', () => {
    const address = '90210'

    beforeAll(() => {
      mockGeocode.mockResolvedValue(geocodeResult)
    })

    test('expect address passed to geocode', async () => {
      await fetchGeocodeResults(address)
      expect(mockGeocode).toHaveBeenCalledWith({
        params: {
          address,
          key: googleApiKey,
        },
      })
    })

    test('expect results returned', async () => {
      const result = await fetchGeocodeResults(address)
      expect(result).toEqual(geocodeResult)
    })
  })

  describe('fetchPlaceResults', () => {
    const location = { lat: 39, lng: -92 }
    const type = 'restaurant'
    const radius = 50_000

    beforeAll(() => {
      mockPlacesNearby.mockResolvedValue(placeResult)
    })

    test('expect parameters passed to placesNearby', async () => {
      await fetchPlaceResults(location, type, radius)
      expect(mockPlacesNearby).toHaveBeenCalledWith({
        params: {
          key: googleApiKey,
          location,
          opennow: true,
          radius,
          type,
        },
        timeout: googleTimeoutMs,
      })
    })

    test('expect results returned', async () => {
      const result = await fetchPlaceResults(location, type, radius)
      expect(result).toEqual(placeResult)
    })
  })
})
