import { NewSession, PatchOperation, Restaurant, Session } from '@types'

export const sessionId = 'abc123'

export const restaurant: Restaurant = {
  name: 'Columbia',
  openHours: undefined,
  pic: 'Aap_uEDinckK9Ca3tIgxigpNxy1THsppgE5H9ie_tFEc5pDYIDTSC52cWtEWifvmRD6_jhRuo4IsiRY5AZK2Y6_NRv4i_vsANZZpvsXj4gfkT4iYwpAp_i7tVHYRAgJ03ki3JzRv5_ouIPOpa9_uYavGE5fdhADeXeGRhkZnGWPXu5RxJpD1',
  priceLevel: 1,
  rating: 2,
  vicinity: 'Columbia',
}

export const session: Session = {
  address: '90210',
  choices: [restaurant],
  decisions: {},
  expiration: 987654321,
  lastAccessed: 123456789,
  location: {
    lat: 38.9517053,
    lng: -92.3340724,
  },
  nextPageToken:
    'Aap_uED5ulA1bsoLWnkyaDlG1aoxuxgcx8pxnXBzkdbURX3PZwuzXgFtdbkLlJxjvqqCRa1iug_VSAiISjiApmg9yLOXQgWjMDbXuAGnVZaFARBlnfsRe5tjjVx_PKYEZv7iHNYwcvXR9eWvp8k1XMDBkj7Ja-YpLe9r8eAy1nZC-O9-1_M-lRNMNBr3YxCvWY57VXcP5F6-EPpj5vMAoHQ2e65TBGofxvsAkUX8HSvbHTKDCcYoQJUmwJQfeamM9H5stiJ137Ip98aMrEASSqCYCf9osGhRx7lbjZl4jUYKS-Y-8BejokmFWLtldff0SKuKQQrlef4E0xrdXr1jUh-uRVZTJoCq6Ki1AhiSM9qEvl0_EHYzAMbeQ9bCn0O_AlO6xstNfozKpz8SXXEiqpWaGXyaUqz-NU2facRhhZqPROSb',
  openNow: true,
  type: 'restaurant',
  radius: 45_000,
}

export const newSession: NewSession = {
  address: '90210',
  type: 'restaurant',
  radius: 45_000,
}

export const jsonPatchOperations: PatchOperation[] = [{ op: 'replace', path: '/address', value: '90036' }]

export const jwt =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE2NDY0NTM0MDgsImV4cCI6MTY3Nzk4OTQwOCwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsInBob25lX251bWJlciI6IisxNTU1MTIzNDU2NyIsIm5hbWUiOiJEYXZlIn0.cGg6zUrwlpzMIaczADmZLJgNDXMBPR2Gdixx_XlDr9Y'

export const decodedJwt = {
  name: 'Dave',
  phone_number: '+15551234567',
}

export const geocodeResult = {
  data: {
    results: [
      {
        address_components: [
          {
            long_name: '65202',
            short_name: '65202',
            types: ['postal_code'],
          },
          {
            long_name: 'Columbia',
            short_name: 'Columbia',
            types: ['locality', 'political'],
          },
          {
            long_name: 'Missouri',
            short_name: 'MO',
            types: ['administrative_area_level_1', 'political'],
          },
          {
            long_name: 'United States',
            short_name: 'US',
            types: ['country', 'political'],
          },
        ],
        formatted_address: '90210',
        geometry: {
          bounds: {
            northeast: {
              lat: 39.1343699,
              lng: -92.0693709,
            },
            southwest: {
              lat: 38.86871,
              lng: -92.49803009999999,
            },
          },
          location: {
            lat: 39.0013395,
            lng: -92.31283259999999,
          },
          location_type: 'APPROXIMATE',
          viewport: {
            northeast: {
              lat: 39.1343699,
              lng: -92.0693709,
            },
            southwest: {
              lat: 38.86871,
              lng: -92.49803009999999,
            },
          },
        },
        place_id: 'ChIJH1jvHSXG3IcRT7WVXYMmQ6w',
        postcode_localities: [
          'Cleveland Township',
          'Columbia',
          'Columbia Township',
          'Katy Township',
          'Missouri Township',
          'Perche Township',
          'Rocky Fork Township',
        ],
        types: ['postal_code'],
      },
    ],
    status: 'OK',
  },
}

