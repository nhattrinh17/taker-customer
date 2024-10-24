import { Colors } from 'assets/Colors';
import { Fonts } from 'assets/Fonts';
import React, { ReactElement, ReactNode } from 'react';
import { StyleSheet, TextStyle, TouchableOpacity, ViewStyle, Dimensions } from 'react-native';
import CommonText from './CommonText';
import { BallIndicator } from 'react-native-indicators';

const style = StyleSheet.create({
  text: {
    fontSize: Fonts.fontSize[16],
    fontFamily: Fonts.fontFamily.AvertaSemiBold,
    fontWeight: '600',
    color: Colors.white,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  linear: {
    height: 48,
    borderRadius: 10,
    width: Dimensions.get('screen').width - 32,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: Colors.main,
  },
});

interface ButtonProps {
  text: string;
  color?: string;
  textStyles?: TextStyle;
  buttonStyles?: ViewStyle;
  onPress: () => void | Promise<void>;
  isDisable?: boolean;
  backgroundColor?: string;
  children?: ReactElement | ReactNode;
  isLoading?: boolean;
}

const CommonButton = (props: ButtonProps) => {
  const { text, textStyles = {}, onPress, isDisable = false, buttonStyles = {}, children, isLoading = false } = props;

  const backgroundColor = isLoading || isDisable ? Colors.mainDisable : Colors.main;
  const color = isDisable ? Colors.nobel : Colors.white;

  return (
    <TouchableOpacity onPress={onPress} disabled={isDisable} style={{ ...style.linear, ...buttonStyles, backgroundColor }}>
      {children && children}
      {isLoading ? <BallIndicator size={24} color={Colors.main} animationDuration={600} /> : <CommonText styles={{ ...style.text, color, ...textStyles }} text={text || ''} />}
    </TouchableOpacity>
  );
};

export default CommonButton;
