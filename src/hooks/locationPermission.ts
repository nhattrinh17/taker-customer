import {Platform} from 'react-native'
import {request, PERMISSIONS, check} from 'react-native-permissions'

const isIOS = Platform.OS === 'ios'
export default function usePermission() {
  const checkPermission = async () => {
    try {
      let responseCheck
      if (isIOS) {
        responseCheck = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
      } else {
        responseCheck = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
      }
      return responseCheck
    } catch (err) {
      throw err
    }
  }

  const requestPermission = async () => {
    try {
      let result
      if (isIOS) {
        result = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
      } else {
        result = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
      }
      console.log('Permission ===>', result)
      return result
    } catch (err) {
      console.log('Error ===>', err)
      throw err
    }
  }

  return {
    requestPermissionLocation: requestPermission,
    checkPermissionLocation: checkPermission,
  }
}
