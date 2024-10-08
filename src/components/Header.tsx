import {Colors} from 'assets/Colors'
import {Fonts} from 'assets/Fonts'
import React from 'react'
import {StyleSheet, TouchableOpacity, View, Platform} from 'react-native'
import CommonText from './CommonText'
import {Icons} from 'assets/icons'
import {goBack} from 'navigation/utils/navigationUtils'
import {useSafeAreaInsets} from 'react-native-safe-area-context'

const style = StyleSheet.create({
  text: {
    fontSize: Fonts.fontSize[18],
    fontFamily: Fonts.fontFamily.AvertaBold,
    color: Colors.black,
    lineHeight: 24,
    fontWeight: '700',
  },
  wrapperHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.white,
    zIndex: 999,
    ...Platform.select({
      android: {
        // paddingTop: 40,
      },
    }),
  },
  empty: {
    width: 25,
  },
  safeArea: {
    backgroundColor: Colors.white,
    zIndex: 1999,
  },
  btBack: {
    width: 25,
  },
  shadow: {
    // shadowColor: '#22313F',
    // shadowOffset: {
    //   width: 0,
    //   height: 10,
    // },
    // shadowOpacity: 0.08,
    // shadowRadius: 6,
    // elevation: 4, // Only for Android
  },
})

interface HeaderProps {
  title?: string
  onPress?: () => void
  hideIconBack?: boolean
  shadow?: boolean
}

const Header = (props: HeaderProps) => {
  const {top} = useSafeAreaInsets()
  const {title = '', onPress, hideIconBack = false, shadow = true} = props

  const headerStyle = [style.wrapperHeader, shadow && style.shadow]

  const onPressBack = () => {
    if (onPress) {
      return onPress()
    }
    goBack()
  }
  return (
    <View style={{marginTop: top}}>
      <View style={headerStyle}>
        <TouchableOpacity
          onPress={onPressBack}
          style={style.btBack}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
          {!hideIconBack && <Icons.Back />}
        </TouchableOpacity>
        <CommonText text={title} styles={style.text} />
        <View style={style.empty} />
      </View>
    </View>
  )
}

export default Header
