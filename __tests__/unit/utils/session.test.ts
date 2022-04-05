import { mocked } from 'jest-mock'

import * as maps from '@services/maps'
import { choice, place, placeDetailsResponse, session } from '../__mocks__'
import { PlaceDetailsResponseData } from '@types'
import { updateSessionStatus } from '@utils/session'

jest.mock('@services/maps')
jest.mock('@utils/logging')

describe('sessions', () => {
  beforeAll(() => {
    mocked(maps).advanceRounds.mockResolvedValue(choice)
    mocked(maps).fetchChoices.mockResolvedValue([place])
    mocked(maps).fetchPlaceDetails.mockResolvedValue(placeDetailsResponse)
  })

  describe('updateSessionStatus', () => {
    const winningPlace = {
      ...place,
      formattedAddress: '225 S 9th St, Columbia, MO 65201, USA',
      formattedPhoneNumber: '(573) 449-2454',
      internationalPhoneNumber: '+1 573-449-2454',
      openHours: [
        'Monday: 11:00 AM – 10:00 PM',
        'Tuesday: 11:00 AM – 10:00 PM',
        'Wednesday: 11:00 AM – 10:00 PM',
        'Thursday: 11:00 AM – 10:00 PM',
        'Friday: 11:00 AM – 11:00 PM',
        'Saturday: 11:00 AM – 11:00 PM',
        'Sunday: 11:00 AM – 10:00 PM',
      ],
      website: 'http://www.shakespeares.com/',
    }

    describe('unchanged', () => {
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
    })

    describe('winner', () => {
      test('expect status changed to winner when decisions match', async () => {
        mocked(maps).fetchPlaceDetails.mockRejectedValueOnce(undefined)
        const decisionMatchSession = {
          ...session,
          decisions: { '+15551234567': { Columbia: true }, '+15551234568': { Columbia: true } },
        }
        const result = await updateSessionStatus(decisionMatchSession)
        expect(result).toEqual(expect.objectContaining({ status: { current: 'winner', pageId: 0, winner: place } }))
      })

      test('expect status changed to winner enhanced with details', async () => {
        const decisionMatchSession = {
          ...session,
          decisions: { '+15551234567': { Columbia: true }, '+15551234568': { Columbia: true } },
        }
        const result = await updateSessionStatus(decisionMatchSession)
        expect(result).toEqual(
          expect.objectContaining({ status: { current: 'winner', pageId: 0, winner: winningPlace } })
        )
      })

      test('expect status changed to winner enhanced with details minus open hours', async () => {
        mocked(maps).fetchPlaceDetails.mockResolvedValueOnce({
          result: { ...placeDetailsResponse.result, opening_hours: undefined },
        } as unknown as PlaceDetailsResponseData)
        const decisionMatchSession = {
          ...session,
          decisions: { '+15551234567': { Columbia: true }, '+15551234568': { Columbia: true } },
        }
        const result = await updateSessionStatus(decisionMatchSession)
        expect(result).toEqual(
          expect.objectContaining({
            status: { current: 'winner', pageId: 0, winner: { ...winningPlace, openHours: undefined } },
          })
        )
      })

      test('expect status changed to winner when voter count hit', async () => {
        const decisionMatchSession = {
          ...session,
          decisions: { '+15551234567': { Columbia: true } },
          voterCount: 1,
        }
        const result = await updateSessionStatus(decisionMatchSession)
        expect(result).toEqual(
          expect.objectContaining({ status: { current: 'winner', pageId: 0, winner: winningPlace } })
        )
      })

      test('expect winner unchanged when already winner', async () => {
        const newPlace = { ...place, name: 'Bobs Burgers' }
        const decisionMatchSession = {
          ...session,
          decisions: { '+15551234567': { Columbia: true } },
          status: { current: 'winner' as any, pageId: 0, winner: newPlace },
          voterCount: 1,
        }
        const result = await updateSessionStatus(decisionMatchSession)
        expect(result).toEqual(expect.objectContaining({ status: { current: 'winner', pageId: 0, winner: newPlace } }))
      })
    })

    describe('deciding', () => {
      test('expect pageId changed when no decision match', async () => {
        const decisionNoMatchSession = {
          ...session,
          decisions: { '+15551234567': { Columbia: true }, '+15551234568': { Columbia: false } },
        }
        const result = await updateSessionStatus(decisionNoMatchSession)
        expect(result).toEqual(expect.objectContaining({ status: { current: 'deciding', pageId: 1 } }))
      })
    })

    describe('finished', () => {
      test('expect status to be finished when no more results', async () => {
        mocked(maps).advanceRounds.mockResolvedValue({ ...choice, choices: [] })
        const decisionNoMatchSession = {
          ...session,
          decisions: { '+15551234567': { Columbia: true }, '+15551234568': { Columbia: false } },
        }
        const result = await updateSessionStatus(decisionNoMatchSession)
        expect(result).toEqual(expect.objectContaining({ status: { current: 'finished', pageId: 1 } }))
      })
    })
  })
})
