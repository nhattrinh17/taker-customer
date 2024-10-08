import {createNativeStackNavigator} from '@react-navigation/native-stack'
import {RootNavigatorParamList} from 'navigation/typings'
import React, {useEffect} from 'react'
import BottomStack from './BottomStack'
import HomePageStack from './HomeStack'
import ProfileStack from './ProfileStack'
import RequestServeStack from './RequestServeStack'
import Geolocation from '@react-native-community/geolocation'
import Schedule from 'modules/requestServe/views/Schedule'
import {useGetProfile} from 'services/src/profile'
import {userStore} from 'state/user'
import ChangePassword from 'modules/profile/ChangePassword'
import Referral from 'modules/profile/Referral'
import Support from 'modules/profile/Support'
import Wallet from 'modules/profile/Wallet'
import Infomation from 'modules/profile/Infomation'
import Privacy from 'modules/profile/Privacy'
import AccountSetting from 'modules/profile/AccountSetting'
import CommonWebView from 'components/CommonWebView'
import {userInfo} from 'state/user/typings'
import {StatusBar} from 'react-native'
import {Colors} from 'assets/Colors'
import Deposit from 'modules/wallet/Deposit'
import Withdraw from 'modules/wallet/Withdraw'
import Camera from 'components/Camera'
import useFirebaseNotifications from 'hooks/notificationsPermission'
import DetailOrderScreen from 'modules/activity/DetailOrder'

const Stack = createNativeStackNavigator<RootNavigatorParamList>()

const MainStack = () => {
  const {requestUserPermission} = useFirebaseNotifications()
  const setUser = userStore(state => state.setUser)
  const user = userStore(state => state.user)
  const {triggerGetProfile} = useGetProfile()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await triggerGetProfile()
        if (response?.data) {
          const newUser: userInfo = {
            ...user,
            fullName: response.data.fullName,
            avatar: response.data.avatar,
            phone: response.data.phone,
          }
          setUser(newUser)
        }
      } catch (err) {
        console.error('Error fetching profile:', err)
      }
    }
    fetchProfile()
  }, [triggerGetProfile])

  const getCurrentLocation = async () => {
    try {
      Geolocation.setRNConfiguration({
        skipPermissionRequests: false,
        authorizationLevel: 'whenInUse',
        locationProvider: 'auto',
        enableBackgroundLocationUpdates: true,
      })
    } catch (err) {
      console.log('Error get location ===>', err)
    }
  }
  useEffect(() => {
    requestUserPermission()
    getCurrentLocation()
  }, [])

  return (
    <>
      <StatusBar
        translucent={true}
        barStyle={'dark-content'}
        backgroundColor={Colors.transparent}
      />
      <Stack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName="BottomStack">
        <Stack.Screen name="BottomStack" component={BottomStack} />
        <Stack.Screen name="RequestServeStack" component={RequestServeStack} />
        <Stack.Screen name="HomePageStack" component={HomePageStack} />
        <Stack.Screen name="ProfileStack" component={ProfileStack} />
        <Stack.Screen name="Wallet" component={Wallet} />
        <Stack.Screen name="Referral" component={Referral} />
        <Stack.Screen name="ChangePassword" component={ChangePassword} />
        <Stack.Screen name="Support" component={Support} />
        <Stack.Screen name="Infomation" component={Infomation} />
        <Stack.Screen name="AccountSetting" component={AccountSetting} />
        <Stack.Screen name="Schedule" component={Schedule} />
        <Stack.Screen name="CommonWebView" component={CommonWebView} />
        <Stack.Screen name="Deposit" component={Deposit} />
        <Stack.Screen name="Withdraw" component={Withdraw} />
        <Stack.Screen name="Privacy" component={Privacy} />
        <Stack.Screen name="Camera" component={Camera} />
        <Stack.Screen name="DetailOrder" component={DetailOrderScreen} />
      </Stack.Navigator>
    </>
  )
}

export default MainStack
