import {fetcher, fetcherGoogle} from '../fetcher'
import {API_GOOGLE, API_GOOGLE_PLACE, API_KEY_GOOGLE} from '../APIConfig'
import {
  Methods,
  ParamGetDetailOrder,
  ParamsCancelTrip,
  ParamsCreateTrip,
  ParamsGetAddressLocation,
  ParamsGetDetailLocation,
  ParamsGetListService,
  ParamsGetListWalletTransaction,
  ParamsPlaceDetail,
  ParamsRateTrip,
  ParamsSearchHistory,
  ParamsSearchNearBy,
  ParamsSearchShoeMakers,
  ParamsSearchSuggestion,
  ResponseCancelTrip,
  ResponseCreateTrip,
  ResponseGetDetailLocation,
  ResponseGetDetailOrder,
  ResponseGetHistory,
  ResponseGetPaymentStatus,
  ResponseListHistoryActivity,
  ResponseListService,
  ResponsePlaceDetail,
  ResponseRateTrip,
  ResponseSearchHistory,
  ResponseSearchNearBy,
  ResponseSearchShoeMakers,
  ResponseServiceInProgress,
  ResponseWalletHistoryTransaction,
  ResultGetAddressLocation,
} from '../typings'
import useSWRMutation from 'swr/dist/mutation'
import Endpoint from '../Endpoint'

export const useGetAddressLocation = () => {
  return useSWRMutation<
    ResultGetAddressLocation,
    any,
    string,
    ParamsGetAddressLocation
  >(
    `${API_GOOGLE}/geocode/json`,
    (url: string, {arg}: {arg: ParamsGetAddressLocation}) => {
      return fetcherGoogle(url, Methods.GET, {...arg.params})
    },
  )
}

export const useGetDetailLocation = () => {
  const {trigger} = useSWRMutation<
    ResponseGetDetailLocation,
    any,
    string,
    ParamsGetDetailLocation
  >(
    `${API_GOOGLE_PLACE}`,
    (url: string, {arg}: {arg: ParamsGetDetailLocation}) => {
      return fetcherGoogle(
        `${url}/places/${arg.params?.places}`,
        Methods.GET,
        null,
        {
          'X-Goog-FieldMask': 'id,displayName,formattedAddress',
          'X-Goog-Api-Key': API_KEY_GOOGLE,
          languageCode: 'vi',
        },
      )
    },
  )
  return {
    triggerGetDetail: trigger,
  }
}

export const useSearchShoeMakers = () => {
  const {trigger} = useSWRMutation<
    ResponseSearchShoeMakers,
    any,
    string,
    ParamsSearchShoeMakers
  >(
    Endpoint.Search.SHOE_MAKERS,
    (url: string, {arg}: {arg: ParamsSearchShoeMakers}) => {
      return fetcher(
        `${url}?latitude=${arg?.latitude}&longitude=${arg?.longitude}`,
        Methods.GET,
      )
    },
  )
  return {
    triggerSearchShoeMakers: trigger,
  }
}

export const usePlaceDetail = () => {
  const {trigger} = useSWRMutation<
    ResponsePlaceDetail,
    any,
    string,
    ParamsPlaceDetail
  >(
    Endpoint.Search.PLACE_DETAIL,
    (url: string, {arg}: {arg: ParamsPlaceDetail}) => {
      return fetcher(
        `${url}?latitude=${arg?.latitude}&longitude=${arg?.longitude}`,
        Methods.GET,
      )
    },
  )
  return {
    triggerGetDetailPlace: trigger,
  }
}

export const useSearchSuggestion = () => {
  const {trigger} = useSWRMutation<
    ResponsePlaceDetail,
    any,
    string,
    ParamsSearchSuggestion
  >(
    Endpoint.Search.SEARCH_SUGGESTION,
    (url: string, {arg}: {arg: ParamsSearchSuggestion}) => {
      return fetcher(`${url}`, Methods.GET, {...arg})
    },
  )
  return {
    triggerSearchSuggestion: trigger,
  }
}

export const useSearchNearby = () => {
  const {trigger} = useSWRMutation<
    ResponseSearchNearBy,
    any,
    string,
    ParamsSearchNearBy
  >(
    Endpoint.Search.SEARCH_NEARBY,
    (url: string, {arg}: {arg: ParamsSearchNearBy}) => {
      return fetcher(`${url}`, Methods.GET, {...arg})
    },
  )
  return {
    triggerSearchNearBy: trigger,
  }
}

