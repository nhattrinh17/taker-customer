import {StatusActivity} from 'modules/activity/typings'
import {LatLng} from 'react-native-maps'

export enum Methods {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}
export interface ParamsGetAddressLocation {
  params: {
    latlng: string
    language: string
    result_type: string
    location_type: string
    enable_address_descriptor: boolean
    key: string
  }
}

interface ItemAddressComponents {
  long_name: string
  short_name: string
  types: string[]
}

export interface ResultGetAddressLocation {
  data: {
    plus_code: {
      compound_code: string
      global_code: string
    }
    results: [
      {
        address_components: ItemAddressComponents[]
        formatted_address: string
        geometry: {
          location: {
            lat: number
            lng: number
          }
          location_type: string
          viewport: {
            northeast: {
              lat: number
              lng: number
            }
            southwest: {
              lat: number
              lng: number
            }
          }
        }
        place_id: string
        plus_code: {
          compound_code: string
          global_code: string
        }
        types: string[]
      },
    ]
    status: string
  }
}

export interface ParamsGetDetailLocation {
  params: {
    places: string
  }
}

export interface ResponseGetDetailLocation {
  data: {
    id: string
    formattedAddress: string
    displayName: {
      text: string
    }
  }
}

export interface DetailLocation {
  name: string
  address: string
  placeID: string
}

export interface ParamsSearchShoeMakers {
  latitude: string | number
  longitude: string | number
}

export interface ParamsPlaceDetail {
  latitude: string | number
  longitude: string | number
}

export interface ResponseSearchShoeMakers {
  type: string
  data: LatLng[]
}

export interface ResponsePlaceDetail {
  type: string
  data: LocationPlaceDetail[]
}
interface Address {
  label: string
  countryCode: string
  countryName: string
  county: string
  city: string
  district: string
  street?: string
  postalCode: string
  houseNumber?: string
}

export interface LocationPlaceDetail {
  title: string
  address: Address
  distance: number
  position: {
    lat: number
    lng: number
  }
}

export interface DataPlaceDetail {
  id: string
  formattedAddress: string
  displayName: {
    text: string
  }
}

interface Location {
  lat: number
  lng: number
}

interface Viewport {
  northeast: Location
  southwest: Location
}

export interface Geometry {
  location: Location
  viewport?: Viewport
}

export interface Place {
  name: string
  vicinity: string
  geometry: Geometry
  place_id: string
}

export interface ResponseSearchSuggestion {
  type: string
  data: Place[]
}

export interface ParamsSearchSuggestion {
  keyword: string
  latitude: string | number
  longitude: string | number
}

export interface ParamsSearchNearBy {
  latitude: string | number
  longitude: string | number
}

export interface ResponseSearchNearBy {
  data: ItemResponseSearchNearBy[]
  type: string
}

export interface ItemResponseSearchNearBy {
  id: string | number
  longitude: number | string
  latitude: number | string
  formattedAddress: string
  displayName: {
    text: string
    // languageCode: string
  }
}

export interface ParamsGetListService {
  take: number
  skip: number
}

export interface ItemService {
  icon: string
  name: string
  price: number
  discountPrice: number
  discount: null | number
  id: string
  createdAt: string
  updatedAt: string
}

export interface ResponseListService {
  data: ItemService[]
  type: string
}

export interface ParamsCreateTrip {
  customerId: string
  latitude: string | number
  longitude: string | number
  paymentMethod: string
  services: serve.Services[]
  images?: string[]
  addressNote?: string
  address: string
  scheduleTime?: number
}

export interface ResponseCreateTrip {
  data: {tripId: string; paymentUrl?: string}
  type: string
}

export interface ParamsCancelTrip {
  tripId: any
  reason: string
}

export interface ResponseCancelTrip {
  data: any
  type: string
}

export interface ResponseServiceInProgress {
  type: string
  data: ItemInProgress[]
}

export interface Service {
  price: number
  discountPrice: number | null
  discount: any
  quantity: number
  name: string
}

interface Shoemaker {
  id: string
  name: string
  phoneNumber: string
  latitude: string
  longitude: string
  avatar: string
}

interface Rating {
  rating: number
}

export interface ItemInProgress {
  orderId: string
  id: string
  status: StatusActivity
  latitude: string
  longitude: string
  address: any
  totalPrice: number
  paymentMethod: string
  services: Service[]
  shoemaker: Shoemaker
}

export interface ItemHistory {
  createdAt: string
  id: string
  status: string
  latitude: string
  longitude: string
  address: null | string
  totalPrice: number
  rating: Rating
  shoemaker: Shoemaker
  // services: Service[]
}

export interface ResponseListHistoryActivity {
  data: ItemHistory[]
  type: string
}

export interface ParamsRateTrip {
  tripId: string
  shoemakerId: string
  comment: string
  rating: number
}

export interface ResponseRateTrip {
  data: string
  type: string
}

export interface ParamsSearchHistory {
  latitude: string | number
  longitude: string | number
  name: string
  address: string
}

export interface ResponseSearchHistory {
  data: string
  type: string
}

export interface ItemSearchHistory {
  address: string
  latitude: string
  longitude: string
  name: string
}

export interface ResponseGetHistory {
  type: string
  data: ItemSearchHistory[]
}

export interface ParamsGetListWalletTransaction {
  take: number
  skip: number
}

export interface ResponseWalletHistoryTransaction {
  data: ItemHistoryTransaction[]
  type: string
}

export interface ItemHistoryTransaction {
  amount: number
  description: string
  transactionDate: string
  transactionType: 'DEPOSIT' | 'WITHDRAW'
  status: 'SUCCESS' | 'PENDING' | 'FAILED'
}

export interface ParamGetDetailOrder {
  id: string
}

export interface ResponseGetDetailOrder {
  data: DetailOrder
  type: string
}

export interface ResponseGetPaymentStatus {
  data: string
  type: string
}

interface Rating {
  rating: number
  comment: string
}

interface ServiceOrder {
  price: number
  discountPrice: number
  discount: number | null
  quantity: number
  name: string
}

interface ShoeMaker {
  name: string
  phone: string
  avatar: string | null
}

export interface DetailOrder {
  rating: Rating
  services: ServiceOrder[]
  shoemaker: ShoeMaker
  orderId: string
  totalPrice: number
  images: string | null
  receiveImages: string[]
  completeImages: string[]
  paymentMethod: string
  paymentStatus: string
  address: string
  addressNote: string | null
  fee: number
  income: number
}

export interface ItemNotification {
  id: string
  createdAt: string
  title: string
  content: string
  data: null | string
  isRead: boolean
}

export interface ItemDataNotification {
  screen: string
}

export interface ParamsGetNotification {
  take: number
  skip: number
}

export interface ResponseGetNotification {
  data: {
    notifications: ItemNotification[]
    total: number
  }
  type: string
}

export interface ParamsMakeReadNotification {
  id: string
}
