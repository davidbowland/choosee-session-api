import { deleteDataById, getDataById } from '../services/dynamodb'
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from '../types'
import { log, logError } from '../utils/logging'
import status from '../utils/status'

const fetchDataThenDelete = async (sessionId: string): Promise<APIGatewayProxyResultV2<any>> => {
  try {
    const data = await getDataById(sessionId)
    try {
      await deleteDataById(sessionId)
      return { ...status.OK, body: JSON.stringify(data) }
    } catch (error) {
      logError(error)
      return status.INTERNAL_SERVER_ERROR
    }
  } catch (error) {
    return status.NO_CONTENT
  }
}

export const deleteByIdHandler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2<any>> => {
  log('Received event', { ...event, body: undefined })
  const sessionId = event.pathParameters.sessionId
  const result = await fetchDataThenDelete(sessionId)
  return result
}
