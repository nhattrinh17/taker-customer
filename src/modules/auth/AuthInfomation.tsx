import {Colors} from 'assets/Colors'
import {Fonts} from 'assets/Fonts'
import CommonButton from 'components/Button'
import CommonText from 'components/CommonText'
import Header from 'components/Header'
import React, {useState} from 'react'
import {StyleSheet, View, Platform} from 'react-native'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import {RouteProp} from '@react-navigation/native'
import {RootNavigatorParamList} from 'navigation/typings'
import CommonTextField from 'components/CommonTextField'
import {navigate} from 'navigation/utils/navigationUtils'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  wrapper: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: Colors.white,
  },
  margin: {
    marginTop: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: Fonts.fontSize[18],
    fontWeight: '600',
    marginTop: 20,
  },
  label: {
    fontSize: Fonts.fontSize[14],
    color: Colors.textSecondary,
    marginTop: 8,
  },
})

interface Props {
  route: RouteProp<RootNavigatorParamList, 'AuthInfomation'>
}

const AuthInfomation = (props: Props) => {
  const [fullName, setFullName] = useState<string>('')
  const [referralCode, setReferralCode] = useState<string>('')
  const {userId, phone, otp} = props?.route?.params

  const onChangeFullName = (value: string) => {
    setFullName(value)
  }
  const onChangeCode = (value: string) => {
    setReferralCode(value)
  }

  const onPressContinue = async () => {
    navigate('NewPassword', {
      userId,
      phone,
      otp,
      fullName,
      referralCode,
    })
  }

  return (
    <View style={styles.container}>
      <Header />
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={false}
        enableAutomaticScroll={Platform.OS === 'ios'}
        contentContainerStyle={styles.container}>
        <View style={styles.wrapper}>
          <CommonText
            styles={[styles.title, styles.margin]}
            text="Hoàn tất đăng ký tài khoản"
          />
          <CommonTextField
            label="Họ tên"
            value={fullName}
            onChangeText={onChangeFullName}
            isRequired={true}
            placeholder="Nhập họ tên của bạn"
          />
          <CommonText styles={styles.title} text="Thông tin giới thiệu" />
          <CommonText
            styles={(styles.label, styles.margin)}
            text="Bạn biết đến Taker qua một người bạn ? Nhập mã giới thiệu để Taker gửi đến bạn và người giới thiệu các ưu đãi/quà tặng hấp dẫn nhé!"
          />
          <CommonTextField
            label="Mã giới thiệu"
            value={referralCode}
            onChangeText={onChangeCode}
            placeholder="Nhập mã giới thiệu"
          />
          <CommonButton
            isDisable={fullName === '' ? true : false}
            text="Tiếp tục"
            onPress={onPressContinue}
          />
        </View>
      </KeyboardAwareScrollView>
    </View>
  )
}

export default AuthInfomation
