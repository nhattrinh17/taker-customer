import React from 'react'
import {Platform, StyleSheet, View, Dimensions} from 'react-native'
import {Colors} from 'assets/Colors'
import {Fonts} from 'assets/Fonts'
import CommonText from 'components/CommonText'
import Header from 'components/Header'
import {OtpInput} from 'react-native-otp-entry'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import {RouteProp} from '@react-navigation/native'
import {RootNavigatorParamList} from 'navigation/typings'
import {useUpdate, useLogin} from 'services/src/auth'
import {userStore} from 'state/user'
import {appStore} from 'state/app'
import {userInfo} from 'state/user/typings'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  content: {
    justifyContent: 'center',
    paddingHorizontal: 20,
    flex: 0.5,
    backgroundColor: Colors.white,
  },
  desc: {
    textAlign: 'center',
    fontSize: Fonts.fontSize[20],
    fontWeight: '600',
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
})

interface Props {
  route: RouteProp<RootNavigatorParamList, 'NewPassword'>
}

const NewPassword = (props: Props) => {
  const setLoading = appStore(state => state.setLoading)
  const setToken = userStore(state => state.setToken)
  const setUser = userStore(state => state.setUser)
  const {triggerUpdate} = useUpdate()
  const {triggerLogin} = useLogin()
  const {userId, phone, otp, fullName, referralCode} = props?.route?.params

  const login = async (phone: string, password: string) => {
    try {
      setLoading(true)
      const response = await triggerLogin({phone, password})
      if (response.type === 'success') {
        setToken(response.data.token)
        const newUser: userInfo = {
          id: response.data.user.id,
          fullName: response.data.user.fullName,
        }
        setUser(newUser)
      } else {
        console.error('Login failed:', response)
      }
    } catch (err) {
      console.error('Error during login:', err)
    } finally {
      setLoading(false)
    }
  }

  const onFilledPassword = async (_value: string) => {
    try {
      setLoading(true)
      const response = await triggerUpdate({
        userId,
        password: _value,
        otp,
        fullName,
        referralCode,
      })
      if (response.type !== 'success') {
        throw new Error(`Update failed with response type: ${response.type}`)
      }
      login(phone, _value)
    } catch (err) {
      console.error('Error during update:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <Header />
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={false}
        enableAutomaticScroll={Platform.OS === 'ios'}
        contentContainerStyle={styles.container}>
        <View style={styles.content}>
          <CommonText text="Mật khẩu mới" styles={styles.desc} />
          <OtpInput
            secureTextEntry={true}
            numberOfDigits={6}
            focusColor={Colors.main}
            onFilled={onFilledPassword}
            theme={{
              containerStyle: styles.rowInput,
              pinCodeContainerStyle: {
                ...styles.inputOTP,
                borderWidth: 0,
              },
              pinCodeTextStyle: {...styles.textValueOTP},
            }}
          />
        </View>
      </KeyboardAwareScrollView>
    </View>
  )
}

export default NewPassword
