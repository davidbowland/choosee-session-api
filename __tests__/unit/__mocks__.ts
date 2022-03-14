import { Link, PatchOperation } from '@types'

export const sessionId = 'abc123'

export const link: Link = {
  accessCount: 7,
  expiration: 1646033707709,
  lastAccessed: 1646033707710,
  url: 'https://dbowland.com/',
}

export const jsonPatchOperations: PatchOperation[] = [{ op: 'replace', path: '/url', value: 'https://bowland.link/' }]

export const jwt =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE2NDY0NTM0MDgsImV4cCI6MTY3Nzk4OTQwOCwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsInBob25lX251bWJlciI6IisxNTU1MTIzNDU2NyIsIm5hbWUiOiJEYXZlIn0.cGg6zUrwlpzMIaczADmZLJgNDXMBPR2Gdixx_XlDr9Y'

export const decodedJwt = {
  name: 'Dave',
  phone_number: '+15551234567',
}

export const placeResult = {
  html_attributions: [],
  next_page_token:
    'Aap_uED5ulA1bsoLWnkyaDlG1aoxuxgcx8pxnXBzkdbURX3PZwuzXgFtdbkLlJxjvqqCRa1iug_VSAiISjiApmg9yLOXQgWjMDbXuAGnVZaFARBlnfsRe5tjjVx_PKYEZv7iHNYwcvXR9eWvp8k1XMDBkj7Ja-YpLe9r8eAy1nZC-O9-1_M-lRNMNBr3YxCvWY57VXcP5F6-EPpj5vMAoHQ2e65TBGofxvsAkUX8HSvbHTKDCcYoQJUmwJQfeamM9H5stiJ137Ip98aMrEASSqCYCf9osGhRx7lbjZl4jUYKS-Y-8BejokmFWLtldff0SKuKQQrlef4E0xrdXr1jUh-uRVZTJoCq6Ki1AhiSM9qEvl0_EHYzAMbeQ9bCn0O_AlO6xstNfozKpz8SXXEiqpWaGXyaUqz-NU2facRhhZqPROSb',
  results: [
    {
      geometry: {
        location: {
          lat: 38.9517053,
          lng: -92.3340724,
        },
        viewport: {
          northeast: {
            lat: 39.02944001796318,
            lng: -92.22819401696474,
          },
          southwest: {
            lat: 38.86354801693589,
            lng: -92.43348392953305,
          },
        },
      },
      icon: 'https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/geocode-71.png',
      icon_background_color: '#7B9EB0',
      icon_mask_base_uri: 'https://maps.gstatic.com/mapfiles/place_api/icons/v2/generic_pinlet',
      name: 'Columbia',
      photos: [
        {
          height: 3120,
          html_attributions: [
            '\u003ca href="https://maps.google.com/maps/contrib/115107950862657956633"\u003eRondy Phelps\u003c/a\u003e',
          ],
          photo_reference:
            'Aap_uEDinckK9Ca3tIgxigpNxy1THsppgE5H9ie_tFEc5pDYIDTSC52cWtEWifvmRD6_jhRuo4IsiRY5AZK2Y6_NRv4i_vsANZZpvsXj4gfkT4iYwpAp_i7tVHYRAgJ03ki3JzRv5_ouIPOpa9_uYavGE5fdhADeXeGRhkZnGWPXu5RxJpD1',
          width: 4160,
        },
      ],
      place_id: 'ChIJyYKBu_Or3IcRIG-9ui1pEaA',
      reference: 'ChIJyYKBu_Or3IcRIG-9ui1pEaA',
      scope: 'GOOGLE',
      types: ['locality', 'political'],
      vicinity: 'Columbia',
    },
  ],
  status: 'OK',
}

export const geocodeResult = {
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
      formatted_address: 'Columbia, MO 65202, USA',
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
}
