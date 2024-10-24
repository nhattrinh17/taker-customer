import { Colors } from 'assets/Colors';
import React from 'react';
import { StyleSheet, TextInput, View, Dimensions, Text, KeyboardTypeOptions, Touchable, TouchableOpacity } from 'react-native';
import CommonText from './CommonText';
import { Fonts } from 'assets/Fonts';
import { Icons } from 'assets/icons';
import { SvgProps } from 'react-native-svg';

const styles = StyleSheet.create({
  containerInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingBottom: 12,
    justifyContent: 'space-between',
  },
  labelBox: {
    marginBottom: 8,
    flexDirection: 'row',
  },
  label: {
    fontWeight: '800',
    fontSize: Fonts.fontSize[13],
  },
  required: {
    color: Colors.red,
    marginTop: 2,
  },
  wrapperInput: {
    height: 48,
    flex: 1,
    maxWidth: Dimensions.get('screen').width * 0.65,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: Colors.border,
    borderRadius: 8,
    position: 'relative',
  },
  input: {
    flex: 1,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  error: {
    color: Colors.red,
    lineHeight: 20,
    marginBottom: 12,
  },
  icon: {
    width: 24,
    height: 24,
    position: 'absolute',
    right: 16,
    top: 12,
  },
});

interface InputProps {
  label: string;
  value?: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  editable?: boolean | true;
  keyboardType?: KeyboardTypeOptions;
  secureTextEntry?: boolean;
  icon?: React.FC<SvgProps>;
  onPressIcon?: () => void;
}

const CommonTextFieldV1 = (props: InputProps) => {
  return (
    <View style={[styles.containerInput]}>
      <View style={styles.labelBox}>
        <CommonText styles={styles.label} text={props.label} />
      </View>
      <View style={styles.wrapperInput}>
        <TextInput keyboardType={props.keyboardType || 'default'} allowFontScaling={false} {...props} style={styles.input} value={props.value} onChangeText={props.onChangeText} placeholderTextColor={Colors.textSecondary} placeholder={props.placeholder} editable={props.editable} />
        {props.icon ? (
          <TouchableOpacity onPress={props.onPressIcon} style={styles.icon}>
            <props.icon />
          </TouchableOpacity>
        ) : (
          <></>
        )}
      </View>
    </View>
  );
};
export default CommonTextFieldV1;
