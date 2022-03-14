import { corsDomain } from '../config'
import { setDataById } from '../services/dynamodb'
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from '../types'
import { extractLinkFromEvent } from '../utils/events'
import { getNextId } from '../utils/id-generator'
import { log, logError } from '../utils/logging'
import status from '../utils/status'

export const postItemHandler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2<any>> => {
  log('Received event', { ...event, body: undefined })
  try {
    const link = extractLinkFromEvent(event)
    try {
      const sessionId = await getNextId()
      await setDataById(sessionId, link)
      const location = `${corsDomain}/r/${sessionId}`
      return {
        ...status.CREATED,
        body: JSON.stringify({ ...link, sessionId, location }),
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
