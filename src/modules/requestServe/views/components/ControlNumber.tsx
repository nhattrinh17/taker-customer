import {Colors} from 'assets/Colors'
import {Fonts} from 'assets/Fonts'
import CommonText from 'components/CommonText'
import React from 'react'
import {View, StyleSheet, TouchableOpacity} from 'react-native'

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: Colors.gallery,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  btControlPlus: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderLeftWidth: 1,
    borderLeftColor: Colors.gallery,
  },
  btControlMinus: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: Colors.gallery,
  },
  count: {
    color: Colors.black,
    paddingHorizontal: 12,
    fontWeight: '700',
    fontFamily: Fonts.fontFamily.AvertaBold,
  },
  textControl: {
    color: Colors.textSecondary,
  },
})

interface Props {
  count: number
  onPressMinus: () => void
  onPressPlus: () => void
}

const ControlNumber = ({onPressMinus, onPressPlus, count}: Props) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.btControlMinus} onPress={onPressMinus}>
        <CommonText text="-" styles={styles.textControl} />
      </TouchableOpacity>
      <CommonText text={`${count}`} styles={styles.count} />
      <TouchableOpacity style={styles.btControlPlus} onPress={onPressPlus}>
        <CommonText text="+" styles={styles.textControl} />
      </TouchableOpacity>
    </View>
  )
}

export default React.memo(ControlNumber)
