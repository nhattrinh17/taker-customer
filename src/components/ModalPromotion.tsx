import React from 'react'
import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'
import Modal from 'react-native-modal'
import {Images} from 'assets/Images'
import {Icons} from 'assets/icons'

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: 'center',
  },
  contentModal: {
    alignItems: 'center',
  },
  iconClose: {
    position: 'absolute',
    top: 4,
    right: 0,
    zIndex: 100,
  },
  imageBanner: {
    width: Dimensions.get('window').width - 30,
    height: Dimensions.get('window').width - 30,
  },
})

interface Props {
  showModalPromotion: boolean
  onClose: () => void
  onPressPromotion: () => void
}

const ModalPromotion = ({
  onClose,
  showModalPromotion,
  onPressPromotion,
}: Props) => {
  return (
    <Modal
      isVisible={showModalPromotion}
      style={styles.modal}
      onBackdropPress={onClose}>
      <View style={styles.contentModal}>
        <View style={styles.iconClose}>
          <TouchableOpacity
            onPress={onClose}
            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
            <Icons.Close />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => {
            onPressPromotion()
            onClose()
          }}>
          <Image
            source={Images.Promotion}
            style={styles.imageBanner}
            resizeMode="cover"
          />
        </TouchableOpacity>
      </View>
    </Modal>
  )
}

export default ModalPromotion
