import { applyPatch } from 'fast-json-patch'

import { APIGatewayProxyEventV2, APIGatewayProxyResultV2, PatchOperation, Session } from '../types'
import { extractJsonPatchFromEvent, extractJwtFromEvent } from '../utils/events'
import { getDataById, setDataById } from '../services/dynamodb'
import { log, logError } from '../utils/logging'
import { mutateObjectOnJsonPatch, throwOnInvalidJsonPatch } from '../config'
import status from '../utils/status'
import { updateSessionStatus } from '../utils/session'

const applyJsonPatch = async (
  session: Session,
  sessionId: string,
  userId: string,
  patchOperations: PatchOperation[]
): Promise<APIGatewayProxyResultV2<any>> => {
  const decisions = session.decisions[userId] || {}
  const updatedDecisions = applyPatch(
    decisions,
    patchOperations,
    throwOnInvalidJsonPatch,
    mutateObjectOnJsonPatch
  ).newDocument
  try {
    const updatedSession = await updateSessionStatus({
      ...session,
      decisions: { ...session.decisions, [userId]: updatedDecisions },
    })
    log('Updated session', { prevSession: session, sessionId, updatedDecisions, updatedSession })
    await setDataById(sessionId, updatedSession)
    return { ...status.OK, body: JSON.stringify(updatedDecisions) }
  } catch (error) {
    logError(error)
    return status.INTERNAL_SERVER_ERROR
  }
}

const patchById = async (
  sessionId: string,
  userId: string,
  patchOperations: PatchOperation[]
): Promise<APIGatewayProxyResultV2<any>> => {
  try {
    const session = await getDataById(sessionId)
    try {
      return await applyJsonPatch(session, sessionId, userId, patchOperations)
    } catch (error) {
      return { ...status.BAD_REQUEST, body: JSON.stringify({ message: error.message }) }
    }
  } catch {
    return status.NOT_FOUND
  }
}

export const patchDecisionByIdHandler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2<any>> => {
  log('Received event', { ...event, body: undefined })
  try {
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

    const patchOperations = extractJsonPatchFromEvent(event)
    const result = await patchById(sessionId, userId, patchOperations)
    return result
  } catch (error) {
    return { ...status.BAD_REQUEST, body: JSON.stringify({ message: error.message }) }
  }
}
