import { getDataById } from '../services/dynamodb'
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from '../types'
import { extractJwtFromEvent } from '../utils/events'
import { log } from '../utils/logging'
import status from '../utils/status'

const fetchById = async (sessionId: string, userId: string): Promise<APIGatewayProxyResultV2<any>> => {
  try {
    const data = await getDataById(sessionId)
    return { ...status.OK, body: JSON.stringify(data.decisions[userId] ?? {}) }
  } catch (error) {
    return status.NOT_FOUND
  }
}

export const getDecisionsByIdHandler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2<any>> => {
  log('Received event', { ...event, body: undefined })
  const sessionId = event.pathParameters.sessionId
  const userId = event.pathParameters.userId

  try {
    const jwtPayload = extractJwtFromEvent(event)
    if (jwtPayload === null || jwtPayload.phone_number !== userId) {
      return { ...status.FORBIDDEN, body: JSON.stringify({ message: 'Invalid JWT' }) }
    }
  } catch {
    log('No JWT found with request')
  }

  const result = await fetchById(sessionId, userId)
  return result
}
