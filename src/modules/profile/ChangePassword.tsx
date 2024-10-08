import {Colors} from 'assets/Colors'
import {Fonts} from 'assets/Fonts'
import {Icons} from 'assets/icons'
import CommonText from 'components/CommonText'
import Header from 'components/Header'
import React, {MutableRefObject, useEffect, useRef, useState} from 'react'
import {Platform, StyleSheet, TextInput, View, Dimensions} from 'react-native'
import {OtpInput} from 'react-native-otp-entry'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import {navigate} from 'navigation/utils/navigationUtils'
import {useUpdatePassword} from 'services/src/profile'
import Modal from 'react-native-modal'
import {userStore} from 'state/user'

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: Colors.white,
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  content: {
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    backgroundColor: Colors.white,
  },
  desc: {
    fontSize: Fonts.fontSize[16],
  },
  phoneNumber: {
    fontFamily: Fonts.fontFamily.AvertaBold,
    fontSize: Fonts.fontSize[20],
    color: Colors.black,
    lineHeight: 26,
  },
  textOTP: {
    textAlign: 'center',
    lineHeight: 18,
    fontSize: Fonts.fontSize[16],
  },
  rowInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 8,
    marginTop: 18,
  },
  inputOTP: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.border,
    width: (Dimensions.get('screen').width - 50 - 14) / 6,
    textAlign: 'center',
  },
  textValueOTP: {
    fontFamily: Fonts.fontFamily.AvertaRegular,
    fontSize: 60,
    lineHeight: 60,
    color: Colors.black,
  },
  modal: {
    flex: 1,
    justifyContent: 'center',
  },
  contentModal: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingTop: 38,
    paddingBottom: 42,
    justifyContent: 'center',
    alignItems: 'center',
  },
  success: {
    fontWeight: '600',
    marginTop: 8,
    color: Colors.textPrimary,
  },
})

const ChangePassword = () => {
  const {trigger} = useUpdatePassword()
  const [showModal, setShowModal] = useState<boolean>(false)
  const user = userStore(state => state.user)

  const refInput: MutableRefObject<TextInput | undefined>[] = [
    useRef(),
    useRef(),
    useRef(),
    useRef(),
  ]

  useEffect(() => {
    if (refInput?.[0]) {
      refInput?.[0]?.current?.focus()
    }
  }, [])

  const onFilledOTP = async (_value: string) => {
    try {
      const response = await trigger({password: _value, id: user.id})
      if (response.type === 'success') {
        setShowModal(true)
        setTimeout(() => {
          setShowModal(false)
          navigate('Person')
        }, 3000)
      }
    } catch (err) {
      console.log('Error ==>', err)
    }
  }

  const onBackdropPress = () => {
    setShowModal(false)
  }

  return (
    <View style={styles.wrapper}>
      <Header title="Đổi mật khẩu" />
      <KeyboardAwareScrollView
        enableOnAndroid={false}
        enableAutomaticScroll={Platform.OS === 'ios'}
        contentContainerStyle={styles.container}>
        <View style={styles.content}>
          <CommonText text="Đặt mật khẩu mới" styles={styles.desc} />
          <OtpInput
            secureTextEntry={true}
            numberOfDigits={6}
            focusColor={Colors.main}
            onFilled={onFilledOTP}
            theme={{
              containerStyle: styles.rowInput,
              pinCodeContainerStyle: {
                ...styles.inputOTP,
                borderWidth: 0,
              },
              pinCodeTextStyle: {...styles.textValueOTP},
            }}
          />
          <Modal
            isVisible={showModal}
            style={styles.modal}
            onBackdropPress={onBackdropPress}>
            <View style={styles.contentModal}>
              <Icons.Success />
              <CommonText
                text="Đổi mật khẩu thành công"
                styles={styles.success}
              />
            </View>
          </Modal>
        </View>
      </KeyboardAwareScrollView>
    </View>
  )
}

export default ChangePassword
