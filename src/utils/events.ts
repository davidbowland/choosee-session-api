import jwt from 'jsonwebtoken'

import { sessionExpireHours } from '../config'
import { APIGatewayProxyEventV2, NewSession, PatchOperation, StringObject } from '../types'

// 60 minutes * 60 seconds * 1000 milliseconds = 360_000
const EXPIRATION_DURATION = sessionExpireHours * 3_600_000

/* Choosee */

export const formatSession = (session: NewSession): NewSession => {
  if (!session.address) {
    throw new Error('address missing from request')
  }
  const lastExpiration = new Date().getTime() + EXPIRATION_DURATION
  if (session.expiration !== undefined && session.expiration > lastExpiration) {
    throw new Error('expiration is outside acceptable range')
  }
  if (['restaurant', 'meal_delivery', 'meal_takeaway', 'bar', 'cafe', 'night_club'].indexOf(session.type) < 0) {
    throw new Error('type must be one of "restaurant", "meal_delivery", "meal_takeaway", "bar", "cafe", "night_club"')
  }
  if (session.voterCount === undefined || session.voterCount < 1 || session.voterCount > 10) {
    throw new Error('voterCount must be 1 thru 10')
  }
  return {
    address: session.address,
    expiration: session.expiration ?? lastExpiration,
    openNow: session.openNow ?? false,
    type: session.type,
    voterCount: session.voterCount,
  }
}

/* Event */

const parseEventBody = (event: APIGatewayProxyEventV2): unknown =>
  JSON.parse(
    event.isBase64Encoded && event.body ? Buffer.from(event.body, 'base64').toString('utf8') : (event.body as string)
  )

export const extractNewSessionFromEvent = (event: APIGatewayProxyEventV2): NewSession =>
  formatSession(parseEventBody(event) as NewSession)

export const extractJsonPatchFromEvent = (event: APIGatewayProxyEventV2): PatchOperation[] =>
  parseEventBody(event) as PatchOperation[]

export const extractJwtFromEvent = (event: APIGatewayProxyEventV2): StringObject =>
  jwt.decode((event.headers.authorization || event.headers.Authorization).replace(/^Bearer /i, ''))
