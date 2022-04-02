import { APIGatewayProxyEventV2, APIGatewayProxyResultV2, NewSession, Session, StringObject } from '../types'
import { extractJwtFromEvent, extractNewSessionFromEvent } from '../utils/events'
import { fetchGeocodeResults, fetchPlaceResults } from '../services/google-maps'
import { log, logError } from '../utils/logging'
import { getNextId } from '../utils/id-generator'
import { setDataById } from '../services/dynamodb'
import status from '../utils/status'

const createNewSession = async (newSession: NewSession, jwt?: StringObject): Promise<APIGatewayProxyResultV2<any>> => {
  try {
    const geocoded = await fetchGeocodeResults(newSession.address)
    if (geocoded.data.results.length === 0) {
      return { ...status.BAD_REQUEST, body: JSON.stringify({ message: 'Invalid address' }) }
    }
    const latLng = geocoded.data.results[0].geometry.location

    const places = await fetchPlaceResults(latLng, newSession.type, newSession.openNow, newSession.pagesPerRound)
    log('Google API results', { geocoded, places })

    const sessionId = await getNextId()
    const session: Session = {
      address: geocoded.data.results[0].formatted_address,
      choices: places.data,
      decisions: {},
      expiration: newSession.expiration,
      lastAccessed: 0,
      location: latLng,
      nextPageToken: places.nextPageToken,
      openNow: newSession.openNow,
      pagesPerRound: newSession.pagesPerRound,
      status: {
        current: places.data.length > 0 ? 'deciding' : 'finished',
        pageId: 0,
      },
      type: newSession.type,
      voterCount: newSession.voterCount,
    }
    log('Creating session', { session, sessionId })
    await setDataById(sessionId, session)
    if (jwt === undefined) {
      return {
        ...status.CREATED,
        body: JSON.stringify({ ...session, sessionId }),
      }
    }
    return {
      ...status.CREATED,
      body: JSON.stringify({ sessionId }),
    }
  } catch (error) {
    logError(error)
    return status.INTERNAL_SERVER_ERROR
  }
}

export const postItemHandler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2<any>> => {
  log('Received event', { ...event, body: undefined })
  try {
    const newSession = extractNewSessionFromEvent(event)
    try {
      const jwt = extractJwtFromEvent(event)
      return await createNewSession(newSession, jwt)
    } catch {
      return await createNewSession(newSession, undefined)
    }
  } catch (error) {
    return { ...status.BAD_REQUEST, body: JSON.stringify({ message: error.message }) }
  }
}
