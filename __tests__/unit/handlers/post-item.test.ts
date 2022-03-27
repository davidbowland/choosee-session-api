import { mocked } from 'jest-mock'

import * as dynamodb from '@services/dynamodb'
import * as events from '@utils/events'
import * as googleMaps from '@services/google-maps'
import * as idGenerator from '@utils/id-generator'
import { APIGatewayProxyEventV2, GeocodeResponse } from '@types'
import { decodedJwt, geocodeResult, newSession, placeResult, sessionId } from '../__mocks__'
import eventJson from '@events/post-item.json'
import { postItemHandler } from '@handlers/post-item'
import status from '@utils/status'

jest.mock('@services/dynamodb')
jest.mock('@services/google-maps')
jest.mock('@utils/events')
jest.mock('@utils/id-generator')
jest.mock('@utils/logging')

describe('post-item', () => {
  const event = eventJson as unknown as APIGatewayProxyEventV2

  beforeAll(() => {
    mocked(dynamodb).getDataById.mockRejectedValue(undefined)
    mocked(dynamodb).setDataById.mockResolvedValue(undefined)
    mocked(events).extractJwtFromEvent.mockReturnValue(decodedJwt)
    mocked(events).extractNewSessionFromEvent.mockReturnValue(newSession)
    mocked(googleMaps).fetchGeocodeResults.mockResolvedValue(geocodeResult as unknown as GeocodeResponse)
    mocked(googleMaps).fetchPlaceResults.mockResolvedValue(placeResult)
    mocked(idGenerator).getNextId.mockResolvedValue(sessionId)
  })

  describe('postItemHandler', () => {
    test('expect BAD_REQUEST when new session is invalid', async () => {
      mocked(events).extractNewSessionFromEvent.mockImplementationOnce(() => {
        throw new Error('Bad request')
      })
      const result = await postItemHandler(event)
      expect(result).toEqual(expect.objectContaining(status.BAD_REQUEST))
    })

    test('expect BAD_REQUEST when no results from geocode', async () => {
      mocked(googleMaps).fetchGeocodeResults.mockResolvedValueOnce({
        data: {
          html_attributions: [],
          next_page_token:
            'Aap_uED5ulA1bsoLWnkyaDlG1aoxuxgcx8pxnXBzkdbURX3PZwuzXgFtdbkLlJxjvqqCRa1iug_VSAiISjiApmg9yLOXQgWjMDbXuAGnVZaFARBlnfsRe5tjjVx_PKYEZv7iHNYwcvXR9eWvp8k1XMDBkj7Ja-YpLe9r8eAy1nZC-O9-1_M-lRNMNBr3YxCvWY57VXcP5F6-EPpj5vMAoHQ2e65TBGofxvsAkUX8HSvbHTKDCcYoQJUmwJQfeamM9H5stiJ137Ip98aMrEASSqCYCf9osGhRx7lbjZl4jUYKS-Y-8BejokmFWLtldff0SKuKQQrlef4E0xrdXr1jUh-uRVZTJoCq6Ki1AhiSM9qEvl0_EHYzAMbeQ9bCn0O_AlO6xstNfozKpz8SXXEiqpWaGXyaUqz-NU2facRhhZqPROSb',
          results: [],
          status: 'OK',
        },
      } as unknown as GeocodeResponse)
      const result = await postItemHandler(event)
      expect(result).toEqual(
        expect.objectContaining({ ...status.BAD_REQUEST, body: JSON.stringify({ message: 'Invalid address' }) })
      )
    })

    test('expect sessionId passed to setDataById', async () => {
      await postItemHandler(event)
      expect(mocked(dynamodb).setDataById).toHaveBeenCalledWith('abc123', expect.objectContaining(newSession))
    })

    test('expect INTERNAL_SERVER_ERROR on setDataByIndex reject', async () => {
      mocked(dynamodb).setDataById.mockRejectedValueOnce(undefined)
      const result = await postItemHandler(event)
      expect(result).toEqual(expect.objectContaining(status.INTERNAL_SERVER_ERROR))
    })

    test('expect CREATED and body', async () => {
      const result = await postItemHandler(event)
      expect(result).toEqual(expect.objectContaining(status.CREATED))
      expect(mocked(googleMaps).fetchPlaceResults).toHaveBeenCalledWith(
        { lat: 39.0013395, lng: -92.3128326 },
        'restaurant',
        undefined,
        undefined
      )
      expect(JSON.parse(result.body)).toEqual({
        location: 'http://choosee.bowland.link/s/abc123',
        sessionId: 'abc123',
      })
    })

    test('expect CREATED and full body when no JWT', async () => {
      mocked(events).extractJwtFromEvent.mockImplementationOnce(() => {
        throw new Error('JWT error')
      })
      const result = await postItemHandler(event)
      expect(result).toEqual(expect.objectContaining(status.CREATED))
      expect(JSON.parse(result.body)).toEqual(
        expect.objectContaining({
          ...newSession,
          location: 'http://choosee.bowland.link/s/abc123',
          sessionId: 'abc123',
        })
      )
    })

    test('expect finished status when no data', async () => {
      mocked(events).extractJwtFromEvent.mockImplementationOnce(() => {
        throw new Error('JWT error')
      })
      mocked(googleMaps).fetchPlaceResults.mockResolvedValue({ ...placeResult, data: [] })
      const result = await postItemHandler(event)
      expect(result).toEqual(expect.objectContaining(status.CREATED))
      expect(JSON.parse(result.body)).toEqual(
        expect.objectContaining({
          status: {
            current: 'finished',
            pageId: 0,
          },
        })
      )
    })

    test('expect Location header', async () => {
      const result = await postItemHandler(event)
      expect(result).toEqual(expect.objectContaining({ headers: { Location: 'http://choosee.bowland.link/s/abc123' } }))
    })
  })
})
