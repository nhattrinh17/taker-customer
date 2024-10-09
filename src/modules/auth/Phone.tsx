import { Colors } from 'assets/Colors';
import { Fonts } from 'assets/Fonts';
import { Icons } from 'assets/icons';
import CommonButton from 'components/Button';
import CommonText from 'components/CommonText';
import Header from 'components/Header';
import { navigate } from 'navigation/utils/navigationUtils';
import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Platform } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useCreateAccount, useForgotPassword, useVerifyPhoneNumber } from 'services/src/auth';
import { appStore } from 'state/app';
import CheckBox from 'react-native-check-box';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  content: {
    justifyContent: 'center',
    paddingHorizontal: 25,
    flex: 0.6,
    backgroundColor: Colors.white,
  },
  desc: {
    textAlign: 'center',
    fontSize: Fonts.fontSize[20],
    fontWeight: '600',
  },
  wrapperInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: Colors.border,
    marginTop: 14,
  },
  input: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: Fonts.fontSize[26],
    fontFamily: Fonts.fontFamily.AvertaBold,
    paddingHorizontal: 20,
    paddingVertical: 0,
    textAlign: 'center',
    letterSpacing: 4,
    height: 40,
  },
  btContinue: {
    marginTop: 20,
  },
  boxPolicy: {
    paddingTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  textPolicy: {
    fontSize: Fonts.fontSize[16],
  },
});

const Phone = () => {
  const setLoading = appStore(state => state.setLoading);
  const { trigger } = useVerifyPhoneNumber();
  const { triggerCreateAccount } = useCreateAccount();
  const { triggerForgotPassword } = useForgotPassword();
  const [phone, setPhone] = useState<string>('');
  const [confirmPolicy, setConfirmPolicy] = useState(false);

  const isValidPhoneNumber = (phone: string) => {
    const vnPhoneRegex = /^(0|\\+84)[1-9][0-9]{8}$/;
    return vnPhoneRegex.test(phone);
  };

  const handlePhoneNumberChange = (value: string) => {
    setPhone(value);
  };

  const clearPhoneNumber = () => {
    setPhone('');
  };

  const handleContinuePress = async () => {
    try {
      setLoading(true);
      const response = await trigger({ phone });
      if (response.type !== 'success') return;
      if (!response?.data?.isExisted) {
        const responseCreate = await triggerCreateAccount({ phone });
        if (responseCreate.type === 'success') {
          navigate('Otp', {
            phone,
            userId: responseCreate?.data?.userId,
            isForget: false,
          });
        }
      } else {
        if (response?.data?.fullName === null) {
          const responsePass = await triggerForgotPassword({ phone });
          if (responsePass?.type === 'success') {
            navigate('Otp', {
              phone,
              userId: responsePass.data.userId,
              isForget: false,
            });
          }
        } else {
          navigate('LoginPassword', { phone });
        }
      }
    } catch (err) {
      console.log('Error call ===>', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header />
      <KeyboardAwareScrollView keyboardShouldPersistTaps="handled" enableOnAndroid={false} enableAutomaticScroll={Platform.OS === 'ios'} contentContainerStyle={styles.container}>
        <View style={styles.content}>
          <CommonText styles={styles.desc} text="Số điện thoại" />
          <View style={styles.wrapperInput}>
            <TextInput allowFontScaling={false} autoFocus={true} keyboardType="decimal-pad" value={phone} onChangeText={handlePhoneNumberChange} style={styles.input} />

            {phone !== '' && (
              <TouchableOpacity onPress={clearPhoneNumber}>
                <Icons.CloseInput fill={'#ABAFB4'} />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.boxPolicy}>
            <CheckBox
              //
              checkBoxColor={Colors.main}
              style={{ width: 20, height: 20, marginRight: 12 }}
              onClick={() => setConfirmPolicy(pre => !pre)}
              isChecked={confirmPolicy}
              leftText={'CheckBox'}
            />
            <CommonText text="Tôi đồng ý chấp nhận " styles={styles.textPolicy} />
            <TouchableOpacity onPress={() => navigate('CommonWebView', { title: 'Điều khoản và dịch vụ', url: 'https://taker.vn/chinh-sach-bao-mat-va-dieu-kien-su-dung/' })}>
              <CommonText text="điều khoản, dịch vụ" styles={{ ...styles.textPolicy, color: 'blue', textDecorationLine: 'underline' }} />
            </TouchableOpacity>
          </View>
          <CommonButton isDisable={isValidPhoneNumber(phone) && confirmPolicy ? false : true} text="Tiếp tục" onPress={handleContinuePress} buttonStyles={styles.btContinue} />
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default Phone;
