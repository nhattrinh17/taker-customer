import React, {useState} from 'react'
import {View, StyleSheet, TouchableOpacity, ScrollView} from 'react-native'
import CommonText from 'components/CommonText'
import {Colors} from 'assets/Colors'
import Header from 'components/Header'
import {Fonts} from 'assets/Fonts'
import Modal from 'react-native-modal'
import {userStore} from 'state/user'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  wrapper: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: Colors.white,
  },
  item: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingVertical: 20,
  },
  title: {
    fontSize: Fonts.fontSize[16],
    color: Colors.textPrimary,
  },
  label: {
    fontSize: Fonts.fontSize[13],
    color: Colors.textSecondary,
  },
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

const AccountSetting = () => {
  const [showModal, setShowModal] = useState<boolean>(false)
  const setToken = userStore(state => state.setToken)

  const onBackdropPress = () => {
    setShowModal(false)
  }

  const deleteAccount = () => {
    setShowModal(false)
    setTimeout(() => {
      setToken('')
    }, 1000)
  }

  return (
    <View style={styles.container}>
      <Header title="Cài đặt tài khoản" />
      <ScrollView style={styles.wrapper}>
        <TouchableOpacity
          style={styles.item}
          onPress={() => setShowModal(true)}>
          <CommonText text="Xoá tài khoản" styles={styles.title} />
          <CommonText
            text="Tài khoản của bạn sẽ bị xoá vĩnh viễn. Lịch sử đơn hàng và các thông tin khác cũng bị xoá"
            styles={styles.label}
          />
        </TouchableOpacity>
      </ScrollView>
      <Modal
        isVisible={showModal}
        style={styles.modal}
        onBackdropPress={onBackdropPress}>
        <View style={styles.contentModal}>
          <View style={styles.itemModal}>
            <CommonText
              text="Bạn có chắc chắn muốn xoá ?"
              styles={styles.labelModal}
            />
          </View>
          <TouchableOpacity
            style={styles.itemModal}
            onPress={() => deleteAccount()}>
            <CommonText text="Có, xoá ngay" styles={styles.textLogout} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.itemCancel}
            onPress={() => setShowModal(false)}>
            <CommonText text="Huỷ" styles={styles.labelModal} />
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  )
}

export default AccountSetting
