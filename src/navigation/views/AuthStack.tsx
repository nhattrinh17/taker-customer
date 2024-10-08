import React from 'react'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import {RootNavigatorParamList} from 'navigation/typings'
import Intro from 'modules/auth/Intro'
import Phone from 'modules/auth/Phone'
import Otp from 'modules/auth/Otp'
import AuthInfomation from 'modules/auth/AuthInfomation'
import NewPassword from 'modules/auth/NewPassword'
import LoginPassword from 'modules/auth/LoginPassword'
import CommonWebView from 'components/CommonWebView'

const Stack = createNativeStackNavigator<RootNavigatorParamList>()

const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="Intro">
      <Stack.Screen name="Intro" component={Intro} />
      <Stack.Screen name="Phone" component={Phone} />
      <Stack.Screen name="LoginPassword" component={LoginPassword} />
      <Stack.Screen name="Otp" component={Otp} />
      <Stack.Screen name="NewPassword" component={NewPassword} />
      <Stack.Screen name="AuthInfomation" component={AuthInfomation} />
      <Stack.Screen name="CommonWebView" component={CommonWebView} />
    </Stack.Navigator>
  )
}

export default AuthStack
