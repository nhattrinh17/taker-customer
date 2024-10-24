import { Colors } from 'assets/Colors';
import { Fonts } from 'assets/Fonts';
import CommonButton from 'components/Button';
import CommonText from 'components/CommonText';

import React, { useState } from 'react';
import { StyleSheet, View, Platform, TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { navigate } from 'navigation/utils/navigationUtils';
import CommonTextFieldV1 from 'components/CommonTextFieldV1';
import { Icons } from 'assets/icons';
import { appStore } from 'state/app';
import { useForgotPassword, useLogin } from 'services/src/auth';
import { userStore } from 'state/user';
import { userInfo } from 'state/user/typings';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    flexDirection: 'row',
    justifyContent: 'center',
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
  forgetPassword: {
    textAlign: 'center',
    fontSize: Fonts.fontSize[15],
    color: Colors.textPrimary,
    marginBottom: 8,
    paddingVertical: 4,
  },
  error: {
    color: Colors.red,
    marginBottom: 8,
    textAlign: 'center',
  },
});

const LoginAppV2 = () => {
  const { setLoading } = appStore(state => state);
  const { setToken, setUser } = userStore(state => state);
  const { triggerLogin } = useLogin();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string>('');
  const { triggerForgotPassword } = useForgotPassword();

  const onFilledPass = async (_value: string) => {
    try {
      setLoading(true);
      const response = await triggerLogin({ phone, password: _value });
      if (response.type === 'success') {
        setToken(response.data.token);
        const newUser: userInfo = {
          id: response.data.user.id,
          fullName: response.data.user.fullName,
        };
        setUser(newUser);
      }
    } catch (err: any) {
      console.log('err', err);
      if (err?.data?.message === 'Invalid phone or password') {
        setError('Mật khẩu không đúng. Vui lòng nhập lại mật khẩu');
        return;
      } else if (err?.data?.message === 'User is not verified') {
        setError('Tài khoản chưa được xác thực. Vui lòng ấn Quên mật khẩu để xác thực tài khoản');
        return;
      }
    } finally {
      setLoading(false);
    }
  };

  const forgetPassword = async () => {
    try {
      if (phone) {
        setLoading(true);
        const response = await triggerForgotPassword({ phone });
        if (response?.type === 'success') {
          navigate('Otp', { phone, userId: response.data.userId, isForget: true });
        }
      } else {
        setError('Vui lòng nhập số điện thoại');
        return;
      }
    } catch (err) {
      console.error('Error fetching userId:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView keyboardShouldPersistTaps="handled" enableOnAndroid={false} enableAutomaticScroll={Platform.OS === 'ios'} contentContainerStyle={styles.container}>
        <View style={styles.wrapper}>
          <View>
            <CommonText styles={styles.title} text="Đăng nhập tài khoản" />
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
          </View>

          <TouchableOpacity onPress={forgetPassword}>
            <CommonText text="Quên mật khẩu" styles={styles.forgetPassword} />
          </TouchableOpacity>
          {error !== '' && <CommonText text={error} styles={styles.error} />}
          <CommonButton isDisable={!phone && !password ? true : false} text="Đăng nhập" onPress={() => onFilledPass(password)} />
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default LoginAppV2;
