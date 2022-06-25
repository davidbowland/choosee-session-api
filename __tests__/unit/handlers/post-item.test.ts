import { mocked } from 'jest-mock'

import * as dynamodb from '@services/dynamodb'
import * as events from '@utils/events'
import * as idGenerator from '@utils/id-generator'
import * as maps from '@services/maps'
import { choice, decodedJwt, newSession, sessionId } from '../__mocks__'
import { APIGatewayProxyEventV2 } from '@types'
import eventJson from '@events/post-item.json'
import { postItemHandler } from '@handlers/post-item'
import status from '@utils/status'

jest.mock('@services/dynamodb')
jest.mock('@services/maps')
jest.mock('@utils/events')
jest.mock('@utils/id-generator')
jest.mock('@utils/logging')

describe('post-item', () => {
  const event = eventJson as unknown as APIGatewayProxyEventV2

  beforeAll(() => {
    mocked(maps).createChoices.mockResolvedValue(choice)
    mocked(events).extractJwtFromEvent.mockReturnValue(null)
    mocked(events).extractNewSessionFromEvent.mockReturnValue(newSession)
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

    test('expect BAD_REQUEST when createChoices rejects from geocode', async () => {
      mocked(maps).createChoices.mockRejectedValueOnce({
        response: { data: { message: 'Invalid address' }, status: status.BAD_REQUEST.statusCode },
      })
      const result = await postItemHandler(event)
      expect(result).toEqual(
        expect.objectContaining({ ...status.BAD_REQUEST, body: JSON.stringify({ message: 'Invalid address' }) })
      )
    })

    test('expect sessionId passed to setSessionById', async () => {
      await postItemHandler(event)
      expect(mocked(dynamodb).setSessionById).toHaveBeenCalledWith('abc123', expect.objectContaining(newSession))
    })

    test('expect INTERNAL_SERVER_ERROR on setSessionById reject', async () => {
      mocked(dynamodb).setSessionById.mockRejectedValueOnce(undefined)
      const result = await postItemHandler(event)
      expect(result).toEqual(expect.objectContaining(status.INTERNAL_SERVER_ERROR))
    })

    test('expect CREATED and body', async () => {
      const result = await postItemHandler(event)
      expect(result).toEqual(expect.objectContaining(status.CREATED))
      expect(mocked(maps).createChoices).toHaveBeenCalledWith({
        address: 'Columbia, MO 65203, USA',
        rankBy: 'distance',
        type: 'restaurant',
      })
      expect(JSON.parse(result.body)).toEqual(
        expect.objectContaining({
          ...newSession,
          sessionId: 'abc123',
        })
      )
    })

    test('expect owner when JWT', async () => {
      mocked(events).extractJwtFromEvent.mockReturnValueOnce(decodedJwt)
      const result = await postItemHandler(event)
      expect(result).toEqual(expect.objectContaining(status.CREATED))
      expect(JSON.parse(result.body)).toEqual(
        expect.objectContaining({
          ...newSession,
          owner: 'efd31b67-19f2-4d0a-a723-78506ffc0b7e',
          sessionId: 'abc123',
        })
      )
    })

    test('expect finished status when no data', async () => {
      mocked(maps).createChoices.mockResolvedValue({ ...choice, choices: [] })
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
  })
})
