import { logError } from './logging'
import { fetchPlaceDetails, fetchPlaceResults } from '../services/google-maps'
import { DecisionObject, Place, PlaceDetails, Session } from '../types'

const areDecisionsComplete = (choiceNames: string[], decisions: DecisionObject): boolean =>
  choiceNames.every((name) => name in decisions)

const intersection = (set1: string[], set2: string[]): string[] => set1.filter((value) => set2.indexOf(value) >= 0)

const extractPositiveDecisions = (decisions: DecisionObject): string[] =>
  Object.keys(decisions).filter((name) => decisions[name])

const enhanceWithDetails = async (place: Place): Promise<PlaceDetails> => {
  if (place.placeId) {
    try {
      const winnerDetails = await fetchPlaceDetails(place.placeId)
      const winnerResult = winnerDetails.data.result
      if (winnerResult) {
        return {
          ...place,
          formattedAddress: winnerResult.formatted_address,
          formattedPhoneNumber: winnerResult.formatted_phone_number,
          internationalPhoneNumber: winnerResult.international_phone_number,
          openHours: winnerResult.opening_hours?.weekday_text,
          website: winnerResult.website,
        }
      }
    } catch (error) {
      logError(error)
    }
  }
  return place
}

export const updateSessionStatus = async (session: Session): Promise<Session> => {
  if (Object.keys(session.decisions).length < session.voterCount) {
    return session
  }

  const choiceNames = session.choices.map((value) => value.name)
  const allDecisions = Object.values(session.decisions)
  const allDecisionsComplete = allDecisions.every((decisions) => areDecisionsComplete(choiceNames, decisions))
  if (!allDecisionsComplete) {
    return session
  }

  const winners = allDecisions.map(extractPositiveDecisions).reduce(intersection)
  if (winners.length > 0) {
    const randomWinner = winners[Math.floor(Math.random() * winners.length)]
    const winnerPlace = session.choices.filter((place) => place.name === randomWinner)[0]
    return {
      ...session,
      status: {
        current: 'winner',
        pageId: session.status.pageId,
        winner: await enhanceWithDetails(winnerPlace),
      },
    }
  }

  if (session.nextPageToken) {
    const places = await fetchPlaceResults(session.location, session.type, session.openNow, session.nextPageToken)
    return {
      ...session,
      choices: places.data,
      nextPageToken: places.nextPageToken,
      status: {
        current: places.data.length > 0 ? 'deciding' : 'finished',
        pageId: session.status.pageId + 1,
      },
    }
  } else {
    return {
      ...session,
      status: {
        ...session.status,
        current: 'finished',
      },
    }
  }
}
