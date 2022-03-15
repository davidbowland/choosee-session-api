import { session, sessionId } from '../__mocks__'
import eventJson from '@events/patch-item.json'
import { patchItemHandler } from '@handlers/patch-item'
import { mocked } from 'jest-mock'
import * as dynamodb from '@services/dynamodb'
import { APIGatewayProxyEventV2, PatchOperation, Session } from '@types'
import * as events from '@utils/events'
import status from '@utils/status'

jest.mock('@services/dynamodb')
jest.mock('@utils/events')
jest.mock('@utils/logging')

describe('patch-item', () => {
  const event = eventJson as unknown as APIGatewayProxyEventV2
  const expectedResult = { ...session, address: '90036' } as Session

  beforeAll(() => {
    mocked(dynamodb).getDataById.mockResolvedValue(session)
    mocked(dynamodb).setDataById.mockResolvedValue(undefined)
    mocked(events).extractJsonPatchFromEvent.mockImplementation((event) => JSON.parse(event.body))
  })

  describe('patchItemHandler', () => {
    test('expect BAD_REQUEST when unable to parse body', async () => {
      mocked(events).extractJsonPatchFromEvent.mockRejectedValueOnce('Bad request')
      const result = await patchItemHandler(event)
      expect(result).toEqual(expect.objectContaining({ statusCode: status.BAD_REQUEST.statusCode }))
    })

    test('expect BAD_REQUEST when patch operations are invalid', async () => {
      mocked(events).extractJsonPatchFromEvent.mockReturnValueOnce([
        { op: 'replace', path: '/fnord' },
      ] as unknown[] as PatchOperation[])
      const result = await patchItemHandler(event)
      expect(result.statusCode).toEqual(status.BAD_REQUEST.statusCode)
    })

    test('expect INTERNAL_SERVER_ERROR on setDataById reject', async () => {
      mocked(dynamodb).setDataById.mockRejectedValueOnce(undefined)
      const result = await patchItemHandler(event)
      expect(result).toEqual(expect.objectContaining(status.INTERNAL_SERVER_ERROR))
    })

    test('expect setDataByIndex called with updated object', async () => {
      await patchItemHandler(event)
      expect(mocked(dynamodb).setDataById).toHaveBeenCalledWith(sessionId, expectedResult)
    })

    test('expect OK and body', async () => {
      const result = await patchItemHandler(event)
      expect(result).toEqual(expect.objectContaining({ ...status.OK, body: JSON.stringify(expectedResult) }))
    })
  })
})
