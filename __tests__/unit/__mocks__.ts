import {
  Choice,
  Decision,
  NewChoice,
  NewSession,
  PatchOperation,
  Place,
  PlaceDetailsResponseData,
  Session,
} from '@types'

export const choiceId = '123abc'

export const choice: Choice = {
  address: 'Columbia, MO 65203, USA',
  choices: [
    {
      name: 'Love Sushi',
      pic: 'https://lh3.googleusercontent.com/places/AAcXr8oBxiksR5oYZQn-zWB0nAq28N8_8NwS22B5DgfqUhbufLJG46BLgNnLw-le9aH3GJw8fO6R4zGuDdjr-91Xzz_jyU_XQAvvCLg=s1600-w400-h300',
      placeId: 'ChIJSQVzHAW23IcR8J6g9IzzZ0k',
      priceLevel: 1,
      rating: 4.4,
      vicinity: '2101 West Broadway Suite S, Columbia',
    },
  ],
  expiration: 1649131360051,
  latLng: {
    lat: 38.9538484,
    lng: -92.3714428,
  },
  nextPageToken:
    'Aap_uEBe77WMktiYhLhjbqPV2oSOlCeiCE_bzSszaUUpFtPRDp-UAKfNsRwa1JehQEidpzl0bY6XvmJ5smSz8S6weXEb7u-2r2tldpoGZmjnrhmdDnnLkJlujVDJmIz_ACwth2yWuRuZuVUnZj3tgT-minYVN60-aO4rpQ5YOt_YekIrW9b1CnRq0MLhaaBT-J684V9qWSGTRXq_pMqoKtgG-JhDrQJUnH2WbpNXebyxhOnAujlFsTyPzrFtvb59qZMYOG7MiM7MHSAEv1SM9WTG-BEiHkS2NVvsT7JYeXFg03zYC-ZmMpBhKIYHH4F_KX6gEecJR57gDOa3lO3dmFSAdvk6TwviV7iN3_RjpuH3gHOXCZJ9JBpud3_53fXfszO1SM7Mh5MdG0XLA9r7ubxxQHT-aIhy7OAnqs8Wm_HpLRS7qdjGLYINlTBMxAIXN50',
  openNow: false,
  pagesPerRound: 1,
  type: 'restaurant',
}

export const newChoice: NewChoice = {
  address: 'Columbia, MO 65203, USA',
  type: 'restaurant',
}

export const place: Place = {
  name: 'Columbia',
  openHours: undefined,
  pic: 'Aap_uEDinckK9Ca3tIgxigpNxy1THsppgE5H9ie_tFEc5pDYIDTSC52cWtEWifvmRD6_jhRuo4IsiRY5AZK2Y6_NRv4i_vsANZZpvsXj4gfkT4iYwpAp_i7tVHYRAgJ03ki3JzRv5_ouIPOpa9_uYavGE5fdhADeXeGRhkZnGWPXu5RxJpD1',
  placeId: '2345678ihbnmf',
  priceLevel: 1,
  rating: 2,
  vicinity: 'Columbia',
}

export const decision: Decision = {
  decisions: { "Shakespeare's Pizza - Downtown": true },
}

export const newSession: NewSession = {
  address: 'Columbia, MO 65203, USA',
  type: 'restaurant',
  voterCount: 2,
}

export const session: Session = {
  address: 'Columbia, MO 65203, USA',
  choiceId,
  expiration: 1649131360051,
  lastAccessed: 123456789,
  location: {
    lat: 38.9538484,
    lng: -92.3714428,
  },
  openNow: false,
  pagesPerRound: 1,
  status: {
    current: 'deciding',
    pageId: 0,
  },
  type: 'restaurant',
  voterCount: 2,
}

export const sessionId = 'abc123'

export const jsonPatchOperations: PatchOperation[] = [{ op: 'replace', path: '/address', value: '90036' }]

