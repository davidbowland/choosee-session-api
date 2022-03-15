import { geocodeResult, newSession, placeResult, sessionId } from '../__mocks__'
import eventJson from '@events/post-item.json'
import { postItemHandler } from '@handlers/post-item'
import { mocked } from 'jest-mock'
import * as dynamodb from '@services/dynamodb'
import * as googleMaps from '@services/google-maps'
import { APIGatewayProxyEventV2, GeocodeResponse } from '@types'
import * as events from '@utils/events'
import * as idGenerator from '@utils/id-generator'
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
    mocked(events).extractNewSessionFromEvent.mockReturnValue(newSession)
    mocked(googleMaps).fetchGeocodeResults.mockResolvedValue(geocodeResult as unknown as GeocodeResponse)
    mocked(googleMaps).fetchPlaceResults.mockResolvedValue(placeResult)
    mocked(idGenerator).getNextId.mockResolvedValue(sessionId)
  })

  describe('postItemHandler', () => {
    test('expect BAD_REQUEST when link is invalid', async () => {
      mocked(events).extractNewSessionFromEvent.mockImplementationOnce(() => {
        throw new Error('Bad request')
      })
      const result = await postItemHandler(event)
      expect(result).toEqual(expect.objectContaining(status.BAD_REQUEST))
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
      expect(JSON.parse(result.body)).toEqual(
        expect.objectContaining({
          ...newSession,
          sessionId: 'abc123',
          location: 'http://choosee.bowland.link/s/abc123',
        })
      )
    })

    test('expect Location header', async () => {
      const result = await postItemHandler(event)
      expect(result).toEqual(expect.objectContaining({ headers: { Location: 'http://choosee.bowland.link/s/abc123' } }))
    })
  })
})
