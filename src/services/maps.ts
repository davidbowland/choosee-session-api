import axios from 'axios'

import { Choice, NewChoice, Place, PlaceDetailsResponseData } from '../types'
import { mapsApiKey, mapsApiUrl } from '../config'

const api = axios.create({
  baseURL: mapsApiUrl,
  headers: { 'x-api-key': mapsApiKey },
})

export const advanceRounds = (choiceId: string): Promise<Choice> =>
  api.post(`/choices/${encodeURIComponent(choiceId)}/advance`, {}, {}).then((response) => response.data)

export const createChoices = (body: NewChoice): Promise<Choice> =>
  api.post('/choices', body, {}).then((response) => response.data)

export const fetchChoices = (choiceId: string): Promise<Place[]> =>
  api.get(`/choices/${encodeURIComponent(choiceId)}`).then((response) => response.data.choices)

export const fetchPlaceDetails = (placeId: string): Promise<PlaceDetailsResponseData> =>
  api.get(`/places/${encodeURIComponent(placeId)}`).then((response) => response.data)
