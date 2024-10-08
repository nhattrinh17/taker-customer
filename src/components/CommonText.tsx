import {Colors} from 'assets/Colors'
import {Fonts} from 'assets/Fonts'
import React from 'react'
import {Text, StyleSheet, TextStyle} from 'react-native'

const style = StyleSheet.create({
  text: {
    fontSize: Fonts.fontSize[14],
    fontFamily: Fonts.fontFamily.AvertaRegular,
    color: Colors.textPrimary,
    fontWeight: '400',
  },
})

interface TextProps {
  text: string
  color?: string
  styles?: TextStyle
}

const CommonText = (props: TextProps) => {
  const {text, color = Colors.black, styles = {}} = props
  return (
    <Text allowFontScaling={false} style={[style.text, {color}, styles]}>
      {text || ''}
    </Text>
  )
}

export default CommonText
