import { placeResult, restaurant, session } from '../__mocks__'
import { mocked } from 'jest-mock'
import * as googleMaps from '@services/google-maps'
import { updateSessionStatus } from '@utils/session'

jest.mock('@services/google-maps')

describe('sessions', () => {
  beforeAll(() => {
    mocked(googleMaps).fetchPlaceResults.mockResolvedValue(placeResult)
  })

  describe('updateSessionStatus', () => {
    test('expect status unchanged for typical session', async () => {
      const result = await updateSessionStatus(session)
      expect(result).toEqual(session)
    })

    test('expect status unchanged when only one voter', async () => {
      const decisionOneVoterSession = {
        ...session,
        decisions: { '+15551234568': { Columbia: true } },
      }
      const result = await updateSessionStatus(decisionOneVoterSession)
      expect(result).toEqual(decisionOneVoterSession)
    })

    test('expect status unchanged when one decision matches', async () => {
      const decisionNoMatchSession = {
        ...session,
        decisions: { '+15551234567': { "Shakespeare's Pizza - Downtown": true }, '+15551234568': { Columbia: true } },
      }
      const result = await updateSessionStatus(decisionNoMatchSession)
      expect(result).toEqual(decisionNoMatchSession)
    })

    test('expect status changed to winner when decisions match', async () => {
      const decisionMatchSession = {
        ...session,
        decisions: { '+15551234567': { Columbia: true }, '+15551234568': { Columbia: true } },
      }
      const result = await updateSessionStatus(decisionMatchSession)
      expect(result).toEqual(expect.objectContaining({ status: { current: 'winner', pageId: 0, winner: restaurant } }))
    })

    test('expect pageId changed when no decision match', async () => {
      const decisionNoMatchSession = {
        ...session,
        decisions: { '+15551234567': { Columbia: true }, '+15551234568': { Columbia: false } },
      }
      const result = await updateSessionStatus(decisionNoMatchSession)
      expect(result).toEqual(expect.objectContaining({ status: { current: 'deciding', pageId: 1 } }))
    })

    test('expect status to be finished when no more results', async () => {
      mocked(googleMaps).fetchPlaceResults.mockResolvedValueOnce({ ...placeResult, data: [] })
      const decisionNoMatchSession = {
        ...session,
        decisions: { '+15551234567': { Columbia: true }, '+15551234568': { Columbia: false } },
      }
      const result = await updateSessionStatus(decisionNoMatchSession)
      expect(result).toEqual(expect.objectContaining({ status: { current: 'finished', pageId: 1 } }))
    })

    test('expect status to be finished when no more pages', async () => {
      const noNextPageSession = {
        ...session,
        decisions: { '+15551234567': { Columbia: true }, '+15551234568': { Columbia: false } },
        nextPageToken: undefined,
      }
      const result = await updateSessionStatus(noNextPageSession)
      expect(result).toEqual(expect.objectContaining({ status: { current: 'finished', pageId: 0 } }))
    })
  })
})
