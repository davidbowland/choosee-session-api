import { session } from '../__mocks__'
import eventJson from '@events/get-status-by-id.json'
import { getStatusByIdHandler } from '@handlers/get-status-by-id'
import { mocked } from 'jest-mock'
import * as dynamodb from '@services/dynamodb'
import { APIGatewayProxyEventV2 } from '@types'
import status from '@utils/status'

jest.mock('@services/dynamodb')
jest.mock('@utils/logging')

describe('get-status-by-id', () => {
  const event = eventJson as unknown as APIGatewayProxyEventV2

  beforeAll(() => {
    mocked(dynamodb).getDataById.mockResolvedValue(session)
  })

  describe('getStatusByIdHandler', () => {
    test('expect NOT_FOUND on getDataById reject', async () => {
      mocked(dynamodb).getDataById.mockRejectedValueOnce(undefined)
      const result = await getStatusByIdHandler(event)
      expect(result).toEqual(expect.objectContaining(status.NOT_FOUND))
    })

    test('expect OK when id exists', async () => {
      const result = await getStatusByIdHandler(event)
      expect(result).toEqual({ ...status.OK, body: JSON.stringify({ ...session.status, address: session.address }) })
    })
  })
})