export const placeResponse = {
  data: {
    html_attributions: [],
    next_page_token:
      'Aap_uED5ulA1bsoLWnkyaDlG1aoxuxgcx8pxnXBzkdbURX3PZwuzXgFtdbkLlJxjvqqCRa1iug_VSAiISjiApmg9yLOXQgWjMDbXuAGnVZaFARBlnfsRe5tjjVx_PKYEZv7iHNYwcvXR9eWvp8k1XMDBkj7Ja-YpLe9r8eAy1nZC-O9-1_M-lRNMNBr3YxCvWY57VXcP5F6-EPpj5vMAoHQ2e65TBGofxvsAkUX8HSvbHTKDCcYoQJUmwJQfeamM9H5stiJ137Ip98aMrEASSqCYCf9osGhRx7lbjZl4jUYKS-Y-8BejokmFWLtldff0SKuKQQrlef4E0xrdXr1jUh-uRVZTJoCq6Ki1AhiSM9qEvl0_EHYzAMbeQ9bCn0O_AlO6xstNfozKpz8SXXEiqpWaGXyaUqz-NU2facRhhZqPROSb',
    results: [
      {
        business_status: 'OPERATIONAL',
        geometry: {
          location: {
            lat: 38.94866949999999,
            lng: -92.32790639999999,
          },
          viewport: {
            northeast: {
              lat: 38.9499477802915,
              lng: -92.3268417197085,
            },
            southwest: {
              lat: 38.9472498197085,
              lng: -92.3295396802915,
            },
          },
        },
        icon: 'https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/generic_business-71.png',
        icon_background_color: '#7B9EB0',
        icon_mask_base_uri: 'https://maps.gstatic.com/mapfiles/place_api/icons/v2/generic_pinlet',
        name: "Shakespeare's Pizza - Downtown",
        opening_hours: {
          open_now: false,
        },
        photos: [
          {
            height: 3024,
            html_attributions: [
              '\u003ca href="https://maps.google.com/maps/contrib/102034557880036131940"\u003eSafy AJ\u003c/a\u003e',
            ],
            photo_reference:
              'Aap_uEDnq1leRNWMFguihkB3NOZLOPHAvCkbEuqVo_jFdd61VgnV5Dn0VKNjN_GTSdj1tXVVstqK0mXq5nmWj40MyoW_R3XqkDMkyv_oAnaYy1wSTF4eMbeljLCPptVFfyxpM1yOMPSzj4O9nh0xROEIp506mnD2bqQnEN-qaEsC_l-TRFLX',
            width: 4032,
          },
        ],
        place_id: 'ChIJk8cmpsa33IcRbKLpDn3le4g',
        plus_code: {
          compound_code: 'WMXC+FR Columbia, MO, USA',
          global_code: '86C9WMXC+FR',
        },
        price_level: 2,
        rating: 4.6,
        reference: 'ChIJk8cmpsa33IcRbKLpDn3le4g',
        scope: 'GOOGLE',
        types: [
          'meal_delivery',
          'meal_takeaway',
          'liquor_store',
          'restaurant',
          'food',
          'point_of_interest',
          'store',
          'establishment',
        ],
        user_ratings_total: 2060,
        vicinity: '225 South 9th Street, Columbia',
      },
    ],
    status: 'OK',
  },
}

export const placeResult = {
  data: [
    {
      name: "Shakespeare's Pizza - Downtown",
      openHours: undefined,
      pic: 'Aap_uEDnq1leRNWMFguihkB3NOZLOPHAvCkbEuqVo_jFdd61VgnV5Dn0VKNjN_GTSdj1tXVVstqK0mXq5nmWj40MyoW_R3XqkDMkyv_oAnaYy1wSTF4eMbeljLCPptVFfyxpM1yOMPSzj4O9nh0xROEIp506mnD2bqQnEN-qaEsC_l-TRFLX',
      priceLevel: 2,
      rating: 4.6,
      vicinity: '225 South 9th Street, Columbia',
    },
  ],
  nextPageToken:
    'Aap_uED5ulA1bsoLWnkyaDlG1aoxuxgcx8pxnXBzkdbURX3PZwuzXgFtdbkLlJxjvqqCRa1iug_VSAiISjiApmg9yLOXQgWjMDbXuAGnVZaFARBlnfsRe5tjjVx_PKYEZv7iHNYwcvXR9eWvp8k1XMDBkj7Ja-YpLe9r8eAy1nZC-O9-1_M-lRNMNBr3YxCvWY57VXcP5F6-EPpj5vMAoHQ2e65TBGofxvsAkUX8HSvbHTKDCcYoQJUmwJQfeamM9H5stiJ137Ip98aMrEASSqCYCf9osGhRx7lbjZl4jUYKS-Y-8BejokmFWLtldff0SKuKQQrlef4E0xrdXr1jUh-uRVZTJoCq6Ki1AhiSM9qEvl0_EHYzAMbeQ9bCn0O_AlO6xstNfozKpz8SXXEiqpWaGXyaUqz-NU2facRhhZqPROSb',
}
