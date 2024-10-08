import {LatLng} from 'react-native-maps'
import {ItemInProgress} from 'services/src/typings'
import {create} from 'zustand'

type State = {
  schedule?: null | Date
  name: string
  orderInProgress: ItemInProgress[]
  tripId?: null | string
  maker: LatLng | null
  latitude: string | number
  longitude: string | number
  address: string
  note: string
  updateLocation: ({
    latitude,
    longitude,
    note,
    address,
    name,
  }: {
    latitude: number
    longitude: number
    note?: string
    address: string
    name?: string
  }) => void
  updateMaker: (maker: LatLng) => void
  updateTripID: (tripId: string) => void
  updateSchedule: (schedule: Date | null) => void
  updateOrderInProgress: (orderInProgress: ItemInProgress[]) => void
}

export const serveRequestStore = create<State>(set => ({
  orderInProgress: [],
  schedule: null,
  tripId: null,
  latitude: 0,
  longitude: 0,
  note: '',
  address: '',
  name: '',
  updateLocation: ({latitude, longitude, note, address, name}) => {
    set({latitude, longitude, note, address, name})
  },
  maker: null,
  updateMaker: (maker: LatLng) => {
    set({maker})
  },
  updateTripID: (tripId: string) => {
    set({tripId})
  },
  updateSchedule: (schedule: Date | null) => {
    set({schedule})
  },
  updateOrderInProgress: (orderInProgress: ItemInProgress[]) => {
    set({orderInProgress})
  },
}))
