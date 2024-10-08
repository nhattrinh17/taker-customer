import {NavigationContainer} from '@react-navigation/native';
import {navigationRef} from 'navigation/utils/navigationUtils';
import React, {useEffect} from 'react';
import {NativeModules, Platform, StyleSheet} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {userStore} from 'state/user';
import {appStore} from 'state/app';
import Toast, {BaseToast, ToastConfig} from 'react-native-toast-message';
import {Fonts} from 'assets/Fonts';
import {Colors} from 'assets/Colors';

import AuthStack from './AuthStack';
import MainStack from './MainStack';
import Loading from 'components/Loading';

const styles = StyleSheet.create({
  text2Style: {
    fontSize: Fonts.fontSize[14],
    fontFamily: Fonts.fontFamily.AvertaBold,
  },
  typeSuccess: {
    borderLeftColor: 'green',
  },
  typeError: {
    borderLeftColor: Colors.red,
  },
});

const customToast: ToastConfig = {
  success: props => (
    <BaseToast
      {...props}
      style={styles.typeSuccess}
      text2Style={styles.text2Style}
    />
  ),
  error: props => (
    <BaseToast
      {...props}
      style={styles.typeError}
      text2Style={styles.text2Style}
    />
  ),
};

const RootNavigation = () => {
  const {SplashScreen} = NativeModules;
  const isLogin = userStore(state => state.token);
  // console.log('🚀 ~ RootNavigation ~ isLogin:', isLogin);
  const isLoading = appStore(state => state.loading);
  useEffect(() => {
    if (Platform.OS === 'android') {
      SplashScreen.hide();
    }
  }, []);

  return (
    <>
      <SafeAreaProvider>
        <NavigationContainer ref={navigationRef}>
          {isLogin ? <MainStack /> : <AuthStack />}
          {isLoading && <Loading />}
        </NavigationContainer>
      </SafeAreaProvider>
      <Toast config={customToast} />
    </>
  );
};

export default RootNavigation;
