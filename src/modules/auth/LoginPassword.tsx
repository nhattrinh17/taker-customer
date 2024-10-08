import {Colors} from 'assets/Colors'
import {Fonts} from 'assets/Fonts'
import CommonText from 'components/CommonText'
import Header from 'components/Header'
import React, {useState} from 'react'
import {
  Platform,
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
} from 'react-native'
import {OtpInput} from 'react-native-otp-entry'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import {navigate} from 'navigation/utils/navigationUtils'
import {userStore} from 'state/user'
import {RouteProp} from '@react-navigation/native'
import {RootNavigatorParamList} from 'navigation/typings'
import {useLogin, useForgotPassword} from 'services/src/auth'
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
  rowInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 8,
    marginTop: 18,
  },
  inputPass: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.border,
    width: (Dimensions.get('screen').width - 50 - 14) / 6,
    textAlign: 'center',
  },
  textValuePass: {
    fontFamily: Fonts.fontFamily.AvertaRegular,
    fontSize: 60,
    lineHeight: 60,
    color: Colors.black,
  },
  forgetPassword: {
    textAlign: 'center',
    fontSize: Fonts.fontSize[15],
    color: Colors.textPrimary,
    marginTop: 30,
  },
  error: {
    color: Colors.red,
    marginTop: 16,
    textAlign: 'center',
  },
})

interface Props {
  route: RouteProp<RootNavigatorParamList, 'LoginPassword'>
}

const LoginPassword = (props: Props) => {
  const setLoading = appStore(state => state.setLoading)
  const {triggerLogin} = useLogin()
  const {triggerForgotPassword} = useForgotPassword()
  const {phone} = props?.route?.params
  const [error, setError] = useState<string>('')
  const setToken = userStore(state => state.setToken)
  const setUser = userStore(state => state.setUser)

  const onChangePass = (text: string) => {
    if (text) {
      setError('')
    }
  }

  const onFilledPass = async (_value: string) => {
    try {
      setLoading(true)
      const response = await triggerLogin({phone, password: _value})
      if (response.type === 'success') {
        setToken(response.data.token)
        const newUser: userInfo = {
          id: response.data.user.id,
          fullName: response.data.user.fullName,
        }
        setUser(newUser)
      }
    } catch (err) {
      console.log('err', err)
      if (err?.data?.message === 'Invalid phone or password') {
        setError('Mật khẩu không đúng. Vui lòng nhập lại mật khẩu')
        return
      } else if (err?.data?.message === 'User is not verified') {
        setError(
          'Tài khoản chưa được xác thực. Vui lòng ấn Quên mật khẩu để xác thực tài khoản',
        )
        return
      }
    } finally {
      setLoading(false)
    }
  }

  const forgetPassword = async () => {
    try {
      setLoading(true)
      const response = await triggerForgotPassword({phone})
      if (response?.type === 'success') {
        navigate('Otp', {phone, userId: response.data.userId, isForget: true})
      }
    } catch (err) {
      console.error('Error fetching userId:', err)
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
          <CommonText text="Mật khẩu" styles={styles.desc} />
          <OtpInput
            secureTextEntry={true}
            numberOfDigits={6}
            focusColor={Colors.main}
            onFilled={onFilledPass}
            onTextChange={onChangePass}
            theme={{
              containerStyle: styles.rowInput,
              pinCodeContainerStyle: {
                ...styles.inputPass,
                borderWidth: 0,
              },
              pinCodeTextStyle: {...styles.textValuePass},
            }}
          />
          {error !== '' && <CommonText text={error} styles={styles.error} />}

          <TouchableOpacity onPress={forgetPassword}>
            <CommonText text="Quên mật khẩu" styles={styles.forgetPassword} />
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </View>
  )
}

export default LoginPassword
