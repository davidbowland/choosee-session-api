import { applyPatch } from 'fast-json-patch'

import { APIGatewayProxyEventV2, APIGatewayProxyResultV2, PatchOperation, Session } from '../types'
import { getSessionById, setSessionById } from '../services/dynamodb'
import { log, logError } from '../utils/logging'
import { mutateObjectOnJsonPatch, throwOnInvalidJsonPatch } from '../config'
import { extractJsonPatchFromEvent } from '../utils/events'
import status from '../utils/status'

const applyJsonPatch = async (
  session: Session,
  sessionId: string,
  patchOperations: PatchOperation[]
): Promise<APIGatewayProxyResultV2<any>> => {
  const updatedSession = applyPatch(
    session,
    patchOperations,
    throwOnInvalidJsonPatch,
    mutateObjectOnJsonPatch
  ).newDocument
  try {
    await setSessionById(sessionId, updatedSession)
    return { ...status.OK, body: JSON.stringify(updatedSession) }
  } catch (error) {
    logError(error)
    return status.INTERNAL_SERVER_ERROR
  }
}

const patchById = async (
  sessionId: string,
  patchOperations: PatchOperation[]
): Promise<APIGatewayProxyResultV2<any>> => {
  try {
    const session = await getSessionById(sessionId)
    try {
      return await applyJsonPatch(session, sessionId, patchOperations)
    } catch (error) {
      return { ...status.BAD_REQUEST, body: JSON.stringify({ message: error.message }) }
    }
  } catch {
    return status.NOT_FOUND
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
