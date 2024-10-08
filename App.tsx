import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import {SWRConfig, SWRConfiguration} from 'swr';
import CodePush, {CodePushOptions} from 'react-native-code-push';
import * as Sentry from '@sentry/react-native';
import RootNavigation from 'navigation/views/Navigation';

const configuration: SWRConfiguration = {
  shouldRetryOnError: false,
  dedupingInterval: 100,
  focusThrottleInterval: 500,
};

const isDebugMode = __DEV__;

const configCodePush: CodePushOptions = {
  checkFrequency: CodePush.CheckFrequency.ON_APP_START,
  installMode: CodePush.InstallMode.ON_NEXT_RESTART,
};

if (!isDebugMode) {
  Sentry.init({
    dsn: 'https://0c240aa0da6c52d971ca7928948847be@o4504056571232256.ingest.us.sentry.io/4507371974885376',
    tracesSampleRate: 1.0,
    attachScreenshot: true,
    _experiments: {
      profilesSampleRate: 1.0,
    },
  });
}

function App() {
  const connectToRemoteDebugger = () => {
    // NativeDevSettings.setIsDebuggingRemotely(true)
  };
  useEffect(() => {
    connectToRemoteDebugger();
  }, []);

  return (
    <SWRConfig value={configuration}>
      <RootNavigation />
    </SWRConfig>
  );
}

const AppWithCodePush = isDebugMode ? App : CodePush(configCodePush)(App);

export default isDebugMode ? AppWithCodePush : Sentry.wrap(AppWithCodePush);
