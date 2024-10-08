import axios, {AxiosError} from 'axios'
import {Methods} from './typings'
import {userStore} from 'state/user'
import {BASE_URL} from './APIConfig'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Sentry from '@sentry/react-native'
import {err} from 'react-native-svg'

const setToken = userStore.getState().setToken

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 50000,
})

axiosInstance.interceptors.response.use(
  response => {
    if (response?.data.error?.status === 401) {
      setToken('')
      return response
    }
    return response
  },
  error => {
    if (error?.response?.data?.statusCode === 401) {
      setToken('')
      return error
    }
    throw error
  },
)

const getToken = async () => {
  return (await AsyncStorage.getItem('token')) ?? ''
}

export const fetcherAxios = async ({
  url,
  method,
  data,
}: {
  url: string
  method: Methods
  data: any
}) => {
  try {
    let response
    const tokenFromStorage = await getToken()
    if (tokenFromStorage) {
      axiosInstance.defaults.headers.common.Authorization = `Bearer ${tokenFromStorage}`
    }
    switch (method) {
      case Methods.GET:
        response = await axiosInstance.get(url, {params: data})
        break
      case Methods.POST:
        response = await axiosInstance.post(url, data)
        break
      case Methods.PUT:
        response = await axiosInstance.put(url, data)
        break
      case Methods.DELETE:
        response = await axiosInstance.delete(url)
        break
      case Methods.PATCH:
        response = await axiosInstance.patch(url, data)
        break
      default:
        throw new Error(`Unsupported Methods: ${Methods}`)
    }
    return response
  } catch (error) {
    throw error
  }
}

export const fetcher = async (url: string, method: Methods, data?: any) => {
  try {
    const response = await fetcherAxios({url, method, data})
    console.log(`RESPONSE api ===> ${url}`, response)
    return response.data
  } catch (error) {
    const errorResponse = error as AxiosError
    Sentry.captureException(`Error API: {
      url: ${url},
      params: ${JSON.stringify(data)},
      response: ${JSON.stringify(errorResponse?.response?.data)},
    }`)
    console.log('error fetcher', errorResponse?.response)
    throw errorResponse?.response
  }
}

export const fetcherGoogle = async (
  url: string,
  method: Methods,
  data?: any,
  headers?: any,
) => {
  return axios.get(url, {params: data, headers: {...headers}})
}
