import { APIGatewayProxyEventV2, APIGatewayProxyResultV2, NewSession, RankByType, Session } from '../types'
import { extractJwtFromEvent, extractNewSessionFromEvent } from '../utils/events'
import { log, logError } from '../utils/logging'
import { createChoices } from '../services/maps'
import { getNextId } from '../utils/id-generator'
import { setSessionById } from '../services/dynamodb'
import status from '../utils/status'

const createNewSession = async (newSession: NewSession, owner?: string): Promise<APIGatewayProxyResultV2<any>> => {
  try {
    const choice = await createChoices({
      address: newSession.address,
      expiration: newSession.expiration,
      maxPrice: newSession.maxPrice,
      minPrice: newSession.minPrice,
      openNow: newSession.openNow,
      pagesPerRound: newSession.pagesPerRound,
      radius: newSession.radius,
      rankBy: newSession.rankBy,
      type: newSession.type,
    })

    try {
      const sessionId = await getNextId()
      const session: Session = {
        address: choice.address,
        choiceId: choice.choiceId,
        expiration: newSession.expiration,
        location: choice.latLng,
        maxPrice: choice.maxPrice,
        minPrice: choice.minPrice,
        openNow: choice.openNow,
        owner,
        pagesPerRound: choice.pagesPerRound,
        radius: choice.radius,
        rankBy: choice.rankBy as RankByType,
        status: {
          current: choice.choices.length > 0 ? 'deciding' : 'finished',
          pageId: 0,
        },
        type: choice.type,
        voterCount: newSession.voterCount,
      }
      log('Creating session', { session, sessionId })
      await setSessionById(sessionId, session)

      return {
        ...status.CREATED,
        body: JSON.stringify({ ...session, sessionId }),
      }
    } catch (error) {
      logError(error)
      return status.INTERNAL_SERVER_ERROR
    }
  } catch (error) {
    return { body: JSON.stringify(error.response.data), statusCode: error.response.status }
  }
}

export const postItemHandler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2<any>> => {
  log('Received event', { ...event, body: undefined })
  try {
    const newSession = extractNewSessionFromEvent(event)
    const jwtPayload = extractJwtFromEvent(event)
    return await createNewSession(newSession, jwtPayload === null ? undefined : jwtPayload.sub)
  } catch (error) {
    return { ...status.BAD_REQUEST, body: JSON.stringify({ message: error.message }) }
  }
}
