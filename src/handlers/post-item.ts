import { corsDomain } from '../config'
import { setDataById } from '../services/dynamodb'
import { fetchGeocodeResults, fetchPlaceResults } from '../services/google-maps'
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2, Session } from '../types'
import { extractNewSessionFromEvent } from '../utils/events'
import { getNextId } from '../utils/id-generator'
import { log, logError } from '../utils/logging'
import status from '../utils/status'

export const postItemHandler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2<any>> => {
  log('Received event', { ...event, body: undefined })
  try {
    const newSession = extractNewSessionFromEvent(event)
    try {
      const geocoded = await fetchGeocodeResults(newSession.address)
      const latLng = geocoded.data.results[0].geometry.location

      const places = await fetchPlaceResults(latLng, newSession.type, newSession.radius)

      const sessionId = await getNextId()
      const session: Session = {
        address: geocoded.data.results[0].formatted_address,
        choices: places.data,
        decisions: {},
        expiration: newSession.expiration,
        lastAccessed: 0,
        location: latLng,
        nextPageToken: places.nextPageToken,
        openNow: true,
        radius: newSession.radius,
        type: newSession.type,
      }
      await setDataById(sessionId, session)
      const location = `${corsDomain}/s/${sessionId}`
      return {
        ...status.CREATED,
        body: JSON.stringify({ ...session, sessionId, location }),
        headers: { Location: location },
      }
    } catch (error) {
      logError(error)
      return status.INTERNAL_SERVER_ERROR
    }
  } catch (error) {
    return { ...status.BAD_REQUEST, body: JSON.stringify({ message: error.message }) }
  }
}
