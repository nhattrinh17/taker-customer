import React, {useRef, useState} from 'react'
import {Animated, StyleSheet, TouchableOpacity} from 'react-native'
import CommonText from './CommonText'
import {Icons} from 'assets/icons'
import ActionSheet, {ActionSheetRef} from 'react-native-actions-sheet'
import {Colors} from 'assets/Colors'

const styles = StyleSheet.create({
  btDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.seaShell,
    borderRadius: 8,
    borderWidth: 1,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderColor: Colors.border,
  },
  itemDropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  actionSheet: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 16,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
})

const Dropdown = ({data, onPress, itemActive}: components.DropdownProps) => {
  const actionSheetRef = useRef<ActionSheetRef>(null)
  const [showModal, setShowModal] = useState(false)
  const spinValue = useRef(new Animated.Value(0)).current

  const onPressDropdown = () => {
    Animated.spring(spinValue, {
      toValue: showModal ? 0 : 1,
      useNativeDriver: true,
    }).start()
    if (showModal) {
      actionSheetRef?.current?.hide()
    } else {
      actionSheetRef?.current?.show()
    }
    setShowModal(!showModal)
  }

  const onPressItem = (item: components.ItemDropdown) => () => {
    onPress(item)
    onPressDropdown()
  }

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  })

  const onCloseActionSheet = () => {
    onPressDropdown()
  }

  return (
    <>
      <TouchableOpacity style={styles.btDropdown} onPress={onPressDropdown}>
        <CommonText text={itemActive?.name} />
        <Animated.View style={{transform: [{rotate: spin}]}}>
          <Icons.Down />
        </Animated.View>
      </TouchableOpacity>

      <ActionSheet
        ref={actionSheetRef}
        containerStyle={styles.actionSheet}
        onClose={onCloseActionSheet}>
        {data.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={onPressItem(item)}
            style={styles.itemDropdown}>
            <CommonText text={item?.name} />
            {item.id === itemActive.id ? (
              <Icons.Checked />
            ) : (
              <Icons.UnChecked />
            )}
          </TouchableOpacity>
        ))}
      </ActionSheet>
    </>
  )
}

export default Dropdown
