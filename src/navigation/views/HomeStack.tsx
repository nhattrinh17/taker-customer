const Stack = createNativeStackNavigator<RootNavigatorParamList>();
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CleanHouse from 'modules/home/CleanHouse';
import Home from 'modules/home/Home';
import Store from 'modules/home/Store';
import Booking from 'modules/home/Booking';
import Bike from 'modules/home/Bike';
import { RootNavigatorParamList } from 'navigation/typings';
import React, { useEffect } from 'react';
import { userStore } from 'state/user';
import { SocketEvents, SocketService } from 'socketIO';
const HomePageStack = () => {
  const token = userStore(state => state.token);
  console.log('🚀 ~ HomePageStack ~ token:', token);
  const socketService = SocketService.getInstance(token);

  useEffect(() => {
    console.log('==================================socketService ===>', socketService);
    socketService.on(SocketEvents.CONNECT, () => {
      console.log('connected socket ===>');
    });

    socketService.on(SocketEvents.DISCONNECT, data => {
      console.log('Disconnected socket ===>', data);
    });

    // RECONNECT
    socketService.on(SocketEvents.RECONNECT_ATTEMPT, data => {
      console.log('reconnect attempt socket ===>', data);
    });

    socketService.on(SocketEvents.RECONNECTING, data => {
      console.log('reconnecting socket ===>', data);
    });

    socketService.on(SocketEvents.RECONNECT, data => {
      console.log('reconnected socket ===>', data);
    });

    socketService.on(SocketEvents.RECONNECT_FAILED, data => {
      console.log('reconnect failed socket ===>', data);
    });
  }, []);
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Home">
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Store" component={Store} />
      <Stack.Screen name="CleanHouse" component={CleanHouse} />
      <Stack.Screen name="Booking" component={Booking} />
      <Stack.Screen name="Bike" component={Bike} />
    </Stack.Navigator>
  );
};

export default HomePageStack;
