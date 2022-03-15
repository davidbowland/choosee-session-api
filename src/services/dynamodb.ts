import { DynamoDB } from 'aws-sdk'

import { dynamodbTableName } from '../config'
import { Session, SessionBatch } from '../types'

const dynamodb = new DynamoDB({ apiVersion: '2012-08-10' })

/* Delete item */

export const deleteDataById = (sessionId: string): Promise<DynamoDB.Types.DeleteItemOutput> =>
  dynamodb
    .deleteItem({
      Key: {
        SessionId: {
          S: `${sessionId}`,
        },
      },
      TableName: dynamodbTableName,
    })
    .promise()

/* Get single item */

export const getDataById = (sessionId: string): Promise<Session> =>
  dynamodb
    .getItem({
      Key: {
        SessionId: {
          S: `${sessionId}`,
        },
      },
      TableName: dynamodbTableName,
    })
    .promise()
    .then((response) => response.Item.Data.S)
    .then(JSON.parse)

/* Scan for all items */

const getItemsFromScan = (response: DynamoDB.Types.ScanOutput): SessionBatch[] =>
  response.Items.map((item) => ({ id: item.SessionId.S, data: JSON.parse(item.Data.S) }))

export const scanData = (): Promise<SessionBatch[]> =>
  dynamodb
    .scan({
      AttributesToGet: ['Data', 'SessionId', 'Expiration'],
      TableName: dynamodbTableName,
    })
    .promise()
    .then((response) => getItemsFromScan(response))

/* Scan for expired items */

export const scanExpiredIds = (): Promise<any> =>
  dynamodb
    .scan({
      ExpressionAttributeValues: {
        ':v1': {
          N: '1',
        },
        ':v2': {
          N: `${new Date().getTime()}`,
        },
      },
      FilterExpression: 'Expiration BETWEEN :v1 AND :v2',
      IndexName: 'ExpirationIndex',
      TableName: dynamodbTableName,
    })
    .promise()
    .then((response) => response.Items.map((item) => item.SessionId.S))

/* Set item */

export const setDataById = (sessionId: string, data: Session): Promise<DynamoDB.Types.PutItemOutput> =>
  dynamodb
    .putItem({
      Item: {
        SessionId: {
          S: `${sessionId}`,
        },
        Expiration: {
          N: `${data.expiration ?? 0}`,
        },
        Data: {
          S: JSON.stringify(data),
        },
      },
      TableName: dynamodbTableName,
    })
    .promise()
