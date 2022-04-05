import { APIGatewayProxyEventV2, APIGatewayProxyResultV2, NewSession, Session } from '../types'
import { log, logError } from '../utils/logging'
import { createChoices } from '../services/maps'
import { extractNewSessionFromEvent } from '../utils/events'
import { getNextId } from '../utils/id-generator'
import { setDataById } from '../services/dynamodb'
import status from '../utils/status'

const createNewSession = async (newSession: NewSession): Promise<APIGatewayProxyResultV2<any>> => {
  try {
    const choice = await createChoices({
      address: newSession.address,
      expiration: newSession.expiration,
      openNow: newSession.openNow,
      pagesPerRound: newSession.pagesPerRound,
      type: newSession.type,
    })

    try {
      const sessionId = await getNextId()
      const session: Session = {
        address: choice.address,
        choiceId: choice.choiceId,
        decisions: {},
        expiration: newSession.expiration,
        lastAccessed: 0,
        location: choice.latLng,
        openNow: choice.openNow,
        pagesPerRound: choice.pagesPerRound,
        status: {
          current: choice.choices.length > 0 ? 'deciding' : 'finished',
          pageId: 0,
        },
        type: choice.type,
        voterCount: newSession.voterCount,
      }
      log('Creating session', { session, sessionId })
      await setDataById(sessionId, session)

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
    return await createNewSession(newSession)
  } catch (error) {
    return { ...status.BAD_REQUEST, body: JSON.stringify({ message: error.message }) }
  }
}
