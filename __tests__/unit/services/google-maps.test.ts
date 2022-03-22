import { geocodeResult, placeResponse, placeResult } from '../__mocks__'
import { googleApiKey, googleTimeoutMs } from '@config'
import { fetchGeocodeResults, fetchPicture, fetchPlaceResults } from '@services/google-maps'

const mockGeocode = jest.fn()
const mockPlacePhoto = jest.fn()
const mockPlacesNearby = jest.fn()
jest.mock('@googlemaps/google-maps-services-js', () => ({
  Client: jest.fn().mockReturnValue({
    geocode: (...args) => mockGeocode(...args),
    placePhoto: (...args) => mockPlacePhoto(...args),
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

  describe('fetchPicture', () => {
    const picture = 'a-picture-stream'
    const photoreference = '76tghbde56yuju'

    beforeAll(() => {
      mockPlacePhoto.mockResolvedValue({ data: { responseUrl: picture } })
    })

    test('expect photoreference passed to placePhoto', async () => {
      await fetchPicture(photoreference)
      expect(mockPlacePhoto).toHaveBeenCalledWith({
        params: {
          key: googleApiKey,
          maxheight: 200,
          maxwidth: 350,
          photoreference: '76tghbde56yuju',
        },
        responseType: 'stream',
      })
    })

    test('expect results returned', async () => {
      const result = await fetchPicture(photoreference)
      expect(result).toEqual(picture)
    })
  })

  describe('fetchPlaceResults', () => {
    const location = { lat: 39, lng: -92 }
    const type = 'restaurant'
    const radius = 50_000

    beforeAll(() => {
      mockPlacesNearby.mockResolvedValue(placeResponse)
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

    test('expect undefined for missing values', async () => {
      const place = { ...placeResponse.data.results[0], opening_hours: undefined, photos: undefined }
      mockPlacesNearby.mockResolvedValueOnce({ ...placeResponse, data: { results: [place] } })
      const result = await fetchPlaceResults(location, type, radius)
      expect(result).toEqual({ data: [{ ...placeResult.data[0], pic: undefined }] })
    })
  })
})
