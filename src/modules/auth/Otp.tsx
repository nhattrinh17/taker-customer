import {Colors} from 'assets/Colors';
import {Fonts} from 'assets/Fonts';
import CommonText from 'components/CommonText';
import Header from 'components/Header';
import React, {useEffect, useState} from 'react';
import {
  Platform,
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {OtpInput} from 'react-native-otp-entry';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {navigate} from 'navigation/utils/navigationUtils';
import {RouteProp} from '@react-navigation/native';
import {RootNavigatorParamList} from 'navigation/typings';
import {useSendSMS, useVerifyOtp} from 'services/src/auth';
import {appStore} from 'state/app';
import {showMessageError} from 'utils/index';

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
    marginTop: 70,
  },

  rowInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 10,
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
    fontSize: Fonts.fontSize[26],
    color: Colors.black,
  },
  resend: {
    justifyContent: 'center',
    marginTop: 70,
  },
  label: {
    fontSize: Fonts.fontSize[16],
    textAlign: 'center',
    color: Colors.textSecondary,
  },
  btnResend: {
    marginTop: 10,
    fontSize: Fonts.fontSize[16],
    textAlign: 'center',
    fontWeight: '600',
    color: Colors.main,
  },
  error: {
    color: Colors.red,
    marginTop: 16,
    textAlign: 'center',
  },
});

interface Props {
  route: RouteProp<RootNavigatorParamList, 'Otp'>;
}

const Otp = (props: Props) => {
  const {phone, userId, isForget} = props?.route?.params;
  const {triggerSendSMS} = useSendSMS();
  const {setLoading} = appStore(state => state);

  const {triggerVerifyOtp} = useVerifyOtp();
  const [error, setError] = useState<string>('');

  const [count, setCount] = useState(20);
  useEffect(() => {
    if (count > 0) {
      const timerId = setTimeout(() => {
        setCount(count - 1);
      }, 1000);
      return () => clearTimeout(timerId);
    }
  }, [count]);

  const onFilledOTP = async (_value: string) => {
    try {
      const response = await triggerVerifyOtp({userId, otp: _value});
      if (response.type === 'success') {
        isForget
          ? navigate('NewPassword', {userId, phone, otp: _value})
          : navigate('AuthInfomation', {userId, phone, otp: _value});
      }
    } catch (err) {
      setError('Mã xác thực sai. Vui lòng nhập lại');
    }
  };

  const onChangeOTP = (_text: string) => {
    setError('');
  };

  const resendOTP = async () => {
    try {
      setLoading(true);
      const response = await triggerSendSMS({phone});
      if (response?.type?.toUpperCase() === 'SUCCESS') {
        setCount(20);
      }
    } catch (err) {
      showMessageError('Có lỗi xảy ra, vui lòng thử lại sau!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header />
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={false}
        enableAutomaticScroll={Platform.OS === 'ios'}
        contentContainerStyle={styles.container}>
        <View style={styles.content}>
          {/* <CommonText
            text={`Taker đang thực hiện cuộc gọi tới ${phone}. Vui lòng chờ trong giây lát.`}
            styles={styles.label}
          /> */}
          <CommonText
            text={`MÃ OTP ĐƯỢC GỬI VÀO TIN NHẮN CỦA BẠN SAU 20 GIÂY`}
            styles={styles.label}
          />

          <CommonText text="Mã xác thực" styles={styles.desc} />
          <OtpInput
            secureTextEntry={false}
            numberOfDigits={4}
            focusColor={Colors.main}
            onFilled={onFilledOTP}
            onTextChange={onChangeOTP}
            theme={{
              containerStyle: styles.rowInput,
              pinCodeContainerStyle: {
                ...styles.inputOTP,
                borderWidth: 0,
              },
              pinCodeTextStyle: {...styles.textValueOTP},
            }}
          />

          {error !== '' && <CommonText text={error} styles={styles.error} />}

          <View style={styles.resend}>
            <CommonText text="Không nhận được mã OTP?" styles={styles.label} />
            {count > 0 ? (
              <CommonText
                text={`Gửi lại mã sau ${count}s`}
                styles={styles.label}
              />
            ) : (
              <TouchableOpacity onPress={() => resendOTP()}>
                <CommonText text="Gửi lại mã" styles={styles.btnResend} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default Otp;
