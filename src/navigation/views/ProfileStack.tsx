import {createNativeStackNavigator} from '@react-navigation/native-stack'
import Profile from 'modules/profile/Profile'
import {RootNavigatorParamList} from 'navigation/typings'
import React from 'react'

const Stack = createNativeStackNavigator<RootNavigatorParamList>()

const ProfileStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="Profile">
      <Stack.Screen name="Profile" component={Profile} />
    </Stack.Navigator>
  )
}

export default ProfileStack
