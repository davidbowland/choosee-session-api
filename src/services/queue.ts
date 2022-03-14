import axios, { AxiosResponse } from 'axios'

import { smsApiKey, smsApiUrl } from '../config'
import { SMSMessage } from '../types'

const api = axios.create({
  baseURL: smsApiUrl,
})

/* Emails */

const convertContentsToJson = (to: string, contents: string): SMSMessage => ({
  to,
  contents,
  messageType: 'TRANSACTIONAL',
})

export const sendSms = (to: string, contents: string): Promise<AxiosResponse> =>
  exports.sendRawSms(convertContentsToJson(to, contents))

export const sendRawSms = (body: SMSMessage): Promise<AxiosResponse> =>
  api.post('/messages', body, {
    headers: {
      'x-api-key': smsApiKey,
    },
  })