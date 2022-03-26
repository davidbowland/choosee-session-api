import { mocked } from 'jest-mock'

import * as dynamodb from '@services/dynamodb'
import * as events from '@utils/events'
import { APIGatewayProxyEventV2, Session } from '@types'
import { session, sessionId } from '../__mocks__'
import eventJson from '@events/patch-decisions-by-id.json'
import { patchDecisionByIdHandler } from '@handlers/patch-decisions-by-id'
import status from '@utils/status'

jest.mock('@services/dynamodb')
jest.mock('@utils/events')
jest.mock('@utils/logging')

describe('patch-decisions-by-id', () => {
  const event = eventJson as unknown as APIGatewayProxyEventV2
  const expectedResult = {
    ...session,
    decisions: { '+15551234567': { "Shakespeare's Pizza - Downtown": false } },
  } as Session
  const jwt = {
    phone_number: '+15551234567',
  }

  beforeAll(() => {
    mocked(dynamodb).getDataById.mockResolvedValue(session)
    mocked(dynamodb).setDataById.mockResolvedValue(undefined)
    mocked(events).extractJsonPatchFromEvent.mockImplementation((event) => JSON.parse(event.body))
    mocked(events).extractJwtFromEvent.mockReturnValue(jwt)
  })

  describe('patchDecisionByIdHandler', () => {
    test("expect FORBIDDEN when userId doesn't match JWT", async () => {
      mocked(events).extractJwtFromEvent.mockReturnValueOnce({ phone_number: 'doesnt_match' })
      const result = await patchDecisionByIdHandler(event)
      expect(result).toEqual(expect.objectContaining(status.FORBIDDEN))
    })

    test('expect BAD_REQUEST when unable to parse body', async () => {
      mocked(events).extractJsonPatchFromEvent.mockRejectedValueOnce('Bad request')
      const result = await patchDecisionByIdHandler(event)
      expect(result).toEqual(expect.objectContaining({ statusCode: status.BAD_REQUEST.statusCode }))
    })

    test('expect BAD_REQUEST when extractJsonPatchFromEvent throws', async () => {
      mocked(events).extractJsonPatchFromEvent.mockImplementationOnce(() => {
        throw new Error('Bad request')
      })
      const result = await patchDecisionByIdHandler(event)
      expect(result.statusCode).toEqual(status.BAD_REQUEST.statusCode)
    })

    test('expect NOT_FOUND on getDataById reject', async () => {
      mocked(dynamodb).getDataById.mockRejectedValueOnce(undefined)
      const result = await patchDecisionByIdHandler(event)
      expect(result).toEqual(expect.objectContaining(status.NOT_FOUND))
    })

    test('expect INTERNAL_SERVER_ERROR on setDataById reject', async () => {
      mocked(dynamodb).setDataById.mockRejectedValueOnce(undefined)
      const result = await patchDecisionByIdHandler(event)
      expect(result).toEqual(expect.objectContaining(status.INTERNAL_SERVER_ERROR))
    })

    test('expect setDataByIndex called with updated object', async () => {
      await patchDecisionByIdHandler(event)
      expect(mocked(dynamodb).setDataById).toHaveBeenCalledWith(sessionId, expectedResult)
    })

    test('expect OK and body when ID exists', async () => {
      const result = await patchDecisionByIdHandler(event)
      expect(result).toEqual({ ...status.OK, body: JSON.stringify({ "Shakespeare's Pizza - Downtown": false }) })
    })

    test('expect OK and body when ID does not exist', async () => {
      mocked(dynamodb).getDataById.mockResolvedValueOnce({ ...session, decisions: {} })
      const result = await patchDecisionByIdHandler({
        ...event,
        body: JSON.stringify([{ op: 'add', path: "/Shakespeare's Pizza - Downtown", value: false }]),
      })
      expect(result).toEqual({ ...status.OK, body: JSON.stringify({ "Shakespeare's Pizza - Downtown": false }) })
    })

    test('expect OK and results when no JWT provided', async () => {
      mocked(events).extractJwtFromEvent.mockReturnValueOnce(undefined)
      const result = await patchDecisionByIdHandler(event)
      expect(result).toEqual({ ...status.OK, body: JSON.stringify({ "Shakespeare's Pizza - Downtown": false }) })
    })
  })
})
