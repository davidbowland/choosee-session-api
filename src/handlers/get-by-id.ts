import { getDataById, setDataById } from '../services/dynamodb'
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2, Link } from '../types'
import { log, logError } from '../utils/logging'
import status from '../utils/status'

const incrementAccessCount = async (sessionId: string, link: Link): Promise<void> => {
  try {
    await setDataById(sessionId, { ...link, accessCount: link.accessCount + 1, lastAccessed: new Date().getTime() })
  } catch (error) {
    logError(error)
  }
}

const fetchById = async (sessionId: string): Promise<APIGatewayProxyResultV2<any>> => {
  try {
    const link = await getDataById(sessionId)
    await incrementAccessCount(sessionId, link)

    return { ...status.OK, body: JSON.stringify({ ...link, sessionId }) }
  } catch (error) {
    return status.NOT_FOUND
  }
}

export const getByIdHandler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2<any>> => {
  log('Received event', { ...event, body: undefined })
  const sessionId = event.pathParameters.sessionId
  const result = await fetchById(sessionId)
  return result
}
