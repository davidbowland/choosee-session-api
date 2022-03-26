import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from '../types'
import { getDataById } from '../services/dynamodb'
import { log } from '../utils/logging'
import status from '../utils/status'

const fetchById = async (sessionId: string): Promise<APIGatewayProxyResultV2<any>> => {
  try {
    const data = await getDataById(sessionId)
    return { ...status.OK, body: JSON.stringify(data.choices) }
  } catch (error) {
    return status.NOT_FOUND
  }
}

export const getChoicesByIdHandler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2<any>> => {
  log('Received event', { ...event, body: undefined })
  const sessionId = event.pathParameters.sessionId
  const result = await fetchById(sessionId)
  return result
}
