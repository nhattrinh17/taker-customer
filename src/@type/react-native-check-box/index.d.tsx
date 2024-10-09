declare module 'react-native-check-box' {
  import * as React from 'react';
  import { StyleProp, TextStyle, ViewStyle } from 'react-native';

  export interface CheckBoxProps {
    style?: StyleProp<ViewStyle>;
    leftText?: string;
    leftTextStyle?: StyleProp<TextStyle>;
    leftTextView?: React.ReactNode;
    rightText?: string;
    rightTextStyle?: StyleProp<TextStyle>;
    rightTextView?: React.ReactNode;
    checkedImage?: React.ReactElement;
    unCheckedImage?: React.ReactElement;
    isChecked: boolean;
    onClick: () => void;
    disabled?: boolean;
    checkBoxColor?: string;
    checkedCheckBoxColor?: string;
    uncheckedCheckBoxColor?: string;
  }

  export default class CheckBox extends React.Component<CheckBoxProps> {}
}
