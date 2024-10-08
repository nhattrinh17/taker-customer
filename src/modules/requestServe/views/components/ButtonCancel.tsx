import CommonText from 'components/CommonText'
import React from 'react'

import {StyleSheet, TouchableOpacity, ViewStyle} from 'react-native'
import {Colors} from 'assets/Colors'
import {Fonts} from 'assets/Fonts'

const styles = StyleSheet.create({
  btCancel: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.lavenderBlush,
    height: 40,
    width: '100%',
    borderRadius: 6,
    alignSelf: 'center',
  },
  title: {
    color: Colors.red,
    fontWeight: '700',
    fontFamily: Fonts.fontFamily.AvertaBold,
  },
})

interface Props {
  title: string
  onPress: () => void
  style?: ViewStyle
}

const ButtonCancel = ({title, onPress, style}: Props) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.btCancel, style]}>
      <CommonText text={title} styles={styles.title} />
    </TouchableOpacity>
  )
}

export default ButtonCancel
