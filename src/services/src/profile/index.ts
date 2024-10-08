import {fetcher} from '../fetcher'
import useSWRMutation from 'swr/dist/mutation'
import {Methods} from '../typings'
import Endpoint from '../Endpoint'
import {
  ResponseGetProfile,
  ParamsUpdatePassword,
  ResponseUpdate,
  ErrorProfile,
  ParamsUpdateInfomation,
  ParamsGetSignedUrl,
  ParamsDeposit,
  ResponseDeposit,
  ResponseGetBalance,
  ResponseSetFCMToken,
  ParamsSetFCMToken,
  ParamsGetReferal,
} from './typings'
import {omit} from 'lodash'

export const useGetProfile = () => {
  const {trigger} = useSWRMutation<ResponseGetProfile, any, string>(
    Endpoint.Profile.PROFILE,
    (url: string) => {
      return fetcher(url, Methods.GET)
    },
  )
  return {
    triggerGetProfile: trigger,
  }
}

export const useUpdatePassword = () => {
  return useSWRMutation<
    ResponseUpdate,
    ErrorProfile,
    string,
    ParamsUpdatePassword
  >(
    `${Endpoint.Profile.UPDATE_INFOMATION}`,
    (url: string, {arg}: {arg: ParamsUpdatePassword}) => {
      return fetcher(`${url}/${arg.id}`, Methods.PATCH, omit(arg, 'id'))
    },
  )
}

export const useUpdateInfomation = () => {
  return useSWRMutation<
    ResponseUpdate,
    ErrorProfile,
    string,
    ParamsUpdateInfomation
  >(
    `${Endpoint.Profile.UPDATE_INFOMATION}`,
    (url: string, {arg}: {arg: ParamsUpdateInfomation}) => {
      return fetcher(`${url}/${arg.id}`, Methods.PATCH, omit(arg, 'id'))
    },
  )
}

export const useGetReferral = () => {
  const {trigger} = useSWRMutation<Response, any, string, ParamsGetReferal>(
    Endpoint.Profile.REFERRAL,
    (url: string, {arg}: {arg: ParamsGetReferal}) => {
      return fetcher(`${url}`, Methods.GET, {...arg})
    },
  )
  return {
    triggerGetReferral: trigger,
  }
}

export const useGetSignedUrl = () => {
  const {trigger} = useSWRMutation<ResponseGetProfile, any, string>(
    Endpoint.Profile.SIGNED_URL,
    (url: string, {arg}: {arg: ParamsGetSignedUrl}) => {
      return fetcher(`${url}/?fileName=${arg}`, Methods.GET)
    },
  )
  return {
    triggerGetSignedUrl: trigger,
  }
}

export const useDeposit = () => {
  const {trigger} = useSWRMutation<ResponseDeposit, any, string, ParamsDeposit>(
    `${Endpoint.Wallet.DEPOSITS}`,
    (url: string, {arg}: {arg: ParamsDeposit}) => {
      return fetcher(url, Methods.POST, arg)
    },
  )
  return {
    triggerDeposit: trigger,
  }
}

export const useGetBalance = () => {
  const {trigger, data} = useSWRMutation<ResponseGetBalance, any, string>(
    Endpoint.Wallet.BALANCE,
    (url: string) => {
      return fetcher(`${url}`, Methods.GET)
    },
  )
  return {
    balance: data?.data ?? 0,
    triggerGetBalance: trigger,
  }
}

export const useWithdraw = () => {
  const {trigger} = useSWRMutation<ResponseDeposit, any, string, ParamsDeposit>(
    `${Endpoint.Wallet.WITHDRAW}`,
    (url: string, {arg}: {arg: ParamsDeposit}) => {
      return fetcher(url, Methods.POST, arg)
    },
  )
  return {
    triggerWithdraw: trigger,
  }
}

export const useSetFCMToken = () => {
  const {trigger} = useSWRMutation<
    ResponseSetFCMToken,
    any,
    string,
    ParamsSetFCMToken
  >(
    `${Endpoint.Profile.SET_FCM_TOKEN}`,
    (url: string, {arg}: {arg: ParamsSetFCMToken}) => {
      return fetcher(url, Methods.POST, arg)
    },
  )
  return {
    triggerUpdateFCMToken: trigger,
  }
}
