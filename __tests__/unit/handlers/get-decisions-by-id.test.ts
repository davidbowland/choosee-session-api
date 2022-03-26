import { mocked } from 'jest-mock'

import * as dynamodb from '@services/dynamodb'
import { APIGatewayProxyEventV2 } from '@types'
import eventJson from '@events/get-decisions-by-id.json'
import { getDecisionsByIdHandler } from '@handlers/get-decisions-by-id'
import { session } from '../__mocks__'
import status from '@utils/status'

jest.mock('@services/dynamodb')
jest.mock('@utils/logging')

describe('get-decisions-by-id', () => {
  const event = eventJson as unknown as APIGatewayProxyEventV2

  beforeAll(() => {
    mocked(dynamodb).getDataById.mockResolvedValue(session)
  })

  describe('getDecisionsByIdHandler', () => {
    test('expect NOT_FOUND on getDataById reject', async () => {
      mocked(dynamodb).getDataById.mockRejectedValueOnce(undefined)
      const result = await getDecisionsByIdHandler(event)
      expect(result).toEqual(expect.objectContaining(status.NOT_FOUND))
    })

    test("expect FORBIDDEN when userId doesn't match JWT", async () => {
      const tempEvent = { ...event, pathParameters: { ...event.pathParameters, userId: 'doesnt_match' } }
      const result = await getDecisionsByIdHandler(tempEvent)
      expect(result).toEqual(expect.objectContaining(status.FORBIDDEN))
    })

    test('expect OK and empty result set when userId not found', async () => {
      mocked(dynamodb).getDataById.mockResolvedValueOnce({ ...session, decisions: {} })
      const result = await getDecisionsByIdHandler(event)
      expect(result).toEqual({ ...status.OK, body: JSON.stringify({}) })
    })

    test('expect OK and results when id exists', async () => {
      const result = await getDecisionsByIdHandler(event)
      expect(result).toEqual({ ...status.OK, body: JSON.stringify({ "Shakespeare's Pizza - Downtown": true }) })
    })

    test('expect OK and results when no JWT provided', async () => {
      const tempEvent = { ...event, headers: {} }
      const result = await getDecisionsByIdHandler(tempEvent)
      expect(result).toEqual({ ...status.OK, body: JSON.stringify({ "Shakespeare's Pizza - Downtown": true }) })
    })
  })
})
