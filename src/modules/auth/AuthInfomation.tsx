import { Colors } from 'assets/Colors';
import { Fonts } from 'assets/Fonts';
import CommonButton from 'components/Button';
import CommonText from 'components/CommonText';
import Header from 'components/Header';
import React, { useState } from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { RouteProp } from '@react-navigation/native';
import { RootNavigatorParamList } from 'navigation/typings';
import CommonTextField from 'components/CommonTextField';
import { navigate } from 'navigation/utils/navigationUtils';
import CommonTextFieldV1 from 'components/CommonTextFieldV1';
import { Icons } from 'assets/icons';
import { useCreateAccount, useVerifyPhoneNumber } from 'services/src/auth';
import { appStore } from 'state/app';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    flexDirection: 'row',
    alignItems: 'center',
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
    fontSize: Fonts.fontSize[20],
    fontWeight: '800',
    marginTop: 20,
    textAlign: 'center',
    paddingVertical: 20,
    marginBottom: 40,
  },
  label: {
    fontSize: Fonts.fontSize[14],
    color: Colors.textSecondary,
    marginTop: 8,
  },
});

interface Props {
  route: RouteProp<RootNavigatorParamList, 'AuthInfomation'>;
}

const AuthInfomation = (props: Props) => {
  const setLoading = appStore(state => state.setLoading);
  const { trigger } = useVerifyPhoneNumber();
  const { triggerCreateAccount } = useCreateAccount();
  const [fullName, setFullName] = useState<string>('');
  const [referralCode, setReferralCode] = useState<string>('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string>('');

  const handleContinuePress = async () => {
    try {
      setLoading(true);
      const response = await trigger({ phone });
      console.log('🚀 ~ handleContinuePress ~ response:', response);
      if (response.type !== 'success') return;
      if (!response?.data?.isExisted) {
        const responseCreate = await triggerCreateAccount({ phone, address, fullName, password, referralCode });
        if (responseCreate.type === 'success') {
          navigate('LoginV2');
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
      <KeyboardAwareScrollView keyboardShouldPersistTaps="handled" enableOnAndroid={false} enableAutomaticScroll={Platform.OS === 'ios'} contentContainerStyle={styles.container}>
        <View style={styles.wrapper}>
          <CommonText styles={styles.title} text="Đăng ký tài khoản" />

          <CommonTextFieldV1
            //
            keyboardType="default"
            label="Họ và tên"
            value={fullName}
            onChangeText={(value: string) => {
              error && setError('');
              setFullName(value);
            }}
            placeholder=""
          />
          <CommonTextFieldV1
            //
            keyboardType="number-pad"
            label="Số điện thoại"
            value={phone}
            onChangeText={(value: string) => {
              error && setError('');
              setPhone(value);
            }}
            placeholder=""
          />
          <CommonTextFieldV1
            //
            keyboardType="number-pad"
            label="Mật khẩu"
            value={password}
            onChangeText={(value: string) => {
              error && setError('');
              setPassword(value);
            }}
            placeholder=""
            secureTextEntry={!showPassword}
            icon={showPassword ? Icons.Eye : Icons.EyeHide}
            onPressIcon={() => setShowPassword(pre => !pre)}
          />

          <CommonTextFieldV1
            //
            keyboardType="default"
            label="Địa chỉ"
            value={address}
            onChangeText={(value: string) => {
              error && setError('');
              setAddress(value);
            }}
          />

          <CommonTextFieldV1
            //
            keyboardType="number-pad"
            label="Mã giới thiệu"
            value={referralCode}
            onChangeText={(value: string) => {
              error && setError('');
              setReferralCode(value);
            }}
            placeholder=""
          />

          <CommonButton isDisable={!phone || !fullName || !password || !address} text="Tiếp tục" onPress={handleContinuePress} />
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default AuthInfomation;
