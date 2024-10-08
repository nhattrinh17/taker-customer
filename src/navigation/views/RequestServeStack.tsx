import {createNativeStackNavigator} from '@react-navigation/native-stack'
import Camera from 'components/Camera'
import CancelOrder from 'modules/requestServe/views/CancelOrder'
import ChooseLocation from 'modules/requestServe/views/ChooseLocation'
import ChooseLocationOnMap from 'modules/requestServe/views/ChooseLocationOnMap'
import ChooseProduct from 'modules/requestServe/views/ChooseProduct'
import FindMaker from 'modules/requestServe/views/FindMaker'
import OrderInformation from 'modules/requestServe/views/OrderInformation'
import RateOrder from 'modules/requestServe/views/RateOrder'
import {RootNavigatorParamList} from 'navigation/typings'
import React from 'react'

const Stack = createNativeStackNavigator<RootNavigatorParamList>()

const RequestServeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="ChooseLocation">
      <Stack.Screen name="ChooseLocation" component={ChooseLocation} />
      <Stack.Screen
        name="ChooseLocationOnMap"
        component={ChooseLocationOnMap}
      />
      <Stack.Screen name="ChooseProduct" component={ChooseProduct} />
      <Stack.Screen name="OrderInformation" component={OrderInformation} />
      <Stack.Screen name="Camera" component={Camera} />
      <Stack.Screen name="FindMaker" component={FindMaker} />
      <Stack.Screen name="CancelOrder" component={CancelOrder} />
      <Stack.Screen name="RateOrder" component={RateOrder} />
    </Stack.Navigator>
  )
}

export default RequestServeStack