export const jwt =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE2NDY0NTM0MDgsImV4cCI6MTY3Nzk4OTQwOCwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsInBob25lX251bWJlciI6IisxNTU1MTIzNDU2NyIsIm5hbWUiOiJEYXZlIn0.cGg6zUrwlpzMIaczADmZLJgNDXMBPR2Gdixx_XlDr9Y'

export const userId = '+15551234567'

export const decodedJwt = {
  name: 'Dave',
  phone_number: userId,
}

export const placeDetailsResponse: PlaceDetailsResponseData = {
  error_message: '',
  html_attributions: [],
  result: {
    formatted_address: '225 S 9th St, Columbia, MO 65201, USA',
    formatted_phone_number: '(573) 449-2454',
    international_phone_number: '+1 573-449-2454',
    name: "Shakespeare's Pizza - Downtown",
    opening_hours: {
      open_now: true,
      periods: [
        {
          close: {
            day: 0,
            time: '2200',
          },
          open: {
            day: 0,
            time: '1100',
          },
        },
        {
          close: {
            day: 1,
            time: '2200',
          },
          open: {
            day: 1,
            time: '1100',
          },
        },
        {
          close: {
            day: 2,
            time: '2200',
          },
          open: {
            day: 2,
            time: '1100',
          },
        },
        {
          close: {
            day: 3,
            time: '2200',
          },
          open: {
            day: 3,
            time: '1100',
          },
        },
        {
          close: {
            day: 4,
            time: '2200',
          },
          open: {
            day: 4,
            time: '1100',
          },
        },
        {
          close: {
            day: 5,
            time: '2300',
          },
          open: {
            day: 5,
            time: '1100',
          },
        },
        {
          close: {
            day: 6,
            time: '2300',
          },
          open: {
            day: 6,
            time: '1100',
          },
        },
      ],
      weekday_text: [
        'Monday: 11:00 AM – 10:00 PM',
        'Tuesday: 11:00 AM – 10:00 PM',
        'Wednesday: 11:00 AM – 10:00 PM',
        'Thursday: 11:00 AM – 10:00 PM',
        'Friday: 11:00 AM – 11:00 PM',
        'Saturday: 11:00 AM – 11:00 PM',
        'Sunday: 11:00 AM – 10:00 PM',
      ],
    },
    website: 'http://www.shakespeares.com/',
  },
  status: 'OK',
} as PlaceDetailsResponseData

export const placeId = 'ChIJk8cmpsa33IcRbKLpDn3le4g'

export const placeResult = {
  data: [
    {
      name: "Shakespeare's Pizza - Downtown",
      openHours: undefined,
      pic: 'a-picture-stream',
      placeId: 'ChIJk8cmpsa33IcRbKLpDn3le4g',
      priceLevel: 2,
      rating: 4.6,
      vicinity: '225 South 9th Street, Columbia',
    },
  ],
  nextPageToken:
    'Aap_uED5ulA1bsoLWnkyaDlG1aoxuxgcx8pxnXBzkdbURX3PZwuzXgFtdbkLlJxjvqqCRa1iug_VSAiISjiApmg9yLOXQgWjMDbXuAGnVZaFARBlnfsRe5tjjVx_PKYEZv7iHNYwcvXR9eWvp8k1XMDBkj7Ja-YpLe9r8eAy1nZC-O9-1_M-lRNMNBr3YxCvWY57VXcP5F6-EPpj5vMAoHQ2e65TBGofxvsAkUX8HSvbHTKDCcYoQJUmwJQfeamM9H5stiJ137Ip98aMrEASSqCYCf9osGhRx7lbjZl4jUYKS-Y-8BejokmFWLtldff0SKuKQQrlef4E0xrdXr1jUh-uRVZTJoCq6Ki1AhiSM9qEvl0_EHYzAMbeQ9bCn0O_AlO6xstNfozKpz8SXXEiqpWaGXyaUqz-NU2facRhhZqPROSb',
}
