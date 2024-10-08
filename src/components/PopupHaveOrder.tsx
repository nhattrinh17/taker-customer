import React, {useRef, forwardRef, useImperativeHandle} from 'react'
import {StyleSheet, View} from 'react-native'
import CommonText from 'components/CommonText'
import ActionSheet, {ActionSheetRef} from 'react-native-actions-sheet'
import {Icons} from 'assets/icons'
import {Fonts} from 'assets/Fonts'
import {Colors} from 'assets/Colors'

const styles = StyleSheet.create({
  actionSheet: {
    paddingHorizontal: 28,
    paddingBottom: 58,
    paddingTop: 50,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    marginTop: 22,
    fontFamily: Fonts.fontFamily.AvertaBold,
    fontSize: Fonts.fontSize[18],
    fontWeight: 'bold',
    color: '#00AFE6',
    marginBottom: 6,
  },
  desc: {
    color: Colors.textSecondary,
  },
})

interface Props {
  onClose: () => void
}

const PopupHaveOrder = forwardRef<ActionSheetRef, Props>(({onClose}, ref) => {
  const actionSheetRef = useRef<ActionSheetRef>(null)

  useImperativeHandle(
    ref,
    () => {
      return {
        show() {
          actionSheetRef.current?.show()
        },
        hide() {
          actionSheetRef.current?.hide()
        },
      }
    },
    [],
  )

  return (
    <ActionSheet
      ref={actionSheetRef}
      containerStyle={styles.actionSheet}
      onTouchBackdrop={onClose}
      closeOnTouchBackdrop={false}>
      <View style={styles.container}>
        <Icons.PayProcessing />
        <CommonText text="Đang có đơn hàng chờ!" styles={styles.title} />
        <CommonText
          text="Bạn đang có đơn hàng chưa hoàn tất, vui lòng huỷ đơn hoặc đặt lịch để tiếp tục tạo đơn hàng mới"
          styles={styles.desc}
        />
      </View>
    </ActionSheet>
  )
})

export default PopupHaveOrder
