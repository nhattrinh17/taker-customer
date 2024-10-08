import {fetcher} from '../fetcher'
import useSWRMutation from 'swr/dist/mutation'
import {Methods} from '../typings'
import Endpoint from '../Endpoint'
import {omit} from 'lodash'

export const useVerifyPhoneNumber = () => {
  return useSWRMutation<
    auth.ResponseVerifyPhoneNumber,
    auth.Error,
    string,
    auth.ParamsVerifyPhoneNumber
  >(
    `${Endpoint.Auth.VERIFY_PHONE_NUMBER}`,
    (url: string, {arg}: {arg: auth.ParamsVerifyPhoneNumber}) => {
      return fetcher(url, Methods.POST, arg)
    },
  )
}
export const useCreateAccount = () => {
  const {trigger} = useSWRMutation<
    auth.ResponeCreateAccount,
    auth.Error,
    string,
    auth.ParamsCreateAccount
  >(
    `${Endpoint.Auth.CREATE_ACCOUNT}`,
    (url: string, {arg}: {arg: auth.ParamsCreateAccount}) => {
      return fetcher(url, Methods.POST, arg)
    },
  )
  return {
    triggerCreateAccount: trigger,
  }
}

export const useLogin = () => {
  const {trigger, error} = useSWRMutation<
    auth.ResponeLogin,
    auth.Error,
    string,
    auth.ParamsLogin
  >(`${Endpoint.Auth.LOGIN}`, (url: string, {arg}: {arg: auth.ParamsLogin}) => {
    return fetcher(url, Methods.POST, arg)
  })
  return {triggerLogin: trigger, error}
}

export const useForgotPassword = () => {
  const {trigger} = useSWRMutation<
    auth.ResponeForgotPassword,
    auth.Error,
    string,
    auth.ParamsForgotPassword
  >(
    `${Endpoint.Auth.FORGOT_PASSWORD}`,
    (url: string, {arg}: {arg: auth.ParamsForgotPassword}) => {
      return fetcher(url, Methods.POST, arg)
    },
  )
  return {triggerForgotPassword: trigger}
}

export const useVerifyOtp = () => {
  const {trigger} = useSWRMutation<
    auth.ResponseVerifyOTP,
    auth.Error,
    string,
    auth.ParamsVerifyOTP
  >(
    `${Endpoint.Auth.VERIFY_OTP}`,
    (url: string, {arg}: {arg: auth.ParamsVerifyOTP}) => {
      return fetcher(url, Methods.POST, arg)
    },
  )
  return {triggerVerifyOtp: trigger}
}

export const useUpdate = () => {
  const {trigger} = useSWRMutation<
    auth.ResponseUpdate,
    auth.Error,
    string,
    auth.ParamsUpdate
  >(
    `${Endpoint.Auth.UPDATE_INFOMATION}`,
    (url: string, {arg}: {arg: auth.ParamsUpdate}) => {
      return fetcher(
        `${url}/${arg.userId}/new-password`,
        Methods.POST,
        omit(arg, 'userId'),
      )
    },
  )
  return {triggerUpdate: trigger}
}

export const useLogout = () => {
  const {trigger} = useSWRMutation<auth.ResponseLogout, auth.Error, string>(
    `${Endpoint.Auth.LOGOUT}`,
    (url: string) => {
      return fetcher(`${url}`, Methods.POST)
    },
  )
  return {triggerLogout: trigger}
}

export const useSendSMS = () => {
  const {trigger} = useSWRMutation<
    auth.ResponseVerifyPhoneNumber,
    auth.Error,
    string,
    auth.ParamsVerifyPhoneNumber
  >(
    `${Endpoint.Auth.SEND_SMS}`,
    (url: string, {arg}: {arg: auth.ParamsVerifyPhoneNumber}) => {
      return fetcher(url, Methods.POST, arg)
    },
  )
  return {
    triggerSendSMS: trigger,
  }
}
