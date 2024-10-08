import {create} from 'zustand'
import {createJSONStorage, persist} from 'zustand/middleware'
import {userInfo} from './typings'
import AsyncStorage from '@react-native-async-storage/async-storage'

type State = {
  token: string
  setToken: (token: string) => void
  user: userInfo
  setUser: (user: userInfo) => void
  showModalWarningPermissionAndroid: boolean
  setShowModalWarningPermissionAndroid: (value: boolean) => void
  fcmToken: string
  setFCMToken: (value: string) => void
}

export const userStore = create<State, [['zustand/persist', State]]>(
  persist(
    set => ({
      showModalWarningPermissionAndroid: false,
      setFCMToken: (value: string) => set({fcmToken: value}),
      fcmToken: '',
      user: {
        fullName: '',
        phone: '',
        id: '',
        avatar: '',
      },
      token: '',
      setUser: (user: userInfo) => set({user}),
      setToken: async (token: string) => {
        await AsyncStorage.setItem('token', token)
        set({token})
      },
      setShowModalWarningPermissionAndroid: (value: boolean) =>
        set({showModalWarningPermissionAndroid: value}),
    }),
    {
      name: 'userStore',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
)
