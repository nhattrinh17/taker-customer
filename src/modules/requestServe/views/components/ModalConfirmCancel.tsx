import {Colors} from 'assets/Colors'
import {Fonts} from 'assets/Fonts'
import CommonText from 'components/CommonText'
import React from 'react'
import {View, StyleSheet, TouchableOpacity} from 'react-native'
import Modal from 'react-native-modal'

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: 'flex-end',
    marginHorizontal: 0,
    marginBottom: 0,
  },
  contentModal: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 40,
    alignContent: 'center',
  },
  labelModal: {
    marginTop: 8,
    color: Colors.textPrimary,
    fontSize: Fonts.fontSize[15],
  },
  itemModal: {
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  textLogout: {
    color: Colors.red,
    fontWeight: '600',
    fontSize: Fonts.fontSize[15],
  },
  itemCancel: {
    alignItems: 'center',
    paddingVertical: 10,
    marginBottom: 30,
  },
})
interface Props {
  showModal: boolean
  onConfirm: (value: boolean) => () => void
}

const ModalConfirmCancel = ({showModal, onConfirm}: Props) => {
  return (
    <Modal
      isVisible={showModal}
      style={styles.modal}
      onBackdropPress={onConfirm(false)}>
      <View style={styles.contentModal}>
        <View style={styles.itemModal}>
          <CommonText
            text="Bạn có chắc chắn muốn hủy đơn này?"
            styles={styles.labelModal}
          />
        </View>
        <TouchableOpacity style={styles.itemModal} onPress={onConfirm(true)}>
          <CommonText text="Hủy đơn" styles={styles.textLogout} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.itemCancel} onPress={onConfirm(false)}>
          <CommonText text="Hủy" styles={styles.labelModal} />
        </TouchableOpacity>
      </View>
    </Modal>
  )
}

export default ModalConfirmCancel
