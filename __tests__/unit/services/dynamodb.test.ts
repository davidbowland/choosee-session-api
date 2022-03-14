import { link, sessionId } from '../__mocks__'
import { deleteDataById, getDataById, scanData, scanExpiredIds, setDataById } from '@services/dynamodb'

const mockDeleteItem = jest.fn()
const mockGetItem = jest.fn()
const mockPutItem = jest.fn()
const mockScanTable = jest.fn()
jest.mock('aws-sdk', () => ({
  DynamoDB: jest.fn(() => ({
    deleteItem: (...args) => ({ promise: () => mockDeleteItem(...args) }),
    getItem: (...args) => ({ promise: () => mockGetItem(...args) }),
    putItem: (...args) => ({ promise: () => mockPutItem(...args) }),
    scan: (...args) => ({ promise: () => mockScanTable(...args) }),
  })),
}))

describe('dynamodb', () => {
  describe('deleteDataById', () => {
    test('expect index passed to delete', async () => {
      await deleteDataById(sessionId)
      expect(mockDeleteItem).toHaveBeenCalledWith({
        Key: {
          SessionId: {
            S: `${sessionId}`,
          },
        },
        TableName: 'choosee-table',
      })
    })
  })

  describe('getDataById', () => {
    beforeAll(() => {
      mockGetItem.mockResolvedValue({ Item: { Data: { S: JSON.stringify(link) } } })
    })

    test('expect id passed to get', async () => {
      await getDataById(sessionId)
      expect(mockGetItem).toHaveBeenCalledWith({
        Key: {
          SessionId: {
            S: `${sessionId}`,
          },
        },
        TableName: 'choosee-table',
      })
    })

    test('expect data parsed and returned', async () => {
      const result = await getDataById(sessionId)
      expect(result).toEqual(link)
    })
  })

  describe('scanData', () => {
    beforeAll(() => {
      mockScanTable.mockResolvedValue({
        Items: [{ SessionId: { S: `${sessionId}` }, Data: { S: JSON.stringify(link) } }],
      })
    })

    test('expect data parsed and returned', async () => {
      const result = await scanData()
      expect(result).toEqual([{ data: link, id: sessionId }])
    })

    test('expect empty object with no data returned', async () => {
      mockScanTable.mockResolvedValueOnce({ Items: [] })
      const result = await scanData()
      expect(result).toEqual([])
    })
  })

  describe('scanExpiredIds', () => {
    beforeAll(() => {
      mockScanTable.mockResolvedValue({
        Items: [{ SessionId: { S: `${sessionId}` } }],
      })
    })

    test('expect data parsed and returned', async () => {
      const result = await scanExpiredIds()
      expect(result).toEqual([sessionId])
    })

    test('expect empty object with no data returned', async () => {
      mockScanTable.mockResolvedValueOnce({ Items: [] })
      const result = await scanExpiredIds()
      expect(result).toEqual([])
    })
  })

  describe('setDataById', () => {
    test('expect index and data passed to put', async () => {
      await setDataById(sessionId, link)
      expect(mockPutItem).toHaveBeenCalledWith({
        Item: {
          SessionId: {
            S: `${sessionId}`,
          },
          Expiration: {
            N: `${link.expiration}`,
          },
          Data: {
            S: JSON.stringify(link),
          },
        },
        TableName: 'choosee-table',
      })
    })
  })
})
