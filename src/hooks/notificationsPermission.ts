import {navigate} from 'navigation/utils/navigationUtils'
import {useEffect} from 'react'
import {Platform, PermissionsAndroid} from 'react-native'
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging'
import {useSetFCMToken} from 'services/src/profile'
import {NOTIFICATIONS_SCREEN} from 'utils/index'

export default function useFirebaseNotifications() {
  const {triggerUpdateFCMToken} = useSetFCMToken()
  const setFCMTokenUser = async () => {
    if (true) {
      try {
        await messaging().registerDeviceForRemoteMessages()
        const isDeviceRegisteredForRemoteMessages =
          messaging().isDeviceRegisteredForRemoteMessages
        if (isDeviceRegisteredForRemoteMessages) {
          if (await messaging().hasPermission()) {
            await messaging().deleteToken()
            const token = await messaging().getToken()
            console.log('token ==>', token)
            if (token) {
              try {
                await triggerUpdateFCMToken({fcmToken: token})
              } catch (err) {
                //
              }
            }
          }
        }
      } catch (err) {
        //
      }
    }
  }

  const requestUserPermission = async () => {
    if (Platform.OS === 'ios') {
      const authStatus = await messaging().requestPermission()
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL
      if (enabled) {
        setFCMTokenUser()
      }
    } else {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      )
      setFCMTokenUser()
    }
  }

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      // TODO:
      console.log('A new FCM message arrived!', JSON.stringify(remoteMessage))
    })
    return unsubscribe
  }, [])

  const openNotification = (message: FirebaseMessagingTypes.RemoteMessage) => {
    console.log('MESSAGE ==>', message)
    if (message?.data?.screen) {
      if (message?.data?.screen) {
        switch (message?.data?.screen) {
          case NOTIFICATIONS_SCREEN.CUSTOMER_CARE:
            break
          case NOTIFICATIONS_SCREEN.DETAIL_NOTIFICATION:
            break
          case NOTIFICATIONS_SCREEN.HOME:
            navigate('Home')
            break
          case NOTIFICATIONS_SCREEN.REQUEST_TRIP:
            navigate('RequestServeStack')
            break
          case NOTIFICATIONS_SCREEN.WALLET:
            navigate('Wallet')
            break
          default:
            navigate('Notification')
            break
        }
      }
    }
    navigate('Notification')
  }

  useEffect(() => {
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage,
      )
      openNotification(remoteMessage)
    })

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.notification,
          )
        }
      })
  }, [])

  return {
    requestUserPermission,
  }
}