export const useGetListService = () => {
  const {trigger} = useSWRMutation<
    ResponseListService,
    any,
    string,
    ParamsGetListService
  >(
    Endpoint.Services.LIST_SERVICE,
    (url: string, {arg}: {arg: ParamsGetListService}) => {
      return fetcher(`${url}`, Methods.GET, {...arg})
    },
  )
  return {
    triggerListService: trigger,
  }
}

export const useCreateTrip = () => {
  const {trigger} = useSWRMutation<
    ResponseCreateTrip,
    any,
    string,
    ParamsCreateTrip
  >(
    Endpoint.Trip.CREATE_TRIP,
    (url: string, {arg}: {arg: ParamsCreateTrip}) => {
      return fetcher(`${url}`, Methods.POST, {...arg})
    },
  )
  return {
    triggerCreateTrip: trigger,
  }
}

export const useCancelTrip = () => {
  const {trigger} = useSWRMutation<
    ResponseCancelTrip,
    any,
    string,
    ParamsCancelTrip
  >(
    Endpoint.Trip.CANCEL_TRIP,
    (url: string, {arg}: {arg: ParamsCancelTrip}) => {
      return fetcher(`${url}`, Methods.POST, {...arg})
    },
  )
  return {
    triggerCancelTrip: trigger,
  }
}

export const useGetServiceInProgress = () => {
  const {trigger} = useSWRMutation<ResponseServiceInProgress, any, string>(
    Endpoint.Activities.IN_PROGRESS,
    (url: string) => {
      return fetcher(`${url}`, Methods.GET)
    },
  )
  return {
    triggerServiceInProgress: trigger,
  }
}

export const useGetListHistoryActivity = () => {
  const {trigger} = useSWRMutation<
    ResponseListHistoryActivity,
    any,
    string,
    ParamsGetListService
  >(
    Endpoint.Activities.HISTORY,
    (url: string, {arg}: {arg: ParamsGetListService}) => {
      return fetcher(`${url}`, Methods.GET, {...arg})
    },
  )
  return {
    triggerListHistory: trigger,
  }
}

export const useRateTrip = () => {
  const {trigger} = useSWRMutation<
    ResponseRateTrip,
    any,
    string,
    ParamsRateTrip
  >(Endpoint.Trip.RATE_TRIP, (url: string, {arg}: {arg: ParamsRateTrip}) => {
    return fetcher(`${url}`, Methods.POST, {...arg})
  })
  return {
    triggerRateTrip: trigger,
  }
}

export const useCreateSearchHistory = () => {
  const {trigger} = useSWRMutation<
    ResponseSearchHistory,
    any,
    string,
    ParamsSearchHistory
  >(
    Endpoint.SEARCH_HISTORY,
    (url: string, {arg}: {arg: ParamsSearchHistory}) => {
      return fetcher(`${url}`, Methods.POST, {...arg})
    },
  )
  return {
    triggerCreateHistory: trigger,
  }
}

export const useGetSearchHistory = () => {
  const {trigger} = useSWRMutation<ResponseGetHistory, any, string>(
    Endpoint.SEARCH_HISTORY,
    (url: string) => {
      return fetcher(`${url}`, Methods.GET)
    },
  )
  return {
    triggerGetSearchHistory: trigger,
  }
}

export const useGetListHistoryWalletTransaction = () => {
  const {trigger} = useSWRMutation<
    ResponseWalletHistoryTransaction,
    any,
    string,
    ParamsGetListWalletTransaction
  >(
    Endpoint.Wallet.HISTORY_TRANSACTIONS,
    (url: string, {arg}: {arg: ParamsGetListWalletTransaction}) => {
      return fetcher(`${url}`, Methods.GET, {...arg})
    },
  )
  return {
    triggerGetWalletHistory: trigger,
  }
}

export const useGetDetailOrder = () => {
  const {trigger} = useSWRMutation<
    ResponseGetDetailOrder,
    any,
    string,
    ParamGetDetailOrder
  >(Endpoint.Trip.DETAIL, (url: string, {arg}: {arg: ParamGetDetailOrder}) => {
    return fetcher(`${url}/${arg?.id}`, Methods.GET)
  })
  return {
    triggerGetDetailOrder: trigger,
  }
}

export const useGetPaymentStatus = () => {
  const {trigger} = useSWRMutation<
    ResponseGetPaymentStatus,
    any,
    string,
    ParamGetDetailOrder
  >(Endpoint.Trip.DETAIL, (url: string, {arg}: {arg: ParamGetDetailOrder}) => {
    return fetcher(`${url}/${arg?.id}/payment-status`, Methods.GET)
  })
  return {
    triggerGetPaymentStatus: trigger,
  }
}
