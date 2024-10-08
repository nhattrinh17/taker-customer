import useSWRMutation from 'swr/dist/mutation'
import Endpoint from '../Endpoint'
import {fetcher} from '../fetcher'
import {
  Methods,
  ParamsGetNotification,
  ParamsMakeReadNotification,
  ResponseGetNotification,
} from '../typings'

export const useGetNotification = () => {
  const {trigger} = useSWRMutation<
    ResponseGetNotification,
    any,
    string,
    ParamsGetNotification
  >(
    Endpoint.Notification.GET_LIST,
    (url: string, {arg}: {arg: ParamsGetNotification}) => {
      return fetcher(`${url}`, Methods.GET, {...arg})
    },
  )
  return {
    triggerGetNotification: trigger,
  }
}

export const useReadNotification = () => {
  const {trigger} = useSWRMutation<
    ResponseGetNotification,
    any,
    string,
    ParamsMakeReadNotification
  >(
    Endpoint.Notification.GET_LIST,
    (url: string, {arg}: {arg: ParamsMakeReadNotification}) => {
      return fetcher(`${url}/${arg.id}/mark-as-read`, Methods.PATCH)
    },
  )
  return {
    triggerReadNotification: trigger,
  }
}
