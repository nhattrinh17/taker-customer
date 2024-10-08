import {create} from 'zustand'

type State = {
  turnOnNotification: boolean
  loading: boolean
  setLoading: (loading: boolean) => void
}

export const appStore = create<State>(set => ({
  turnOnNotification: false,
  loading: false,
  setLoading: loading => set({loading}),
}))
