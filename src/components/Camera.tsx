import {RouteProp} from '@react-navigation/native'
import {Colors} from 'assets/Colors'
import {RootNavigatorParamList} from 'navigation/typings'
import {goBack} from 'navigation/utils/navigationUtils'
import React, {useRef} from 'react'
import {Dimensions, StyleSheet, TouchableOpacity, View} from 'react-native'
import {useCameraDevice, Camera} from 'react-native-vision-camera'
import {showMessageError} from 'utils/index'

const styles = StyleSheet.create({
  btCamera: {
    width: 96,
    height: 96,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.textSecondary,
    borderStyle: 'dotted',
  },
  wrapperCamera: {
    flex: 1,
    position: 'relative',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  camera: {
    flex: 1,
  },
  btTakePhoto: {
    position: 'absolute',
    bottom: 0,
    marginBottom: 32,
    left: 0,
    marginLeft: Dimensions.get('screen').width / 2 - 86 / 2,
    width: 86,
    height: 86,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 86 / 2,
  },
  circleOuter: {
    position: 'absolute',
    width: 86,
    height: 86,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 86 / 2,
    backgroundColor: Colors.white,
    bottom: 0,
    marginBottom: 32,
    marginLeft: Dimensions.get('screen').width / 2 - 86 / 2,
  },
  circleCenter: {
    width: 76,
    height: 76,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 76 / 2,
    backgroundColor: Colors.black,
  },
  circleInner: {
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 70 / 2,
    backgroundColor: Colors.white,
  },
})

interface Props {
  route: RouteProp<RootNavigatorParamList, 'Camera'>
}

const CameraScreen = ({route}: Props) => {
  const {onTakePicture} = route?.params
  const device = useCameraDevice('back')
  const camera = useRef<Camera>(null)

  const onTake = async () => {
    try {
      const picture = await camera.current?.takePhoto()
      console.log('picture ===>', picture)
      if (picture?.path) {
        onTakePicture(picture)
      }
    } catch (err) {
      showMessageError('Có lỗi xảy ra')
      goBack()
    }
  }
  if (!device) {
    return <View />
  }
  return (
    <View style={styles.wrapperCamera}>
      <Camera
        style={styles.camera}
        ref={camera}
        device={device}
        isActive={true}
        photo={true}
        enableZoomGesture={true}
        enableHighQualityPhotos={true}
      />

      <TouchableOpacity style={styles.circleOuter} onPress={onTake}>
        <View style={styles.circleCenter}>
          <View style={styles.circleInner} />
        </View>
      </TouchableOpacity>
    </View>
  )
}

export default CameraScreen
