import { applyPatch } from 'fast-json-patch'

import { mutateObjectOnJsonPatch, throwOnInvalidJsonPatch } from '../config'
import { getDataById, setDataById } from '../services/dynamodb'
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2, PatchOperation } from '../types'
import { extractJsonPatchFromEvent } from '../utils/events'
import { log, logError } from '../utils/logging'
import status from '../utils/status'

const patchById = async (
  sessionId: string,
  patchOperations: PatchOperation[]
): Promise<APIGatewayProxyResultV2<any>> => {
  const link = await getDataById(sessionId)
  const updatedLink = applyPatch(link, patchOperations, throwOnInvalidJsonPatch, mutateObjectOnJsonPatch).newDocument
  try {
    await setDataById(sessionId, updatedLink)
    return { ...status.OK, body: JSON.stringify(updatedLink) }
  } catch (error) {
    logError(error)
    return status.INTERNAL_SERVER_ERROR
  }
}

export const patchItemHandler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2<any>> => {
  log('Received event', { ...event, body: undefined })
  try {
    const sessionId = event.pathParameters.sessionId
    const patchOperations = extractJsonPatchFromEvent(event)
    const result = await patchById(sessionId, patchOperations)
    return result
  } catch (error) {
    return { ...status.BAD_REQUEST, body: JSON.stringify({ message: error.message }) }
  }
}
